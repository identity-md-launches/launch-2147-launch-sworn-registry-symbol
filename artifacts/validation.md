# Sworn Fact Check release validation

## Scope and release authority

**Complete for the requested immutable-import scope.** The hosting payload is exactly `banse/sworn` commit `f6e80c156946020d5eb411a22fbf9ff962615438`, branch `sworn-fact-check-site`: **90 files, 2,411,318 bytes** in `dist/`. It entirely replaces the previous 85-file export at `f4e16276a954f0c9c7327733ba6adee298279fa6`, retaining the name **sworn** / `sworn.site.identitymd.eth`.

The assignment explicitly requires “used unchanged: no file added, changed or left out, and no build run here.” That specific requirement governs the generic production-build and UI-fix acceptance clauses. No production build, export regeneration, custom UI patch, publishing command or contract deployment was run. Findings are reported below rather than silently changing the release.

The matching `web/` source contains 319 included files (3,504,368 bytes), all identical to upstream. Only upstream `web/.gitignore` and `web/simulation/.gitignore` are omitted; these are not runtime/build inputs. Source, package manifest, lockfile, source-pin inputs, notices, mock/simulation source and necessary assets remain complete. Existing dependency manifests/lockfiles, Vite/TypeScript configuration, Foundry configuration and existing dependency pointers are unchanged. Earlier `site/`, Solidity and deployment records are preserved.

The imported app continues to use the launch #2404 deployment in its pinned `web/deployment-handoff.json`, not this older project's launch #2147 addresses. That binding is upstream behavior, also present in the prior imported release; it was neither guessed nor retargeted. Source pin and canonical ABI checks passed for the imported deployment.

Publication happens after submission by consuming `dist/`; it is not an observation of an already-published new version. No requester input is needed.

## Commands and actual results

Source checks ran in an isolated temporary copy of the pinned source, with dependencies/cache/browser binaries outside the submission. Every delivered source/export byte was rechecked after validation. Commands below are relative to that copy's `web/` unless stated otherwise.

| Check | Actual outcome |
| --- | --- |
| Download pinned GitHub archive; compare full export sets and bytes | 90/90 files match; no old asset, missing file or extra export file |
| Independent GitHub recursive tree API | Commit matches; response not truncated; all 90 export and 319 included source Git blob hashes match |
| `npm ci --ignore-scripts --no-audit --no-fund` with an external writable cache | Passed, exit 0; locked dependencies installed in the temporary copy |
| `npm run typecheck` | Passed, exit 0; `tsc --noEmit` |
| `node --test $(rg --files tests -g '*.test.mjs' \| rg -v '/skill\.test\.mjs$')` | 40 test files, 272 tests passed; 0 failed, cancelled, skipped or todo |
| `node scripts/verify-abis.mjs` | Passed; source pin and Renderer/Composer/Registry canonical Keccak hashes match |
| `node scripts/manifest.mjs --check` | Passed; 89 manifest-listed assets, 2,396,741 bytes |
| `node scripts/static-release.mjs` | Passed; 9 script/style files checked, relative entry assets, no fixture/demo transport |
| Root: `python3 tools/verify-sworn-v2.py --archive /path/to/pinned.tar.gz` | Passed; all 90 export and 319 source files match independently downloaded archive |
| Root: `node tools/validate-sworn-v2.mjs` with external Playwright and read-only test RPC selected | **59 checks passed, 0 failed** |
| Pinned `taste@1` probe on committed `dist/` | **14/16 checks passed**, including render, layout, targets, contrast, motion and share |
| axe-core 4.11.0, eight initial routes at 390 × 844 | Ran; one shared inline-link distinction defect on five routes; details below |
| Production build / `npm run build` | **Not run: explicitly prohibited by the task** |
| WebKit | Installation and launch attempted; required host shared libraries unavailable, so interactions did not run in WebKit |

The selected unit run excludes only `tests/skill.test.mjs`. That file compiles Solidity documentation examples and expects additional upstream root agent files; its three tests were not run. Several selected tests use Vite's in-memory SSR module loader; this is not a production build and does not modify the export. No Foundry build, fork test, simulation build or new oracle request was run.

The pinned probe initially could not locate Playwright. After installing the existing pinned frontend dependencies and browser binaries outside the repository, it ran successfully with `IMD_PLAYWRIGHT` selecting that installation:

```sh
node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste
```

The input guide/probe paths are removed by the assignment before submission; the actual result is retained in `artifacts/taste.json`. Source/export hashes and archive SHA-256 are retained in `artifacts/export-manifest.json`.

## Rendered interactions and responsive behavior

The final automated interaction run used Chromium 156.0.8078.4 and served the exact export under `/preview/`. Worker chain requests used the provided read-only contributor transport through test interception; the published RPC source remains **https://ethereum-rpc.publicnode.com** and the unchanged public fallback pool. No machine-specific RPC address is present in the export or evidence reports.

