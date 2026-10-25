#!/usr/bin/env python3
"""Verify the immutable Sworn v2 export and source without installing or building.

Optionally compare directly to GitHub's downloaded archive of the pinned commit:
  python3 tools/verify-sworn-v2.py --archive /path/to/pinned-commit.tar.gz
"""
import argparse
import hashlib
import json
import os
import tarfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
COMMIT = "f4e16276a954f0c9c7327733ba6adee298279fa6"


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def files(directory, excluded=()):
    result = {}
    for parent, directories, names in os.walk(directory):
        directories[:] = sorted(name for name in directories if name not in excluded)
        for name in sorted(names):
            item = Path(parent) / name
            if item.is_file():
                result[item.relative_to(directory).as_posix()] = item.read_bytes()
    return result


def verify(archive=None):
    manifest = json.loads((ROOT / "artifacts/export-manifest.json").read_text())
    assert manifest["commit"] == COMMIT, "Wrong upstream commit"
    exported = files(ROOT / "dist")
    expected = {entry["path"]: entry for entry in manifest["dist"]["files"]}
    assert set(exported) == set(expected), "Export contains missing or extra files"
    assert len(exported) == manifest["dist"]["fileCount"] == 85
    for name, data in exported.items():
        entry = expected[name]
        assert len(data) == entry["bytes"], f"Size changed: dist/{name}"
        assert sha256(data) == entry["sha256"], f"Bytes changed: dist/{name}"
        git_blob = b"blob " + str(len(data)).encode() + b"\0" + data
        assert hashlib.sha1(git_blob).hexdigest() == entry["gitBlob"], name
    total = sum(map(len, exported.values()))
    assert total == manifest["dist"]["bytes"] == 2305898

    # Dependency installation is intentionally ignored here, including its caches.
    source = files(ROOT / "web", excluded={"node_modules", ".cache", ".vite"})
    digest = sha256("".join(f"{name}\0{sha256(data)}\n" for name, data in sorted(source.items())).encode())
    assert digest == manifest["web"]["treeSha256"], "Pinned web source changed"
    assert len(source) == manifest["web"]["fileCount"] == 227
    assert sum(map(len, source.values())) == manifest["web"]["bytes"]

    if archive:
        with tarfile.open(archive) as upstream:
            upstream_files = {"dist": {}, "web": {}}
            for entry in upstream.getmembers():
                parts = Path(entry.name).parts
                if len(parts) < 3 or not entry.isfile() or parts[1] not in upstream_files:
                    continue
                assert parts[0] == "sworn-" + COMMIT, "Unexpected archive root"
                name = Path(*parts[2:]).as_posix()
                if parts[1] == "web" and name == ".gitignore":
                    continue
                upstream_files[parts[1]][name] = upstream.extractfile(entry).read()
        assert exported == upstream_files["dist"], "Export differs from upstream archive"
        assert source == upstream_files["web"], "Source differs from upstream archive"

    print(f"PASS: all 85 dist files ({total:,} bytes) and 227 source files match the pinned release.")
    if archive:
        print("PASS: independent archive comparison; no files missing, modified or added to dist/.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--archive", type=Path)
    verify(parser.parse_args().archive)
