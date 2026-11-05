# Sworn 1.0.3 · worker validation · 2026-11-05

| Area | Result |
| --- | --- |
| Pinned source/export | 439/439 files match GitHub blobs and the commit archive |
| Broken features | No uncaught app exception or local HTTP failure; native file saving canceled; direct external-service errors observed |
| Product and main action on the 390px first screen | Yes; Explore wallet at y=438.48–482.48 in a 390×844 viewport |
| taste@1 | 14/16 pass; inherited uppercase headings and monospace prose retained |
| Copy findings | Two inherited uppercase section headings; no copy changes authorized |
| Share metadata | Title, favicon, description, og:title and og:image present |

## Scope and authority

Deliver `web/` and `dist/` from `banse/sworn`, branch `sworn-web-1.0.3`, commit `ad995de37801330cd5897a78afe6c2f757dab117`, without additions, omissions, edits or a local production build. Root `dist/` is the publishing plane's input for the existing `sworn.site.identitymd.eth` name. Hosting resolution after submission was not exercised by this worker.

The controlling requirement is **“used unchanged: no file added, changed or left out, and no build run here.”** It overrides the generic build/rebuild and UI-fix criteria. Better Interface informed preservation, inspection and documentation; this was an exact-release import, not a design revision. Findings that require changing either imported tree are recorded rather than applied. No missing requester input or placeholder was needed.

Both imported trees retain launch-2404 configuration, including Registry `0x0da2679000ea5380d1361cc3cca7d4e8c881f766`. The older launch-2147 deployment is not substituted. Root contracts, build settings, dependencies, `site/`, ignore files and deployment records remain unchanged. The only manifest/lockfile changes are the exact upstream `web/` version labels; dependency graphs, scripts, overrides and Vite settings are identical to the prior release.

The visual idea is a public Ethereum wallet-fact instrument: a flat, dark monospace interface with green actions and a thirteen-family hexagonal record.

## Requirement review

| Requirement | Status and evidence |
| --- | --- |
| Exact `web/` replacement | Met: 349 paths, 3,936,008 bytes; archive and GitHub blob comparison |
| Exact `dist/` replacement, including index at root | Met: 90 paths, 2,443,354 bytes; no old bundle remains |
| No production build here | Met: no build, asset generator or manifest-writing script ran |
| Existing sworn name | Retained delivery target; publishing plane resolves hosting after submission |
| Launch-2404 addresses preserved | Met: exact bytes, upstream ABI pins and live runtime deployment verification |
| Usable static website and primary interactions | Checked in Chromium; 60/62 main checks and 4/4 supplemental checks; limits below |
| Relative asset URLs | Met: static-release check and serving under `/preview/` |
| Production build criterion | Explicitly superseded by the exact-copy/no-build request; not claimed |
| Typecheck and useful interaction checks | Performed; results below |
| Better Interface six-domain review | Performed within immutable-release scope; coverage below |
| First screen at 390px | Observed heading, labeled wallet field, Explore wallet and Connect |
| Title, favicon, description, og:title and og:image | Present in unchanged entry and rendered app; share probe passes |
| Root DESIGN.md | Updated from actual source and current evidence |
| README install, preview and rebuild instructions | Updated; future rebuild instructions clearly separated from commands actually run |
| Source, lockfile and export in submission; ≤8 MiB added | Checked by final submission audit; dependencies/caches/archives excluded |

## Commands and actual results

