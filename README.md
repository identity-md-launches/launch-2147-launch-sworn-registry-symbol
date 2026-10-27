# Sworn · 1.0.1

This release replaces the site under the existing **sworn** name (`sworn.site.identitymd.eth`) with the exact `web/` and `dist/` folders from [banse/sworn, commit `5e0dce32d16e034d02dc018323c8615f37188383`](https://github.com/banse/sworn/tree/5e0dce32d16e034d02dc018323c8615f37188383), release branch `sworn-web-1.0.1`. No file in either folder was edited, omitted or added. **No production build was run for this delivery.** The publisher serves repository-root `dist/` after submission; it does not need to rebuild the source.

| Delivered folder | Files | Bytes |
| --- | ---: | ---: |
| `web/` — source, dependency manifest, lockfile, tests and public assets | 333 | 3,582,497 |
| `dist/` — complete upstream production export | 90 | 2,423,835 |

The app reads Ethereum mainnet, public RPCs, `api.imd.fun`, IPFS gateways and `https://sworn.vibingco.de/api` from the visitor's browser. Its Registry remains **`0x0da2679000ea5380d1361cc3cca7d4e8c881f766` (launch 2404)**. The hosting project's older launch-2147 contracts, Solidity sources and records are preserved. No contract was deployed or retargeted.

## Preview the delivered site

No dependency installation is needed. From the repository root:

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173/`. Vite's `base: './'`, relative assets and hash navigation support gateway subpaths. Browser validation also served these files under `/preview/`. The entry includes a title, description, favicon, `og:title` and local `og:image`.

The home page explores a public wallet without connecting. Catalog, Mint Card, Mint Facts, Fact Check, Mint Rule and About are in the main navigation; More exposes Wallet, Curator and integration resources. `docs/index.html` is the bundled searchable handbook. Existing hash-route aliases remain. Wallet connection retains EIP-6963 discovery, wallet-app browser links and Coinbase's connector. Paid actions require the visitor's wallet.

## Install and rebuild for future development

Use Node **22.12 or newer** and npm **10 or newer**. The pinned source already contains its public assets; no regeneration step is needed for this release.

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

## Worker validation · 2026-10-27

Dependencies were installed with `npm ci --ignore-scripts --no-audit --no-fund` in a temporary copy. Dependencies, browser downloads and caches remain outside the delivered folders. No production build, agent generation or asset-generation command ran.

| Check | Actual result |
| --- | --- |
| Direct pinned-archive comparison | All 423 files match, with no omissions or additions |
| Typecheck (`npm run typecheck`) | Passed |
| Unit suite (`npm test`) | 291 passed, 0 failed |
| Deployment manifest and static export checks | Passed; 89 assets plus the manifest; 9 script/style assets |
| Chromium production interaction runner | 57/59 passed, including all 40 route/width combinations at 320, 390, 780 and 1440px |
| Supplemental current-interface checks | 5/5 passed: eligibility, payment review, history fallback and keyboard focus |
| Pinned design probe | 14/16 passed; inherited uppercase headings and monospace prose retained under the exact-copy requirement |
| WebKit | Downloaded; launch blocked by missing host shared libraries |
| Production build | Not run, as explicitly required |

The interaction runner checked address validation and real public-wallet metadata, wallet-dialog keyboard behavior, navigation/aliases, Mint/Fact Check entry states, malformed-request recovery, Curator filtering and JSON export (4,931 historical candidates), handbook search and RPC-outage messaging. At 390×844 the home action spans y=475.39–519.39. No application exception or missing local resource was observed. Two checks failed because a public RPC refused an archive log query and an external RPC emitted CORS errors.

The imported indexer browser suite passed its catalog group, then stopped on older Mint Facts copy expectations. Its history-only group passed separately. Its live-indexer browser suite timed out waiting for an eligibility label and is not counted as a pass. See [`artifacts/validation.md`](artifacts/validation.md) for supplemental current-interface checks, commands, six-domain review and limitations. Reports inside immutable `web/` describe upstream history, not this worker's results.

No real wallet signature, paid request or mainnet transaction was sent. Physical-device, screen-reader and native zoom checks were not performed. Fixture-based browser tests identify their synthetic replies; production retains the original public services.

[`DESIGN.md`](DESIGN.md) documents the implementation. Earlier `site/`, contracts, project documentation and historical evidence remain available. Project and third-party notices remain in `LICENSE` and `web/LICENSES/`.
