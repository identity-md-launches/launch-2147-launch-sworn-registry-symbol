# Sworn 1.0.2 · worker validation

Date: 2026-10-28. This records worker checks, not an independent certification.

## Scope and authority

Deliver `web/` and `dist/` from `banse/sworn` commit `a4ee0244262b4e5cf8f3d22129814f5b74c7dec4`, branch `sworn-web-1.0.2`, unchanged. The explicit “no file added, changed or left out, and no build run here” requirement governs this release. The generic production-build and design-fix criteria cannot be applied by rewriting or rebuilding the pinned folders. Their exceptions are recorded, not treated as passes.

Both folders are exact copies. Source: 347 files / 3,925,581 bytes. Export: 90 files / 2,440,774 bytes. Total: 437 files / 6,366,355 bytes. The prior five hashed bundles were removed and the new five included. Upstream source screenshots and fixtures are required by the exact-copy requirement and remain present. The package manifest and lockfile differ from 1.0.1 only in release version labels; dependency graphs and build settings are unchanged.

Registry remains `0x0da2679000ea5380d1361cc3cca7d4e8c881f766`, Ethereum mainnet, launch 2404. No address was substituted from hosting launch 2147. Existing contracts, root build settings, `site/`, ignore rules and unrelated records were preserved. The existing sworn site name is retained; the publishing plane receives repository-root `dist/` after submission. No separate hosting command, DNS/ENS change or transaction was performed here.

## Requirements and checks

| Requirement/check | Actual outcome |
| --- | --- |
| Exact source and export | PASS: direct archive comparison and independent GitHub tree API comparison, all 437 paths/blob hashes |
| Complete static export | PASS: 90 files; root index, 89 assets plus manifest, relative entry URLs and hash routing |
| Metadata | PASS: title, description, SVG favicon, `og:title` and `./share.png`; runtime title `Sworn \| Home` |
| Main action at 390px | PASS: product, address field and 44px action visible; action y=486.58–530.58 at 390×844 |
| Production build | NOT RUN: expressly prohibited for this exact-copy release |
| Typecheck | PASS: `npm run typecheck`, exit 0 |
| Unit tests | PASS: 301 passed / 0 failed in the final complete serial run |
| Source pin / canonical ABI hashes | PASS: Renderer, Composer and Registry against the source's launch-2404 handoff |
| Export manifest and static-release checks | PASS: 89 assets / 2,426,197 bytes excluding the manifest itself; 9 script/style assets |
| Main Chromium interaction runner | 60 passed / 2 failed; external-service failures detailed below |
| Supplemental live/keyboard review | 6 passed / 0 failed |
| Layout | PASS: all 40 route/width combinations; no page overflow at 320, 390, 780 or 1440px |
| Pinned taste probe | 14 passed / 2 failed, inherited design exceptions detailed below |
| WebKit | NOT RUN: downloaded successfully; launch failed for missing host shared libraries |
| Design/install/preview/rebuild documentation | Updated `DESIGN.md` and root `README.md` |
| Publish under sworn | Handoff prepared in `dist/`; publication occurs after worker submission |

Git trees from the pinned GitHub API response:

- `web/`: `615bbd4ecd7632837ed9e8009fd5a20e6a8f2271`
- `dist/`: `cbc88057ddc97236a56689ac0b3cdf25206fc5f7`

`artifacts/export-manifest.json` records every path, SHA-256 and size, both tree digests, export Git blobs and the archive digest. No required runtime asset was dropped to meet the size limit.

## Reproducible commands and setup

