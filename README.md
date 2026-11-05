# Sworn · 1.0.3

The existing **sworn** site (`sworn.site.identitymd.eth`) receives the exact `web/` and `dist/` folders from [banse/sworn at `ad995de37801330cd5897a78afe6c2f757dab117`](https://github.com/banse/sworn/tree/ad995de37801330cd5897a78afe6c2f757dab117), branch `sworn-web-1.0.3`. This replaces version 1.0.2 from this project's commit `db99d4ce0fb139184fc0ecfb57e3c4bdb16dad4e`.

**Every source and export file is unchanged from upstream. No production build ran here.** The committed root `dist/` is the publishing plane's input; it serves these files without rebuilding and retains the existing name. This worker did not independently change ENS, DNS or IPFS hosting.

| Folder | Files | Bytes |
| --- | ---: | ---: |
| `web/` — source, manifest, lockfile, tests and public assets | 349 | 3,936,008 |
| `dist/` — upstream production export | 90 | 2,443,354 |

The static app reads Ethereum mainnet, public RPCs, `api.imd.fun`, IPFS gateways and the [Sworn indexer](https://sworn.vibingco.de/api) from the visitor's browser. The Registry stays **`0x0da2679000ea5380d1361cc3cca7d4e8c881f766`, launch 2404**. Version 1.0.3 updates RPC failure handling and shared-fact preflight safety, including a block-hash-checked historical pin. Upstream addresses and wallet configuration remain intact. The hosting project's launch-2147 contracts and records are historical; no contract was deployed or retargeted.

## Preview

No dependency installation is needed:

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173/`. Relative asset URLs, Vite's `base: './'` and hash routes support static gateways and subpaths. Validation served the supplied export under `/preview/`. `dist/index.html` includes a title, description, favicon, `og:title` and local `og:image`.

Explore any Ethereum address without connecting. Navigation provides Explorer, Sworn Card, Wallet Facts, Fact Check, Community Facts, About and Docs; More exposes Curator and integration resources. Explorer's synthetic preview is explicitly labeled. Paid actions require the visitor's wallet. The bundled handbook at `docs/index.html` has local search.

## Install and rebuild for future development

The worker used Node 24.22.1 and npm 11.19.1. Use compatible versions:

```sh
cd web
npm ci
npm run typecheck
npm test
npm run build
npm run verify:export
npm run preview
```

Open the preview address printed by Vite; `npm run dev` serves the source. The build checks source/ABI pins, writes `../dist/`, generates its asset manifest and verifies the static release. These are future development instructions, **not commands run for this delivery**: rebuilding replaces the requested upstream export. Public assets are already included. Keep dependency installations, browser binaries and caches out of Git.

## Check release integrity without building

```sh
python3 tools/verify-sworn-release.py
node web/scripts/manifest.mjs --check
node web/scripts/static-release.mjs
```

[`artifacts/export-manifest.json`](artifacts/export-manifest.json) records every path, size, SHA-256, folder digest and export Git blob hash. All **439** imported files were independently compared against GitHub's recursive tree API. Download the pinned commit archive to repeat the comparison:

```sh
python3 tools/verify-sworn-release.py --archive /path/to/pinned-archive.tar.gz
```

The verifier rejects missing, extra or changed files and changed file modes. Older `tools/*sworn-v2*` scripts describe historical releases.

## Worker validation · 2026-11-05

Dependencies were installed in an isolated disposable copy with `npm ci --ignore-scripts --no-audit --no-fund`. Checks ran against that copy or the root export without generating assets or building. The copy included upstream `agents/sworn/SKILL.md` and `llms.txt` test fixtures, both identical to this repository's versions.

| Check | Actual result |
| --- | --- |
| Archive, path and GitHub blob comparison | 439/439 match; 349 source files and 90 export files |
| `npm run typecheck` | Passed |
| Serial unit suite | 312 passed; 0 failed or skipped |
| `node scripts/verify-abis.mjs` | Passed source and ABI pins for launch-2404 Renderer, Composer and Registry |
| Manifest and static-release checks | Passed; 89 assets plus manifest, 9 script/style assets |
| Chromium production interaction runner | 60/62 passed, including all 40 route/width checks |
| Supplemental payload, saved-history and keyboard checks | 4/4 passed |
| Pinned design probe | 14/16 passed; inherited uppercase headings and monospace prose retained |
| WebKit | Downloaded; launch failed because required host libraries are missing |
| Production build | Intentionally not run, as explicitly requested |

The unit command was `RAYON_NUM_THREADS=2 UV_THREADPOOL_SIZE=2 node --test --test-concurrency=1 tests/*.test.mjs` in the isolated `web/`. The production runner is `node tools/validate-sworn-release.mjs`; `SWORN_PLAYWRIGHT_MODULE` selects a separately installed Playwright module, `SWORN_CHROMIUM_EXECUTABLE` selects an installed Chromium binary, and optional `SWORN_TEST_RPC` selects a read-only verification transport without modifying exported files.

Browser checks exercised `/preview/` at 320, 390, 780 and 1440px: validation, live wallet metadata, Clear wallet/reload, hive selection, wallet-dialog focus/dismissal, routes and aliases, saved history, request recovery, Curator controls, handbook search and RPC failure messaging. At 390×844, the home action spans y=438.48–482.48. No uncaught app error or failed local HTTP resource was observed.

Two runner checks failed: Chromium canceled a native JSON download, and direct external requests logged `ERR_EMPTY_RESPONSE`. Follow-up checks captured and verified the actual browser-generated JSON (4,931 matching wallets) and PNG (3200×2000), refreshed two real saved facts and exercised Space-key cell selection. Read-only GET forwarding reached the real indexer and oracle API; the PNG was visually inspected, including the resolved `pawai.eth` name. **Native file saving remained canceled for both JSON and PNG.** These results do not establish direct public-browser service availability or successful native downloads. Wallet signing, paid transactions, native sharing, physical devices, screen readers and native browser zoom were not tested.

[`artifacts/validation.md`](artifacts/validation.md) records the six-domain Better Interface review, commands, evidence and limitations. [`DESIGN.md`](DESIGN.md) describes the final tokens, typography, components and responsive behavior. Current reports are `artifacts/browser-validation.json`, `artifacts/live-browser-validation.json` and `artifacts/taste.json`; other unlisted root artifacts and reports inside immutable `web/` remain historical.

Required upstream assets and source fixtures remain complete. No ignore file changed or submodule was added. Dependencies, caches, browser binaries and downloaded archives are excluded from the submission. [`artifacts/submission-audit.json`](artifacts/submission-audit.json) records the final path and byte audit. Earlier `site/`, Solidity sources and unrelated records remain unchanged. Notices remain in `LICENSE` and `web/LICENSES/`.