1. Downloaded `https://codeload.github.com/banse/sworn/tar.gz/ad995de37801330cd5897a78afe6c2f757dab117` into disposable scratch space. Independently fetched `https://api.github.com/repos/banse/sworn/git/trees/ad995de37801330cd5897a78afe6c2f757dab117?recursive=1`; its response was not truncated. All 439 paths and Git blob hashes matched. All imported files have mode `100644`; no symlinks, submodules or dependency directories occur in either tree.
2. Replaced both folders in full. `python3 tools/verify-sworn-release.py --archive test/scratch/release/upstream.tar.gz` passed for all paths/bytes. The retained manifest also permits an offline check with `python3 tools/verify-sworn-release.py`.
3. `node web/scripts/manifest.mjs --check` passed: 89 assets, 2,428,777 asset bytes, plus the manifest. `node web/scripts/static-release.mjs` passed: 9 script/style assets, relative entry assets and no fixture/demo transport.
4. Installed exact dependencies into an isolated source/export copy with `npm ci --ignore-scripts --no-audit --no-fund`. Installation added 72 packages. Node 24.22.1 and npm 11.19.1 were used. The upstream parent-folder test fixtures `agents/sworn/SKILL.md` and `llms.txt` match this repository's files and were copied into the check workspace. The delivered trees were not installed into or built.
5. In the isolated `web/`, `npm run typecheck` exited 0. `node scripts/verify-abis.mjs` exited 0: source pin and canonical ABI Keccak hashes match Renderer `61a60df208f0a8712452ebc563183e54d1e5ba8b43dfa1a26fbe54f265b73817`, Composer `37b9a6c54c65f302558b81c741465e5559c33284612d2046b4ffbfff6584eb6d`, Registry `681346b3fa66ff9c620fb255a9617b0f102e975f5ad492bab6d4afd2f608e031`.
6. `RAYON_NUM_THREADS=2 UV_THREADPOOL_SIZE=2 node --test --test-concurrency=1 tests/*.test.mjs` exited 0: **312 tests passed, 0 failed, 0 skipped**, 21.94s. This includes new shared-pin equivalence/hash-mismatch safeguards, RPC rate-limit versus size-refusal handling, cancellation and deadline behavior. These tests use simulated timing; no long wall-clock waiting was needed.
7. `node tools/validate-sworn-release.mjs --out test/scratch/release-browser-final` ran with a separately installed Playwright module and installed headless Chromium, plus a read-only RPC transport override. The script serves and closes its own preview. **60/62 checks passed**, exit 1. All 40 route/width checks passed; no uncaught app exception or local HTTP failure. Failures and transport details are below.
8. `node test/scratch/release/check-downloads.mjs` ran a supplemental browser check against the same export: **4/4 passed**, exit 0. It validated actual app-generated Blobs, refreshed real history, opened a real request and exercised Space-key cell selection. The scratch runner is not submitted; its results are retained in `artifacts/live-browser-validation.json`. The complete main runner and upstream tests remain available.
9. `IMD_PLAYWRIGHT=<isolated module adapter> node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` exited 0 and measured all 16 checks: **14 passed, 2 failed**. The adapter selected an already installed compatible Chromium executable; it did not modify the probe or app. Screenshots were generated and inspected.
10. WebKit downloaded successfully to scratch space. A separate launch attempt with that installed browser failed: **host system is missing required shared libraries**. No WebKit interaction success is claimed.
11. No `npm run build`, `vite build`, art generation or deployment/publishing command ran. Future build instructions in README are not worker results.

Initial tooling attempts were corrected locally: npm rejected using the same empty path for both user/global configuration; separate empty configuration inputs allowed installation. The provided browser tool failed at startup with “Socket path too long.” The separately installed Playwright initially requested an unavailable browser revision; selecting the existing headless Chromium allowed the actual checks. Repeating the native-download check with an explicit scratch download directory still returned `canceled`. These startup/setup failures are not counted as successful app checks.

## Interaction coverage and service limitations

The main runner used Chromium 154.0.8037.0 on the **supplied production export**, served at `/preview/`. It checked `/`, `/catalog`, `/mint`, `/request`, `/fact-check`, `/register`, `/wallet`, `/curator`, `/integrate` and `/about` at **320, 390, 780 and 1440px**. All had an `h1` and no page-level horizontal overflow. Hash aliases, unknown-page recovery and the local handbook were also exercised.

Observed checks include:

- The 390×844 entry has the product, wallet field and main action above the fold; Explore wallet is 44px high.
- Empty submission explains the required Ethereum address format, sets `aria-invalid` and focuses the field.
- The native wallet dialog contains document focus; Escape and backdrop close it and restore focus. Connect remains available without a signature.
- Explorer's labeled preview permits independent multi-cell selection; 13 cells and 25 fact rows were present. Space toggles a focused cell on and off. Entering a real census address loads Renderer tokenURI data (`Sworn #1`, 15 attributes); Clear wallet restores the preview and stays cleared after reload.
- Live deployment/current-price status reached Ethereum mainnet block 26,351,100 during the first run. This was a runtime current-head read, not a requested fixed-block question. No locally deployed contract was used.
- Fact Check loads two real saved facts for a wallet discovered from launch-2404 Registry logs. Its successful history transaction receipt was checked against the Registry. Refresh history succeeds, and a saved row opens its real request.
- Invalid oracle links explain recovery; Wallet Facts section jumps move focus; evidence/fee disclosures remain available. Disconnected paid actions expose wallet connection without broadcasting.
- More opens with Enter, closes with Escape and returns focus. Curator tabs respond to arrows; malformed consumer addresses produce a correction. Handbook search returns 12 local results for `hasTrait`; Escape clears it.
- A deliberately refused RPC returns “Cannot read the chain, retrying.” with the main action still present.

