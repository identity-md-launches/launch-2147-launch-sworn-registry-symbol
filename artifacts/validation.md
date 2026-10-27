# Sworn 1.0.1 · exact-release delivery validation

Worker observations on 2026-10-27. These results are not independent certification.

## Scope and authority

The task explicitly requires `web/` and `dist/` from `banse/sworn` commit `5e0dce32d16e034d02dc018323c8615f37188383`, unchanged, with no build here. That specific instruction controls the generic build/fix criteria: no production build, source correction, wallet change, asset regeneration or retargeting was performed. Better Interface informed the import review and documentation; the review's inherited design exceptions are recorded rather than silently patched. The existing hosting name remains **sworn** (`sworn.site.identitymd.eth`); publication follows submission through the existing publisher. No publish command or on-chain operation ran.

| Requirement | Result |
| --- | --- |
| Exact upstream `web/` | 333/333 files, 3,582,497 bytes; no extras, omissions or modifications |
| Exact upstream `dist/` | 90/90 files, 2,423,835 bytes; no extras, omissions or modifications |
| Source and lockfile | Included unchanged; package version is 1.0.1 |
| No local production build | Met; upstream export was copied directly |
| Keep launch-2404 contract binding | Met: Registry `0x0da2679000ea5380d1361cc3cca7d4e8c881f766`, Ethereum chain 1 |
| Preserve older launch-2147 project | Root contracts, build/dependency configuration and historical `site/` remain untouched |
| Static relative asset URLs | `base: './'`; manifest and static-release checks pass; `/preview/` browser checks pass |
| First screen at 390 | Heading, labeled input and Explore wallet action visible at 390×844; action y=475.39–519.39 |
| Share metadata | Title, description, favicon, og:title and local og:image present; probe passes |
| Design/source documentation | Root DESIGN.md and README refreshed; frozen upstream web documentation remains unchanged |
| Typecheck and useful interactions | Passed as detailed below, with external-service/test-expectation limitations disclosed |
| Hosting under existing name | After submission; the deliverable is the root dist, with no redirect or name change |

## Provenance and integrity

Downloaded GitHub's codeload archive of the exact commit to temporary storage, extracted only the required folders into this repository, and compared every relative path and byte. A second GitHub Git-tree API check independently matched all 423 local file Git blob hashes to that commit. The upstream folder tree IDs are:

- `web`: `07353c790e56cb721231ad4da0bf3d41fb0fc97a`
- `dist`: `d61ab5c5c23569960ced56f3474156f32dff04d8`

`artifacts/export-manifest.json` contains the complete path/size/SHA-256 inventory, export Git blob hashes, archive hash and tree digests. `python3 tools/verify-sworn-release.py --archive <downloaded-archive>` passed. The same verifier without `--archive` checks local files against the recorded inventory. No source omission was made, including tests, simulation sources, license notices, public ABIs, handbook, census data and runtime assets. No packaging archive, node_modules, cache or npm mirror was added to the submission.

## Actual commands and outcomes

Dependencies and browser downloads were placed in temporary storage. A disposable exact copy of web/dist was used for npm-based checks; the root agent/llms fixtures needed by the imported unit tests also matched this repository. The production interaction scripts below serve the submitted repository's actual dist under `/preview/`.

| Command | Result |
| --- | --- |
| `npm ci --ignore-scripts --no-audit --no-fund` with an external cache, in temporary web | Exit 0, 72 packages installed; no lifecycle build |
| `npm run typecheck`, in temporary web | Exit 0 (`tsc --noEmit`) |
| `npm test`, in temporary web | Exit 0, 291 tests passed, zero failed/skipped |
| `node web/scripts/manifest.mjs --check` | Exit 0, 89 assets plus the deployment manifest, all hashes match |
| `node web/scripts/static-release.mjs` | Exit 0, 9 script/style assets; relative entry URLs; no mock/demo transport in production |
| `python3 tools/verify-sworn-release.py` and direct `--archive` variant | Exit 0; exact folders |
| `node tools/validate-sworn-release.mjs` with external Playwright selected | Exit 1, 57/59 checks passed; two external-provider limitations below |
| `node tools/validate-sworn-indexer.mjs` with external dependency web selected | Exit 0, 5/5 supplemental checks passed |
| Imported `node tests/indexer-browser.mjs`, in temporary web | Exit 1 after catalog group passed; stale Mint Facts text expectation below |
| Imported `node tests/indexer-browser.mjs --only=fact-check` | Exit 0; indexed history and scan-fallback uniqueness group passed |
| Imported `node tests/indexer-live-browser.mjs` with public mainnet transport | Exit 1; 5-second eligibility-label wait timed out; not counted as a pass |
| `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` with external Playwright selected | Exit 0 (measurement completed), 14/16 checks passed; two inherited design exceptions |
| `git diff --check` | Passed |
| `npm run build` | NOT RUN: expressly prohibited by the exact-release task |

