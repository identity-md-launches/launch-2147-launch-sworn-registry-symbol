#!/usr/bin/env python3
"""Check the exact Sworn 1.0.2 source and export without building or writing files."""

import argparse
import hashlib
import json
import tarfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMMIT = "a4ee0244262b4e5cf8f3d22129814f5b74c7dec4"


def digest(data):
    return hashlib.sha256(data).hexdigest()


def verify(archive=None):
    manifest = json.loads((ROOT / "artifacts/export-manifest.json").read_text())
    assert manifest["commit"] == COMMIT
    assert manifest["sourceOmissions"] == []
    assert manifest["productionBuildRun"] is False
    upstream = {"web": {}, "dist": {}}
    if archive:
        with tarfile.open(archive) as source:
            for entry in source.getmembers():
                parts = Path(entry.name).parts
                if len(parts) < 3 or parts[1] not in upstream:
                    continue
                assert parts[0] == "sworn-" + COMMIT, "Unexpected archive root"
                assert entry.isfile() or entry.isdir(), "Unexpected archive file type"
                if entry.isfile():
                    upstream[parts[1]][Path(*parts[2:]).as_posix()] = source.extractfile(entry).read()
    for name, count, size in (("web", 347, 3925581), ("dist", 90, 2440774)):
        folder = ROOT / name
        paths = list(folder.rglob("*"))
        assert not any(p.is_symlink() for p in paths), f"Symlink in {name}"
        actual = {p.relative_to(folder).as_posix(): p.read_bytes() for p in paths if p.is_file()}
        expected = {entry["path"]: entry for entry in manifest[name]["files"]}
        assert set(actual) == set(expected), f"Missing or extra files in {name}"
        assert len(actual) == manifest[name]["fileCount"] == count
        assert sum(map(len, actual.values())) == manifest[name]["bytes"] == size
        for path, data in actual.items():
            record = expected[path]
            assert len(data) == record["bytes"] and digest(data) == record["sha256"], f"Changed: {name}/{path}"
            if "gitBlob" in record:
                assert hashlib.sha1(b"blob " + str(len(data)).encode() + b"\0" + data).hexdigest() == record["gitBlob"]
        tree = "".join(f"{path}\0{digest(data)}\n" for path, data in sorted(actual.items()))
        assert digest(tree.encode()) == manifest[name]["treeSha256"]
        if archive:
            assert actual == upstream[name], f"{name} differs from the independent upstream archive"
        print(f"PASS {name}/: {count} files, {size:,} bytes; exact paths and contents.")
    if archive:
        print("PASS direct comparison with the pinned GitHub archive; no omissions or additions.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive", type=Path, help="GitHub codeload tar.gz of the pinned commit")
    verify(parser.parse_args().archive)