The main runner forwards browser RPC reads to an authorized read-only verification transport without changing the app. The public source for those mainnet reads is `https://ethereum-rpc.publicnode.com`. This does **not** certify the app's unmodified public-RPC failover from every visitor network. Direct external requests to the indexer/oracle API produced `ERR_EMPTY_RESPONSE` in this environment, causing the console-error check to fail. Navigations also intentionally aborted pending reads; the report distinguishes request failures from local HTTP errors and app exceptions.

The supplemental runner forwarded **real read-only GETs** for the indexer and `api.imd.fun` through curl. Rules, wallet data and an existing oracle request returned successfully. No sample result was substituted. It inspected the app-generated historical JSON: **4,931 wallets**, chain 1, `historical-candidates` evidence mode, valid addresses and selected fact 101 on every row. The payload was 4,277,323 bytes and is not added to the submission.

For the saved community fact 10001, the app generated a **3200×2000 PNG, 429,347 bytes**. Its PNG signature/dimensions were checked, then the image was viewed. It included the actual question, full wallet address, resolved `pawai.eth`, agent responses and saved result. The original generated image remains scratch-only. **Native Chromium downloads for both JSON and PNG were canceled**, so successful operating-system file saving is unverified. Capturing the real Blob verifies the payload, not the native download mechanism. No source change was made to conceal that distinction.

Not performed: real wallet connection, network switching through a wallet, signatures, paid/new mainnet requests, native sharing/clipboard fallback, physical-device testing, screen-reader sessions, native browser zoom, RTL/pseudo-localization, full IPFS-gateway/failover testing or exhaustive conditional paid/progress states. No claim of full accessibility compliance or independent service certification is made.

## Better Interface review: six domains

The pinned workflow, core principles of all six domains and documentation method were read. Established visual decisions and the exact-copy requirement take priority. Guides: Jakub Krehel, Better Interface, MIT, commit `267330e1adfc66a718fb65fa6918c1f06d0a689e`; documentation method: Paul Bakaus, Impeccable, Apache-2.0, commit `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`. Existing notices remain in `web/LICENSES/Better-Interface.txt`.

| Domain | Checked coverage and evidence | Not reviewed / not applicable |
| --- | --- | --- |
| Accessibility | Native buttons/links/labels, invalid-field focus, status/error semantics, modal keyboard containment/dismissal/focus return, More, tab arrows, cell Space interaction, 2px focus treatment; home target probe passes | Screen reader, real wallet, physical devices and native zoom not reviewed; an accessibility snapshot is not a screen-reader session |
| Layout | Shared frame and component CSS reviewed; all 40 route/width combinations fit; home probe found no overlaps/clipping; 390/1440 landing and representative phone screenshots viewed; phone primary action visible | Full overlap/clipping measurements on every route, RTL, pseudo-localization and native zoom not reviewed |
| Writing | Action labels, address correction, unavailable/empty/recovery copy, historical-candidate versus accepted-fact language, fees and synthetic-preview labeling reviewed | No copy edits authorized; inherited uppercase headings retained; all possible API/transaction errors not reviewed |
| Typography | Actual CSS tokens/stack, heading roles, tabular numbers, wrapping and mobile input sizes reviewed; six sizes and weights 400/600 measured on the home page | Global source has seven size tokens and local exceptions; visitor system-font appearance varies; broader localization not reviewed |
| Colors | Implemented role tokens documented; rendered home foreground/background pairs measured by the probe, minimum 6.48:1 at 390 and 1440px; textual state cues remain | Complex conditional artwork/overlays and all interactive-state contrast pairs not measured; no theme switch exists, so alternate themes not applicable |
| UI | Flat structural borders, primary/hover/active/disabled CSS, native dialog, disclosures, preview selection, history/recovery states and reduced-motion home probe reviewed | Animation replay at 10% speed and every paid/loading/success/error variant not reviewed; WebKit unavailable |

### Findings, disposition and rechecks