To repeat the production browser runners with installed dependencies, use `node tools/validate-sworn-release.mjs` and `node tools/validate-sworn-indexer.mjs`. The first accepts `SWORN_PLAYWRIGHT_MODULE` pointing to an external `@playwright/test/index.mjs`; the second accepts `SWORN_VALIDATION_WEB` pointing to an exact temporary web copy containing dependencies. Set `PLAYWRIGHT_BROWSERS_PATH` to the browser download directory when needed. The pinned design probe was provided as a task input and is removed by the submission process; its current result is retained in artifacts/taste.json.

The npm check's initial disposable fixture copy lacked the root agent file; after supplying that unchanged fixture, the complete final unit run passed 291 tests. No source correction or build was involved.

## Interaction evidence

Chromium served the committed export below `/preview/`. Ten routes were checked at each of **320, 390, 780 and 1440 CSS px**, height 844: Home, Catalog, Mint Card, Mint Facts, Fact Check, Mint Rule, Wallet, Curator, Integrate and About. All 40 combinations rendered an h1 and had document scrollWidth ≤ viewport width. This is representative reflow testing, not native 200% zoom.

The production runner passed these functional checks:

- Home input/action above the phone fold; invalid submission shows a corrective message, aria-invalid and input focus.
- Native wallet dialog opens, contains keyboard focus, dismisses with Escape/backdrop and restores the trigger.
- Live mainnet deployment/quote status; a wallet from the supplied census loads Registry/Curator facts and Renderer metadata (`Sworn #1`, 15 attributes), with a lossless metadata download.
- Missing-route recovery, legacy Claim/Mint and oracle/Fact Check aliases, native More disclosure keyboard opening/Escape/focus return.
- Mint/request disconnected entry states, Fact Check connect prompt, malformed-request recovery and Mint Facts section focus.
- Curator fact filtering and JSON download: 4,931 historical candidates, matching count/address/fact provenance; tab-arrow navigation and malformed consumer-address validation.
- Handbook search returns 12 local results for the checked query and Escape clears it.
- Deliberate RPC outage displays an unavailable state while keeping the public address action reachable.

The supplemental runner tests the current 1.0.1 UI with the imported public API captures and deterministic read-only RPC/wallet fixtures. All five checks passed: indexer eligibility 5/met, 0/not-met behind the counted disclosure, compact paid-swarm-request wording and registrant, opening the payment review without a signature, five history rows including frozen direct facts, saved result navigation, no duplicate history rows after indexer failure/scan fallback, a visible keyboard focus ring and no uncaught application errors. Fixtures exist only in the test harness; dist is unchanged. No real signature, broadcast or paid request occurred.

## Six-domain Better Interface review

One visual idea carries the site: a compact public registry instrument with green hive evidence on a near-black monospace surface. The pinned guide's workflow and core principles in all six domains were read before review.

| Domain | Checked coverage | Limits |
| --- | --- | --- |
| Accessibility | Source labels/native elements, skip/main/focus handling, textual statuses, reduced-motion guards; rendered input error/focus, wallet modal containment/dismissal/return, More and Curator keyboard paths | No screen-reader session, physical device, forced-colors rendering or separate automated accessibility audit; every conditional transaction state was not traversed |
| Layout | Frame/grid/media queries, controls before explanatory prose, progressive disclosures; 40 route/width checks, phone first screen and desktop screenshots; local table scrolling | Native zoom, RTL/pseudo-localization and all possible intermediate widths unverified |
| Writing | Action labels, address corrections, fee/consent copy, optional-card guidance, real vs historical/synthetic data, compact Mint community rule and raw Catalog meaning | Frozen upstream test/docs contain older copy/results; root docs explicitly distinguish them |
| Typography | Actual tokens, weights, line heights, measures, wrapping and numeric stability; phone/desktop renders and type-size probe | Visitor's installed system face varies; all conditional Fact Check states were not measured |
| Colors | Source tokens/roles and observed textual status cues; pinned rendered solid-background contrast check passed | Lowest measured landing text pair: muted `#8c968e` on `#0a0a0a`, **6.48:1** at 390 and 1440; this does not certify every state, control border, image/alpha background or inline-link distinction |
| UI | Source hover/active/disabled/error/loading styles, square borders/native overlays, named wallet marks; actual disclosure/modal/error/payment-review states; reduced-motion probe | No 10%-speed animation replay, native wallet app/passkey flow or live paid-oracle progress session |