Ten routes (`/`, `/catalog`, `/mint`, `/request`, `/fact-check`, `/register`, `/wallet`, `/curator`, `/integrate`, `/about`) were checked at 320, 390, 780 and 1440px: **40 layouts with expected headings and no page horizontal overflow**. The shared header and main interaction were also visually inspected with the browser connector at desktop size. Current screenshots were inspected as images, including the 390px landing, native wallet dialog, visible keyboard focus and full saved-fact view. At **390 × 844**, the landing product, address field and **Explore wallet** action are visible; the action occupies y=475.39–519.39px.

Meaningful completed checks:

- Invalid home address submission provides the expected format, sets `aria-invalid`, focuses the input and references an actual `address-error` status element. The prior release's missing description target is fixed in the supplied upstream revision.
- Public wallet exploration reads Registry/Curator data and deployed Renderer metadata. Its exact JSON download decodes to a named SVG record with 15 attributes; it is not asserted to be a minted card for the selected census wallet.
- The native wallet dialog opens from both header and Fact Check, traps background interaction, supports Escape/backdrop dismissal and returns focus to the opener. Repeated Tab can visit browser chrome; it does not focus background app controls.
- Fact Check's disconnected action is reachable in the first mobile screen. `/oracle` and `/fact-check-demo` resolve to the live page without demo controls. Invalid oracle request parameters give a recovery message and a working Mint Facts link.
- A real wallet was discovered from the deployed Registry's early `CardMinted` logs. Its complete saved-fact history loaded; the displayed history transaction was independently checked for a successful receipt containing an event from that Registry indexed to the wallet. The page stayed within 390px.
- The real saved fact was **601 / Swarmed**. The rendered historical verification view showed the original question, agreement threshold 7/11 and eight reported members (seven TRUE, one FALSE), alongside the recorded Registry fact. The agent answers came from `api.imd.fun`; no fixture was inserted and no paid verification was initiated.
- More navigation opens by keyboard and closes with Escape, restoring summary focus. Mint Facts' section jump moves focus to the fact choices, with the first choice visible; its expandable guide retains the fee/refund explanation.
- Unknown routes offer a working return link; `/claim` opens Mint Card. Mint/request tasks present unsigned connection controls.
- Curator fact 101 filtering downloads **4,931** real historical candidates as JSON, labeled `historical-candidates`, chain 1, with matching fact IDs. This is not represented as a list of accepted credentials. ArrowRight changes Curator tabs, and malformed consumer addresses receive correction.
- Local handbook search returns 12 `hasTrait` results; Escape clears the results. Refused RPC reads display an honest unavailable/retry state while keeping the public interface usable.
- The final run recorded **zero uncaught page errors, zero console errors and zero failed local HTTP resources**.

An added history assertion initially assumed that any card mint must appear as a direct-fact row. Onchain `frozenDirect` was zero for the discovered wallet, and source review confirmed that empty direct snapshots are deliberately excluded. The checker was repaired to validate the wallet's actual saved fact against its successful receipt. This was a test-harness correction; the immutable product was not changed. All 59 final checks passed after that correction.

Current evidence is in `artifacts/browser-validation.json`. Screenshots describing this release include `artifacts/screenshots/landing-390.png`, `landing-1280.png`, `focus-390.png`, `catalog-390.png`, `claim-390.png` (Mint Card), `about-390.png`, `integrate-390.png`, `fact-check-390.png` (disconnected) and `fact-history-390.png` (full live-read saved-fact surface). Other retained reports/screenshots are historical inputs, not additional current check claims.

## Better Interface coverage

The pinned workflow, six domain core principles, documentation method and design-critic thresholds were read. During import, they guided preservation of the established instrument-panel system, source inspection, test coverage and documentation; they did not authorize rewriting the specified export.

| Domain | Coverage | Evidence and limitations |
| --- | --- | --- |
| Accessibility | Checked with findings | Native labels/buttons/landmarks, address validation/status association, skip link, modal keyboard containment and focus return, More disclosure, Curator tabs, 24px target-spacing probe and eight-route axe scan. Visible input focus screenshot inspected. Screen reader, forced-color interaction and every conditional focus stop unperformed. |
| Layout | Checked | Source grids/breakpoints plus 40 rendered layouts at 320/390/780/1440; first screen and real history at 390, desktop inspection at 1280. No page overflow observed. Native 200% zoom, RTL mirror and localization stress tests unperformed. |
| Writing | Checked with finding | Action names, local address correction, invalid request recovery, historical/current/credential distinctions, costs/refund wording and loading/unavailable messages. Empty Curator consumer submit still has no feedback. No new product copy was authored. |
| Typography | Checked with preservation exceptions | Actual global/local type roles, monospace stack, tabular numbers, address wrapping and 16px mobile address input checked in source and rendered screenshots. Landing probe sees six sizes and two weights; this is not a six-size certificate for all conditional Fact Check views. Physical iOS input zoom unperformed. |
| Colors | Checked with finding | Existing role tokens documented; probe measured landing solid text/background contrast as passing. Axe measured inline-link/adjacent-text distinction failures. Conditional animated/alpha/image pairs and incomplete scan items are not all verified. No app theme switch exists; handbook print theme source-reviewed only. |
| UI | Checked | Flat structural rules, primary/secondary controls, disconnected/error/loading states, native dialog, disclosures, section focus, exports, and real saved-fact/agent presentation inspected. Reduced-motion landing probe passed; Fact Check reduced-motion override source-reviewed. New paid lifecycle, physical wallet apps, passkey creation and animation replay at 10% speed unperformed. |