1. **Inherited copy/typography: uppercase section headings.** Source `web/src/pages.tsx:214` (`<Section title="WHY SWORN">`) and `:217` (`BUILT BY THE SWARM`). Now: two desktop content headings are authored in capitals. Ordinary correction: title-case these labels. Why: the pinned casing bar. Evidence: taste@1 `casing` fails on both at 1440px; the remaining layout/type/contrast checks pass. **Retained under the explicit unchanged-file requirement.** This is an exception to the general copy bar, not permission to rebuild.
2. **Inherited typography: monospace prose.** Source `web/src/styles.css:30`, `font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. Now: body prose follows the established instrument-panel stack. Ordinary correction would separate prose typography; that would change the requested release's visual system. Evidence: taste@1 reports one family, two weights and 14 monospace prose boxes. **Retained as deliberate existing design and exact-copy scope.** No new font dependency was added.
3. **Unverified native file saving.** Source `web/src/curator.tsx:49`–`:50` and `web/src/fact-check/CardShare.tsx:77` generate Blob downloads. Reproduction: click Export wallet list after selecting fact 101, or Download image for the real saved result. Playwright's `download.path`/`download.failure` returned `canceled`, including with an explicit download directory. Actual JSON/PNG Blobs pass content checks. Impact: this run cannot certify native saving. **Disclosed, no upstream edit permitted**; native-device/browser retest is still needed before claiming that behavior.
4. **External-service transport limitation.** Sources `web/src/indexer.mjs:2`, `web/src/rpc.mjs:4` and the Fact Check API client. Direct browser requests produced `ERR_EMPTY_RESPONSE`; real GET forwarding succeeded. The application showed honest unavailable/retry states. **Disclosed without retargeting endpoints.** This is not proof that the named external services are broken for visitors.

Applicable delivery fixes completed outside the immutable trees: updated stale 1.0.2 release verification constants/counts, added an explicit browser executable/download-directory option and failed-request evidence to the read-only runner, refreshed README/DESIGN/review reports, and recorded current evidence within the existing path budget. The final integrity check rechecks the source/export after validation. No design fix was applied inside either imported folder.

### Probe detail

Passed: render, layout, targets, contrast, tracking, eyebrows, type-sizes, glyphs, slogans, repetition, copy-budget, chrome, motion and share. Failed: casing and type-faces, as explained above. Six computed home sizes are 11, 12, 13, 15, 24 and 34px. The probe also rendered 320px and a reduced-motion state; this is not native zoom or physical-phone testing. Raw results are in `artifacts/taste.json`.

## Retained evidence

Current machine-readable results: `artifacts/export-manifest.json`, `artifacts/browser-validation.json`, `artifacts/live-browser-validation.json`, `artifacts/taste.json` and `artifacts/submission-audit.json`.

| Evidence path | Actual current state |
| --- | --- |
| `artifacts/screenshots/landing-390.png` | Home at 390×844; visually inspected |
| `artifacts/screenshots/landing-1280.png` | Home at **1440×844**; existing artifact filename retained; visually inspected |
| `artifacts/screenshots/catalog-390.png` | Empty Explorer at 390px; visually inspected |
| `artifacts/screenshots/claim-390.png` | Sworn Card route at 390px |
| `artifacts/screenshots/fact-check-390.png` | Disconnected Fact Check at 390px |
| `artifacts/screenshots/fact-history-390.png` | Real wallet's Fact Check at 390px; visually inspected |
| `artifacts/screenshots/focus-390.png` | Space-selected/focused preview cell at 390px; visually inspected |
| `artifacts/screenshots/verified-source-390.png` | Real saved request after actual indexer/API reads at 390px |
| `artifacts/screenshots/about-390.png`, `integrate-390.png` | Additional current routes at 390px |

Other unchanged screenshots/reports are historical and are not evidence of this worker's checks. Probe screenshots and the original generated PNG were inspected from disposable scratch paths, not falsely represented as submitted originals. Scratch dependencies, archives, downloaded browsers and test payloads are not delivered. No ignore file was changed. The artifact aggregate budget remains 2,097,152 bytes; the submission budget is 8,388,608 bytes.

## Completion

**Complete for the stated exact-import scope.** Both folders are intact and ready for the existing publishing flow. No production build was run. Broader behavioral certification remains limited by canceled native downloads, direct external-service errors, unavailable WebKit and the unperformed checks listed above. These are this worker's observations, not an independent certification or a claim that hosting has already changed.
