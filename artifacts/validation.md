# Sworn v2 import validation

## Scope and precedence

This delivery replaces the old redirect with the exact `dist/` from [banse/sworn, commit f4e16276a954f0c9c7327733ba6adee298279fa6](https://github.com/banse/sworn/tree/f4e16276a954f0c9c7327733ba6adee298279fa6). It retains the existing `sworn` hosting name. The publication system publishes the committed directory after this job; no publishing or blockchain command was invoked.

The controlling requirement is **“used unchanged: no file added, changed or left out, and no build run here.”** It takes precedence over the generic production-build and design-fix criteria. Accordingly:

- `dist/` contains exactly 85 upstream files, totaling 2,305,898 bytes. No banner, wrapper, new metadata, rewritten manifest or redirect was inserted.
- No production build or export regeneration was run. The upstream production build is supplied by the requester through the pinned repository.
- All 227 included `web/` files retain their original bytes, including source, tests, public assets, package manifest and lockfile. The only omitted upstream source-directory file is `.gitignore`; no ignore file is changed.
- Current site source lives in `web/`. Existing `site/`, Solidity source, build configuration, lockfiles and dependencies are preserved.
- The newer frontend retains launch #2404, as pinned in its own deployment metadata. The older repository contract/deployment history is not substituted for its runtime binding.
- Review findings in the immutable interface are reported, not patched into the supplied source/export. Documentation and release-verification tooling are outside those directories.

There was no missing owner address, key or choice requiring requester input. No stand-in deployment value was added.

## Requirement record

| Requirement | Outcome |
| --- | --- |
| Replace redirect under the existing name | Delivered: complete application at `dist/index.html`; no old redirect remains in the export |
| Exactly the pinned upstream export | Pass: independent archive, GitHub tree Git-blob checks, SHA-256 file manifest and exact file-set comparison |
| Source and lockfile alongside export | Pass: original `web/package.json`, `web/package-lock.json` and full frontend inputs retained |
| Relative static assets | Pass: entry URLs use `./`; `/preview/` subpath exercised; all deployment-manifest assets verified |
| Usable main interactions | Pass for unsigned checks: real wallet Explorer, exact metadata, wallet picker, Curator export and docs search |
| Responsive layouts | Nine routes checked at 320, 390, 780 and 1440px without page-width overflow |
| Main action in the first 390px screen | Pass: field and Explore wallet button visible, button bottom 499.39px in an 844px viewport |
| Title/favicon/description/og:title/og:image | Pass, all supplied upstream; relative share image and favicon exist |
| Typecheck | Pass, exit 0 |
| Production build | Not run: explicit task override |
| Better Interface six-domain review | Performed, with retained upstream findings and explicit coverage limits below |
| Root design and install/preview/rebuild docs | `DESIGN.md` and `README.md` updated from final source |
| Complete submission below 8 MiB | Audited using temporary submission and standalone content Git bundles; see `artifacts/submission-audit.json` |

## Integrity and checks actually run

The pinned archive was downloaded to a temporary directory from GitHub's codeload endpoint. The independent recursive Git tree API returned the exact requested commit and `truncated: false`. Every one of the 85 export Git blob IDs and every included frontend-source Git blob ID matched. File contents were then checked with SHA-256 and a second direct archive comparison.

`artifacts/export-manifest.json` records the commit, upstream tree IDs, all 85 relative paths, sizes, SHA-256 and Git blob hashes, plus the source fingerprint. The supplied `dist/imd-deployment.json` was not rewritten.

| Command / check | Actual outcome |
| --- | --- |
| `python3 tools/verify-sworn-v2.py --archive <downloaded pinned archive>` | Exit 0; exact 85-file export and 227-file source comparison |
| `npm ci --ignore-scripts --no-audit --no-fund` in an external temporary `web/` copy | Exit 0; 72 packages installed from the unchanged lockfile |
| `npm run typecheck` in that copy | Exit 0; `tsc --noEmit` |
| `node --test` over 28 selected `tests/*.test.mjs` files | Exit 0; 189 passed, 0 failed, 0 skipped; about 21.2 seconds |
| `node scripts/verify-abis.mjs` in the temporary copy | Exit 0; source pin and all three canonical Keccak ABI hashes match |
| `node scripts/manifest.mjs --check` | Exit 0; 84 manifest-listed assets, 2,292,037 bytes excluding the manifest itself |
| `node scripts/static-release.mjs` | Exit 0; 4 script/style assets, relative entry paths, no mock runtime transport |
| `node tools/validate-sworn-v2.mjs` against the unchanged export | Final exit 0; 49 passed, 0 failed |
| `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` with external Playwright module | Exit 0; 14 of 16 measured checks passed; flags detailed below |
| axe-core via `@axe-core/playwright` | Seven routes scanned at 390 × 844; actual violations and incomplete checks retained in browser evidence |
| WebKit launch | Attempted; failed because required shared libraries are absent |

The unit-test selection excluded `skill.test.mjs`, which compiles Solidity examples and requires upstream root `agents/`, `llms.txt` and `src/Catalog.sol`. It was not run or counted. Four selected tests use Vite's SSR module loader in the temporary source copy. That is module loading for unit tests, not a production build or export regeneration. No Solidity build or fork test was run.

Dependencies, browser binaries, npm caches, downloaded archives and the temporary source checkout stayed outside the submission. No installed `node_modules/`, cache directory, vendored registry or dependency archive is delivered.

## Browser evidence

The delivered checker manages a bounded foreground preview under `/preview/`, exercises the committed files, then closes the browser and preview. It uses no wallet account or private key. For worker mainnet reads, the supplied contributor transport was substituted in test routing only; the published source remains `https://ethereum-rpc.publicnode.com` and the unchanged upstream RPC pool. No machine RPC address is in the export or reports.

The final browser was Chromium 156.0.8078.4. Nine routes (`/`, `/catalog`, `/mint`, `/request`, `/register`, `/wallet`, `/curator`, `/integrate`, `/about`) produced their expected headings and fit the page width at 320, 390, 780 and 1440px. The desktop landing was additionally inspected at 1280 × 844. These are representative initial/unsigned states, not every possible connected transaction state.

Meaningful checks included:

- Home address submission rejects invalid input, sets `aria-invalid`, states the expected address format and focuses the field.
- A real wallet address was selected from the pinned eligibility data, not invented. Its Registry/Curator facts loaded from mainnet, along with deployed Renderer metadata named `Sworn #1` with 15 attributes. The exact metadata download target decoded as valid JSON with an SVG image.
- The native wallet dialog opens with Browser wallet/Coinbase options. Repeated Tab does not enter background controls; native browser-chrome focus is allowed. Escape and backdrop close it, and opener focus returns.
- Legacy `#/claim` resolves to Mint Card; unknown routes offer a working return link. Mint/request routes offer connection before signing.
- Curator filtering on fact 101 produces a real historical selection. A browser download contained 4,931 matching wallets in JSON, with historical provenance, chain ID 1 and matched fact IDs. This is a candidate list, not accepted eligibility proof.
- Curator's ArrowRight tab navigation and malformed-address validation work.
- Handbook search for `hasTrait` returns local results; Escape clears it.
- Deliberately refused RPC reads produce “Cannot read the chain, retrying.” while keeping the public interface usable.
- The final run recorded zero uncaught page errors, zero console errors and zero failed local HTTP resources.

An early test harness incorrectly treated native dialog focus visiting browser chrome as escaping to a background control. Its assertion was corrected and modal cleanup added to prevent cascading test failures. A separate label lookup was corrected to use the combobox's accessible role/name, and the consumer error scenario now submits malformed input; empty input is discussed below. These are validation-harness repairs, not product changes. All 49 final checks passed after those corrections.

`artifacts/browser-validation.json` includes the final check list, viewport metrics, accessibility scan details and limitations. Its `additionalVisualInspection` records the separately observed focus outline and desktop screenshot.

Current screenshots, inspected as images:

| File | Final surface |
| --- | --- |
| `artifacts/screenshots/landing-390.png` | Home first screen at 390 × 844 |
| `artifacts/screenshots/landing-1280.png` | Home desktop at 1280 × 844 |
| `artifacts/screenshots/focus-390.png` | Visible 2px input focus outline at 390 × 844 |
| `artifacts/screenshots/catalog-390.png` | Catalogue/Explorer at 390 × 844 |
| `artifacts/screenshots/claim-390.png` | Mint Card at 390 × 844; historical artifact filename retained |
| `artifacts/screenshots/about-390.png` | About at 390 × 844 |
| `artifacts/screenshots/integrate-390.png` | Integrate at 390 × 844 |

Other existing screenshot/report files are preserved history, not additional version 2 validation claims. Probe scratch screenshots were generated and inspected separately; only budgeted delivery evidence is retained.

## Six-domain Better Interface review

The pinned guide's workflow, core principles for all six domains, documentation method and probe thresholds were read before validation. The decision during import was to preserve the requested visual system and exact release, then distinguish measured defects from preferences. No new font, component, wallet stack, theme or decorative asset was added.

| Domain | Coverage | Evidence and limits |
| --- | --- | --- |
| Accessibility | Checked with findings | Native controls/labels, headings, skip link, focus styles, form errors, dialog keyboard path, Curator tabs, target spacing and axe scan. Actual input focus ring inspected. Screen reader and forced-color interaction unperformed; invalid description reference and link distinction remain. |
| Layout | Checked | Source frame/grid/breakpoints and rendered 320/390/780/1440 reflow; 1280 desktop screenshot. No page overflow; Curator/code tables scroll locally. Native 200% zoom, RTL and localization stress tests unperformed. |
| Writing | Checked | Main action verbs, invalid-address correction, historical/current distinction, unavailable states, costs and credential/card distinction reviewed. Empty consumer submit has no corrective feedback. No new product copy was written. |
| Typography | Checked with preservation exceptions | Actual tokens, weights, wrapping, 16px mobile inputs, numeric stability and 390/desktop screenshots. Landing probe observes six sizes and two weights. Monospace prose and uppercase sections retained. Physical iOS input zoom not tested. |
| Colors | Checked with findings | Canonical source tokens and rendered solid text pairs measured by the probe; primary text/background 14.73:1, muted/background 6.48:1. Inline link/adjacent text difference fails axe. Some conditional/gradient/image pairs and axe incomplete items remain unverified. App has no light theme; handbook print styling was source-reviewed only. |
| UI | Checked | Button/field rest, focus, active/hover declarations, loading/error/empty/disconnected states, native dialog and Curator exports reviewed. Reduced-motion probe passed. No signed transaction, native wallet deep link, passkey creation or animation-panel replay at 10% speed performed. |

### Findings retained in the pinned release

These are upstream findings. Applying the proposed UI changes would violate the explicit immutable-export requirement, so none was inserted into `web/` or `dist/`.

1. **Accessibility · high · inline links rely on color.** Source: `web/src/styles.css:57–63`, `a { color: var(--accent); text-decoration: none; }`. At 390px, axe reports `link-in-text-block` on five routes (13 nodes in total): Home 5, Catalog 4, Mint Card 1, Mint Rule 2, Curator 1. Link/adjacent-text contrast is 1.01:1 against normal body text and 2.23:1 against muted text; underlining exists only on hover. A future editable release should underline inline prose links at rest while retaining their existing focus/hover treatments. The source/export are retained unchanged; this is not an accessibility pass.
2. **Accessibility · medium · missing error-description target.** Source: `web/src/components.tsx:105`, `aria-describedby="address-error"`, while the `Status` at line 111 has no matching id. Submit an invalid address on Home/Explorer: focus and visible status work, but the explicit description reference does not resolve. Axe also marks the attribute for review. A future release should bind the error/status to an actual unique element id. No screen-reader announcement is claimed.
3. **Writing · low · empty Curator consumer submission has no feedback.** Source: `web/src/controllers/useCurator.ts:59`, `if(!address)return;`. In Consume facts, submitting the empty wallet field leaves no field correction; a malformed nonempty address does produce the expected error. A future release should validate the empty field and show the same format guidance. Preserved as supplied.
4. **House-bar exception · two all-caps headings.** Source: `web/src/pages.tsx:210` and `:213`, `WHY SWORN` / `BUILT BY THE SWARM`. The probe flags casing; both are visible in the full-page evidence. A future stylistic revision could use sentence case, but exact upstream preservation wins here.
5. **House-bar exception · monospace prose.** Source: `web/src/styles.css:30`, system monospace inherited by prose. The probe flags 14 prose boxes. This is the established instrument-panel identity and is retained with the pinned release; no font change was authorized.

Axe's `incomplete` results are retained rather than called passes: color contrast on four of seven scans, address ARIA references on Home/Catalog, catalogue row ARIA roles and a loading-state Curator table-header relation. No claim of full WCAG conformance is made. The serious violations are the link-distinction root cause listed above.

### Probe result

`artifacts/taste.json` is the actual pinned probe output: **14/16 passed**. Passed: render, layout, targets, contrast, tracking, eyebrows, type-sizes, glyphs, slogans, repetition, copy-budget, chrome, motion and share. Flagged: casing and type-faces. The first mobile screen contains 60 words of prose at the probe's limit, and the main action is plainly visible. Target spacing passed the 24px baseline; 24 controls were below the comfortable 44px size. Those are measurements of the landing, not an audit of every route.

## Submission size and protected paths

A temporary audit repository stages the final permitted paths over the supplied base without changing the original repository's Git metadata. Its submission bundle names the supplied base as a prerequisite, and a separate standalone content bundle contains the entire final tree without history. Both are measured against the 8,388,608-byte limit; exact measurements/metadata margin are in `artifacts/submission-audit.json`. A compressed archive of all regular submission files was also measured at about 3.8 MB. Required source and runtime files were not removed to achieve the budget.

An initial attempt to bundle all ancestor history failed because the supplied checkout lacks older historical Git objects (`pack-objects` could not read one). That limitation is not repaired by altering `.git/`; the two successful checks cover the complete current content and submission changes. The original Git metadata, existing dependency submodule pointers and every protected build/configuration file remain unchanged. No new submodule is introduced.

All artifact files are on the existing explicit allowlist and fit their existing per-path limits and 2 MiB total budget. No ignore-file change was necessary. Generated browser output outside `test/scratch/` was removed; dependency/browser installations and archives are outside the repository.

## Completion and limitations

**Complete for the stated immutable-import scope.** The generic rebuild/fix requirements are explicit exceptions, not invented passing results. Root README/DESIGN documentation, verification scripts, evidence and payload budgeting are part of the deliverable; the production export and source are pinned unchanged.

Unperformed: production build (prohibited); WebKit (required shared libraries unavailable); real wallet connection, network switch, signing, transaction broadcast, paid oracle lifecycle, wallet-app deep links, physical devices, passkey creation, screen readers, native browser zoom, RTL/localization stress tests and full contrast/accessibility coverage. The app's external RPC/API/IPFS availability can change after this observation. No independent verifier, external audit or onchain deployment is claimed.

The final integrity check runs after all documentation and evidence changes. Temporary tooling and preview output are removed from the submission; only actual source, runtime assets and bounded evidence remain.