### Findings and disposition

1. **Accessibility · high · prose links rely on color.** `web/src/styles.css:57`, `a { color: var(--accent); text-decoration: none; }`. At 390px, axe reports `link-in-text-block` on Home (5 nodes), Catalog (3), Mint Card (1), Mint Rule (2), Curator (1): **12 nodes on five routes**. Contrast against adjacent text is 1.01:1 for primary body text and 2.23:1 for muted text, below the 3:1 distinction alternative, with underlining only on hover. Reproduction: read inline prose links at rest. A future editable revision should underline prose links at rest and retain focus/hover states. **Preserved unchanged**, as explicitly required; no full accessibility pass is claimed.
2. **Writing · low · empty Curator consumer submit has no feedback.** `web/src/controllers/useCurator.ts:59`, `if(!address)return;`. Reproduction: Curator → Consume facts → leave wallet empty → Check eligibility. The recorded run had zero alerts, zero invalid fields and no result. Change in a future editable revision: provide the same address-format guidance used for malformed nonempty input. **Preserved unchanged**.
3. **House-bar exception · capitalized section headings.** `web/src/pages.tsx:211` and `:214`, `WHY SWORN` / `BUILT BY THE SWARM`. The probe flags these two landing content headings; full-page evidence confirms them. A future stylistic revision could use sentence case. **Preserved unchanged**.
4. **House-bar exception · monospace prose.** `web/src/styles.css:30`, the system monospace family. The probe flags 14 prose boxes. This is the site's existing instrument-panel identity, not an accidental added font. **Preserved unchanged**.

The address-description finding from the previous validation no longer applies: `web/src/components.tsx:110` references the status with `id="address-error"` at line 116. Current invalid-field interaction and local status association were checked. The corrected upstream navigation and Fact Check connection affordance were also verified; none is attributed to a worker-authored UI fix.

Axe incomplete results are retained in the browser report, including contrast on Home/Catalog/Curator, Catalogue row ARIA, Curator loading table headers and About targets/ARIA. These require manual assessment and are not counted as passes. The saved-fact view was visually inspected, but no separate full axe pass is claimed for its dynamic canvas. The first phone screen contains 60 prose words at the probe's limit. Landing target spacing passes the 24px baseline; 14 controls are below the comfortable 44px size.

## Submission size, paths and documentation

`DESIGN.md` documents actual colors, typography, spacing, components, navigation precedence, Fact Check and wallet-summary behavior. README explains install, direct preview and a future rebuild recipe, and clearly distinguishes the prohibited current build from future development.

All current artifact paths fit `artifacts/path-budget.json`: 2,097,152 bytes aggregate, with explicit per-file caps. The only ignore-file change permits **two exact screenshot paths**, `artifacts/screenshots/fact-check-390.png` and `artifacts/screenshots/fact-history-390.png`, capped at 262,144 bytes each inside the unchanged aggregate budget. No broad cache/dependency inclusion is added.

The final audit in `artifacts/submission-audit.json` measures Git bundles in a separate temporary repository. It checks a complete current-content bundle and a base-to-final submission bundle, with a 65,536-byte metadata reserve under the **8,388,608-byte** limit. The measured complete-content bundle was **3,714,469 bytes**; the delta bundle was **1,335,545 bytes** before final audit-metadata updates. The 65,536-byte reserve keeps both below the limit after those updates. These audit bundles use minimal history; older ancestor history is not included. Existing dependency gitlinks are preserved; no new submodule is introduced. Installed modules/caches/browser binaries, downloaded archives and preview output are excluded. Original Git metadata is not modified by the audit. Source and all required runtime assets remain complete.

## Remaining limitations

Unperformed: production build (prohibited), WebKit interactions (host libraries unavailable), real wallet connection/network switching/signing/broadcast, new paid oracle lifecycle, native wallet-app links, physical devices, passkey creation, screen-reader sessions, forced-color interaction, browser-native zoom, RTL/localization and full conditional contrast/accessibility coverage. Public RPC/API/IPFS availability can change. No independent verifier, security audit, accessibility conformance certification or live publication is claimed.