No dependency directory was created in delivered `web/`. An isolated temporary tree held exact copies of `web/`, `dist/`, `agents/sworn/SKILL.md` and `llms.txt`; the last two match the repository's files. Dependencies and browser downloads stayed outside the submission. From its `web/`:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run typecheck
RAYON_NUM_THREADS=2 UV_THREADPOOL_SIZE=2 node --test --test-concurrency=1 tests/*.test.mjs
node scripts/verify-abis.mjs
```

Results: install exit 0 (72 packages), typecheck exit 0, final unit run exit 0 (301 tests), ABI verification exit 0. The default parallel `npm test` run was interrupted after process/thread exhaustion. Its temporary setup also initially lacked parent-folder fixtures. A serial retry with the export present ran 298 tests successfully and failed only on the absent agent-document fixture; after adding both exact parent documents, all 301 tests passed. No imported test was edited. The test suite uses Vite's development/SSR transforms and a small Solidity example compiler test; it did not invoke the site production build or regenerate its export.

From the repository root:

```sh
python3 tools/verify-sworn-release.py --archive /path/to/pinned-archive.tar.gz
node web/scripts/manifest.mjs --check
node web/scripts/static-release.mjs
```

All exited 0. The verifier also runs without `--archive` against the committed manifest.

Browser tools used an ordinary HTTP preview serving the delivered `dist/` at `/preview/`. To rerun the independent browser script, point these variables at an external Playwright installation and its browsers:

```sh
PLAYWRIGHT_BROWSERS_PATH="$BROWSER_DIR" \
SWORN_PLAYWRIGHT_MODULE="$CHECK_ROOT/web/node_modules/@playwright/test/index.mjs" \
node tools/validate-sworn-release.mjs --out test/scratch/release-browser
```

Final runner exit: 1 because two external-service checks failed; results are in `artifacts/browser-validation.json`. The runner starts and stops its own local preview. Its source selectors were updated for the release's title-case labels; a test-variable shadowing error was corrected before the final run. Initial simultaneous browser/unit runs exhausted the process limit; browsers were rerun separately after the unit suite completed. These setup failures are not claimed as app failures or passes.

The supplied pinned probe ran unmodified:

```sh
PLAYWRIGHT_BROWSERS_PATH="$BROWSER_DIR" \
IMD_PLAYWRIGHT="$CHECK_ROOT/web/node_modules/playwright/index.mjs" \
node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste
```

It exited 0 and returned 14/16 passing checks. Exit 0 means it measured successfully, not that every design check passed. Its JSON is retained at `artifacts/taste.json`; the probe input itself is assignment-provided and removed before submission.

## Interaction evidence

Chromium 156.0.8078.4 tested the production export, with no injected wallet, private RPC or fixture transport. The 40 layout checks cover `/`, `/catalog`, `/mint`, `/request`, `/fact-check`, `/register`, `/wallet`, `/curator`, `/integrate`, `/about` at four widths.

Passing checks include:

- Empty address submission: actionable error, `aria-invalid`, associated message and input focus.
- Connect dialog: native modal, named browser/Coinbase choices, keyboard containment, Escape/backdrop dismissal and focus return.
- Explorer preview: all 13 cells, independent multi-selection, correct pressed states, symbols and retained 26 fact rows.
- Real public-wallet lookup from the shipped census: `Sworn #1` metadata with 15 attributes and SVG image. Clear wallet restores the labeled preview and stays cleared after reload.
- Main navigation, legacy aliases, unknown-route return link, More keyboard/Escape behavior and hash-section focus.
- Disconnected card/fact entry, malformed Fact Check request recovery and fee/evidence disclosure.
- Curator filtering and valid JSON export of 4,931 historical candidates, explicitly labeled as historical; keyboard tabs and invalid-address recovery.
- Handbook search: 12 local results for `hasTrait`; Escape clears the search.
- Deliberate RPC outage: honest unavailable/retrying message and the primary action remains visible.
- No uncaught page errors or missing local resources. External resource errors are recorded separately.

Two final runner failures remain:

1. The old Registry-log discovery query received JSON-RPC `-32602`, “Archive requests require a personal token.” No key was requested or inserted. This prevents that specific test from discovering a wallet through archive logs; it does not establish that the app's indexer history fails.
2. The no-console-errors check saw public-service HTTP 403 and Tenderly CORS failures. Existing fallback reads still returned mainnet health/current quote and wallet metadata. Public-service uptime remains outside this release's control.

Supplemental browser-tool review used the real registrant from the live indexer's `/rules` response, `0x84f4b7424e1b0464f9c749725c1f34bed9aa8ada`, without connecting a wallet:

- `#/fact-check?wallet=…` displayed saved facts 601 and 1301 and “All fact history loaded.”
- Refresh history returned the same two records and re-enabled its control.
- Both linked receipts were successful and contained launch-2404 Registry events for that wallet; blocks 26,244,370 and 26,259,462.
- The completed Fact Check downloaded `sworn-1301-0x84f4b742.png`, 456,152 bytes, 3200×2000. The image was visually inspected and contained its question, full wallet, agent hive and result; status read “Image saved.” The transient download was not added to the release.
- Explorer's “Inspect Swarmed cell” responded to Space, exposed `aria-pressed=true` and showed a visible 2px accent focus outline.
- Both supplemental states had scroll width 390 at a 390px viewport.

`artifacts/live-browser-validation.json` records these six checks and receipt references. This successful path supplements, rather than overwrites, the archive-query failure.

## Better Interface: all six domains

The pinned workflow, six core-principle sections and documentation method were read. The exact-copy scope makes this a review of the supplied implementation; it does not authorize changing its visual direction. Idea: an instrument panel for Ethereum wallet facts, carried by a green evidence hive and dense monospace records.

| Domain | Coverage | Remaining limits |
| --- | --- | --- |
| Accessibility | Source semantics/labels, native modal, validation, skip link, route focus, keyboard tabs, More, preview Space/pressed state; rendered roles and focused preview inspected | No screen-reader session, full accessibility audit, physical device, forced-colors sweep or native zoom |
| Layout | Source grids/breakpoints; 40 route/width combinations; 390/1280/1440 screenshots; live history/preview wrapping; first-screen action | No RTL/pseudo-localization or browser-native 200% zoom; not every authenticated state |
| Writing | Address/retry errors, task labels, fees/consent, historical-data labels, synthetic preview copy, saved/pending distinctions | Exact upstream copy retained; no new paid flow or all possible error variants |
| Typography | Source tokens, line-heights, title case, mobile 16px inputs, address wrapping; rendered home type sizes and selected screens | System fonts vary; no full language/font fallback matrix; inherited monospace exception |
| Colors | Source palette/roles and rendered home solid-background contrast; minimum recorded text ratio 6.48:1; text plus state marks | Conditional surfaces, artwork and every focus/background pair not exhaustively measured; no theme switch exists |
| UI | Buttons/disclosures, loading/error/empty/saved states, modal controls, preview selection, clear/reload, history refresh and actual PNG download; reduced-motion probe | Native share/clipboard fallback, named-wallet ENS success, newly paid animation, ten-percent-speed motion replay and actual wallet signing not tested |

### Findings, disposition and verification

1. **Inherited casing exception** — `web/src/pages.tsx:214` and `:217`, `WHY SWORN` / `BUILT BY THE SWARM`. The probe measured two uppercase content headings at 1440px. The 390px snapshot confirms their presence farther down the page. A future editable release could use “Why Sworn” and “Built by the Swarm.” No correction here: changing those strings would break the required byte identity.
2. **Inherited typography exception** — `web/src/styles.css:30`, global `ui-monospace` stack; `web/src/pages.tsx:44` supplies the introductory prose. The probe recorded 14 monospace prose boxes, one family, two weights. The screenshots confirm the instrument-panel treatment. A future redesign could distinguish reading prose, but the supplied style remains authoritative for this release.
3. **Source type-scale limit** — `web/src/styles.css:23–29` declares seven global sizes, exceeding the generic six-token criterion. The rendered home nevertheless passed the actual probe (four repeated sizes/six including one-offs per width). Both facts are recorded; no token was changed to manufacture a pass.
4. **Public-service availability** — `web/src/rpc.mjs` retains the supplied public-provider list. The archive-query and CORS failures above are reproducible external limitations. A future upstream release could revise provider strategy; this import cannot retarget it.

No app/source design fix was applied. The release replacement, current documentation, verifier pins and updated test selectors are the authorized corrections. After documentation and evidence updates, the final integrity check again verifies unchanged `web/` and `dist/`.

## Retained evidence and limitations

Current-release reports: `artifacts/export-manifest.json`, `artifacts/browser-validation.json`, `artifacts/live-browser-validation.json`, `artifacts/taste.json`, `artifacts/submission-audit.json`, this file, `README.md` and `DESIGN.md`.

Current screenshots retained within the existing path budget:

- `artifacts/screenshots/landing-390.png` and `landing-1280.png`
- `artifacts/screenshots/catalog-390.png` and `claim-390.png`
- `artifacts/screenshots/fact-check-390.png` and `fact-history-390.png`
- `artifacts/screenshots/focus-390.png`

Other screenshots captured by the runner/probe stayed in disposable `test/scratch/`; their names in the raw report describe capture, not permanent delivery. Unlisted earlier root artifacts and reports inside immutable `web/` describe earlier/upstream work and are not this worker's test results.

No real wallet connection, signature, network switch, approval, paid request or transaction broadcast was attempted. No physical iPhone, screen reader or native zoom session ran. WebKit could not start due to host libraries. Public RPC/API/IPFS behavior can change after these checks. The publisher has not been independently observed switching the site name during this worker run.

**Complete for the exact-copy delivery scope**, with no build run, two inherited design-probe findings, the source type-scale exception and the explicit runtime/coverage limitations above. The generic build/redesign criteria are overridden by the specific immutable-release request, not silently satisfied.

Guidance attribution: Jakub Krehel's Better Interface, MIT, pinned commit `267330e1adfc66a718fb65fa6918c1f06d0a689e`; documentation method adapted from Paul Bakaus's Impeccable, Apache-2.0, pinned commit `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`. Full retained notices: `web/LICENSES/Better-Interface.txt`.
