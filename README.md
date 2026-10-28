# Sworn · 1.0.2

This release replaces the site under the existing **sworn** name (`sworn.site.identitymd.eth`) with the exact `web/` and `dist/` folders from [banse/sworn, commit `a4ee0244262b4e5cf8f3d22129814f5b74c7dec4`](https://github.com/banse/sworn/tree/a4ee0244262b4e5cf8f3d22129814f5b74c7dec4), release branch `sworn-web-1.0.2`. No file in either folder was edited, omitted or added. **No production build was run for this delivery.** The publisher serves repository-root `dist/` after submission; it does not need to rebuild the source.

| Delivered folder | Files | Bytes |
| --- | ---: | ---: |
| `web/` — source, dependency manifest, lockfile, tests and public assets | 347 | 3,925,581 |
| `dist/` — complete upstream production export | 90 | 2,440,774 |

The app reads Ethereum mainnet, public RPCs, `api.imd.fun`, IPFS gateways and `https://sworn.vibingco.de/api` from the visitor's browser. Its Registry remains **`0x0da2679000ea5380d1361cc3cca7d4e8c881f766` (launch 2404)**. The hosting project's older launch-2147 contracts, Solidity sources and records are preserved. No contract was deployed or retargeted.

## Preview the delivered site

No dependency installation is needed. From the repository root:

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173/`. Vite's `base: './'`, relative assets and hash navigation support gateway subpaths. Browser validation also served these files under `/preview/`. The entry includes a title, description, favicon, `og:title` and local `og:image`.

The home page explores a public wallet without connecting. Explorer, Sworn Card, Wallet Facts, Fact Check, Community Facts and About are in the main navigation; More exposes Curator and integration resources. The empty Explorer has an explicitly labeled interactive preview; Clear wallet returns to it. Completed Fact Check results can be downloaded as PNG images. `docs/index.html` is the bundled searchable handbook. Existing hash-route aliases remain. Wallet connection retains EIP-6963 discovery, wallet-app browser links and Coinbase's connector. Paid actions require the visitor's wallet.

## Install and rebuild for future development

The worker checks used Node **24.21.0** and npm **11.19.0**. Use a compatible Node 24/npm 11 installation. The pinned source already contains its public assets; no regeneration step is needed for this release.

```sh
cd web
npm ci
npm run typecheck
npm test
npm run build
npm run verify:export
npm run preview
```

Open the preview URL printed by Vite. `npm run dev` serves the development source. The production build verifies source/ABI pins, builds into `../dist/`, writes the deployment asset manifest and checks the static release. These are future rebuild instructions, not commands run for this exact-copy delivery. A rebuild replaces the supplied export and must be reviewed as a new release. Keep dependencies, caches and browser downloads outside Git; no vendored npm registry is required.

## Verify release integrity

[`artifacts/export-manifest.json`](artifacts/export-manifest.json) records every delivered path, size and SHA-256, export Git blob hashes and source/export tree digests. Check without building:

```sh
python3 tools/verify-sworn-release.py
node web/scripts/manifest.mjs --check
node web/scripts/static-release.mjs
```

For an independent comparison, download GitHub's archive of the pinned commit and pass its local path to `python3 tools/verify-sworn-release.py --archive /path/to/archive.tar.gz`. This checks both folders, including extra and missing files. Older `tools/*sworn-v2*` scripts refer to historical releases.

## Worker validation · 2026-10-28

Both folders were copied from the commit archive and compared independently with GitHub's recursive tree API: **all 437 paths and Git blob hashes match**. No production build or asset generation ran. The source manifest and lockfile contain the upstream 1.0.2 version labels; dependency versions and build configuration are unchanged from the previous release.

Dependencies were installed only in a temporary copy with `npm ci --ignore-scripts --no-audit --no-fund`. That copy also contained the exact export and the upstream `agents/sworn/SKILL.md` and `llms.txt` test inputs (identical to this repository's files). The following are this worker's results, not upstream claims:

| Check | Actual result |
| --- | --- |
| Exact archive and GitHub blob comparison | 437/437 files match; no extra or missing files |
| Typecheck (`npm run typecheck`) | Passed |
| Unit suite, serial execution | 301 passed, 0 failed |
| Source pin and ABI verification | Passed for Renderer, Composer and Registry |
| Deployment manifest and static export verification | Passed; 89 assets plus manifest; 9 script/style assets |
| Chromium production interaction runner | 60/62 passed, including all 40 route/width combinations |
| Supplemental live history, download and keyboard checks | 6/6 passed |
| Pinned design probe | 14/16 passed; inherited uppercase headings and monospace prose retained |
| WebKit | Download succeeded; launch unavailable because required host shared libraries are missing |
| Production build | Not run, as explicitly required |

The serial unit command was `RAYON_NUM_THREADS=2 UV_THREADPOOL_SIZE=2 node --test --test-concurrency=1 tests/*.test.mjs` from the temporary `web/`. The initial parallel run exhausted available processes; the temporary test setup also initially lacked parent-folder fixtures. Both test-setup problems were corrected before the successful complete run. Browser checks were run separately to avoid the same process limit.

The browser runner exercised the supplied export under `/preview/` at 320, 390, 780 and 1440px. It checked validation, wallet-dialog focus/dismissal, multi-cell Explorer selection, real wallet metadata, Clear wallet and reload, routes and aliases, request recovery, Curator filters/JSON export, handbook search and RPC failure messaging. At 390×844 the home action occupies y=486.58–530.58. No uncaught application error or missing local resource was observed.

Two runner checks failed: the public RPC denied an old log query, and external RPC requests produced HTTP/CORS console errors. Separately, a wallet discovered through the live indexer displayed two saved facts, refreshed successfully, and produced a visually inspected PNG download; both corresponding Ethereum receipts were verified. These successes do not erase the external-service limitations. Native sharing, ENS-name display for a named wallet, real wallet signatures and new paid/mainnet transactions were not tested.

See [`artifacts/validation.md`](artifacts/validation.md) for commands, the six-domain Better Interface review, findings, retained screenshots and unperformed checks. [`DESIGN.md`](DESIGN.md) documents the final implementation. Reports inside immutable `web/` describe upstream history; unlisted older root artifacts remain historical evidence.

The complete upstream assets, including source screenshots and fixtures, remain intact. Dependencies, browser downloads, caches and downloaded archives are outside the submission. No ignore file changed. The final path and byte audit is in [`artifacts/submission-audit.json`](artifacts/submission-audit.json).

The existing **sworn** name is retained. Repository-root `dist/` is the complete export handed to the publishing plane; this worker did not independently change DNS, ENS or IPFS hosting. Earlier `site/`, contracts and unrelated project records remain unchanged. Notices remain in `LICENSE` and `web/LICENSES/`.