### Findings, dispositions and fixes

1. **Retained design exception — uppercase content headings.** `web/src/pages.tsx:213` (`<Section title="WHY SWORN">`) and `:216` (`BUILT BY THE SWARM`) produce the probe's two uppercase text boxes. Confirmed in the desktop full-page capture. A future editable release could use “Why Sworn” and “Built by the swarm”; the current task says “used unchanged: no file added, changed or left out,” so neither source nor export was changed. Probe `casing` remains failed, explicitly accepted as a preservation exception.
2. **Retained design exception — monospace prose.** `web/src/styles.css:31` establishes the system monospace stack; `:257` applies 15px prose. Probe observed one family, weights 400/600 and 14 long monospace text boxes. The established instrument-panel system and exact-copy requirement govern; a new font or prose override would alter the requested release. Probe `type-faces` remains failed. This is not represented as a clean 16/16 pass.
3. **Validation mismatch — imported browser assertion predates 1.0.1 copy.** `web/tests/indexer-browser.mjs:242` expects full “at least 5 Transfer events” wording in the Mint picker. `web/src/community-rule.mjs:102` supplies compact paid-swarm-request language for Mint; Catalog keeps the full condition. The original suite's catalog group passes, then its Mint text assertion fails. No frozen file was edited. The supplemental runner asserts the actual compact wording, eligibility, registrant, icon and pre-signature review; final 5/5 supplemental checks pass.
4. **External RPC limitations.** The broad native-network run received an archive log rejection from PublicNode (“Archive requests require a personal token”) while discovering early CardMinted logs, and two Tenderly CORS failures. Accordingly its saved-history discovery and strict console-cleanliness checks fail. There were **zero uncaught page errors and zero failed local resource responses**. No source/RPC configuration was changed. Deterministic indexed-history/fallback tests pass, but they do not establish live archive availability.
5. **Live-indexer test limitation.** `web/tests/indexer-live-browser.mjs:90` timed out waiting for `Source: indexer, block`. It observed rules/wallet requests, no application/console errors and no eligibility-endpoint call in that scenario. The cause was not established. Separate read-only HTTP observations returned the rules list and a complete, CORS-open eligibility response (count 5/met for the public fixture wallet); this is service evidence, not a successful end-to-end live browser check.

No applicable source fix is authorized in the immutable folders. Corrections made in the deliverable are documentation/provenance corrections: obsolete root release/build claims were replaced with the current pin, actual no-build status, exact inventory, measured coverage and explicit limits. Final archive/blob comparisons were rerun after validation and documentation.

## Browser availability, screenshots and remaining limits

The supplied browser tool failed to launch Chromium with a crashpad database error. Local Playwright Chromium succeeded using temporary configuration/cache locations, and rendered screenshots were inspected directly. WebKit downloaded but could not launch because required system shared libraries are absent. Chromium evidence is not a Safari/iPhone compatibility claim.

Current screenshots retained at existing permitted evidence paths:

- `artifacts/screenshots/landing-390.png`: production entry, 390×844.
- `artifacts/screenshots/focus-390.png`: keyboard-focused home action, visible 2px solid `rgb(217, 224, 218)` outline.
- `artifacts/screenshots/catalog-390.png`, `fact-check-390.png`, `about-390.png`, `integrate-390.png`: current route entries.
- `artifacts/screenshots/fact-history-390.png`: current indexed history with deterministic fixture replies, scrolled to fact rows.

The 1440 desktop entry and full-page probe screenshots were inspected in scratch; they are not delivered under a misleading 1280 filename. Other retained screenshots/reports not listed as current are historical project evidence, not checks rerun here. Current browser JSON and probe results are in artifacts/browser-validation.json and artifacts/taste.json. No fake screenshots or source-only rendered claims are used.

Not performed: production rebuild (prohibited), real wallet connection/signature/transaction, Coinbase passkey enrollment, native mobile wallet-app handoff, physical touch-device session, screen reader, native 200% zoom, RTL, forced-colors, a separate automated accessibility audit, slow-motion animation replay or a new paid oracle request. IPFS gateways and public APIs may fail independently; fixture tests do not guarantee future availability. No claim of full accessibility or end-to-end financial operation is made.

## Completion

**Complete for the stated exact-copy delivery scope**, with the documented upstream design exceptions and external/browser validation limits. Both required folders are intact, root documentation is current, and the export is ready for the existing publisher under the same name. Submission size/protected-path checks are recorded in artifacts/submission-audit.json. No source/runtime deliverable was dropped to meet the budget.
