# Sworn indexer integration · worker validation

Checked on 2026-10-27 UTC. These are worker observations, not independent certification. The assignment's verifier checks paths and bytes. Delivery is the changed `web/` source, unchanged dependency lockfile, canonical agent build inputs and rebuilt root `dist/` for the existing sworn hosting name. Publication follows submission; no publishing or contract deployment command was run.

## Requirement coverage

| Requirement | Result and evidence |
| --- | --- |
| Pinned source plus four changes | `web/` started byte-identical to banse/sworn `f6e80c156946020d5eb411a22fbf9ff962615438` except its two omitted ignore files. Only integration source, tests and documentation change; the canonical root agent/llms inputs are copied from that same commit. Stylesheets, hash routes, data, ABIs, dependencies and build configuration are unchanged. |
| Community eligibility first reads indexer | `src/eligibility.mjs` calls `indexedEligibility` only for ids ≥10001. Complete supported replies retain count, threshold, op, met, coverage and transfers. Advice names `indexer, block N`; unsupported, partial, failed and malformed replies retain the original scan and name `chain scan`. |
| Catalog eligibility unchanged | Unit checks prove snapshot ids and live 601/1301 never read the indexer. The existing scan implementation and snapshot/data files are unchanged. All historical count/sum/filter, split-range, refusal, nonce, call, seat-history and deadline regressions pass. |
| Community rule meaning and registrant | `src/community-rule.mjs` derives wording from the registered fields. Early Flock shows the full IMD and payee addresses, threshold 5 and blocks 26,038,414–26,279,931 in Catalog and Mint Facts. `/rules` supplies fields; `specOf` and `SpecRegistered` are the fallback. Address filters are decoded by ABI field type, so ordinary small uint filters remain numbers. |
| Community card | Both surfaces reuse the existing `CommunityCard` at 56px; no new asset or stylesheet. Shared community rows retain the same component. |
| Wallet history first reads indexer | Request, terminal-state and card data adapt to the existing history models. All five API states are covered in unit tests. Four reference requests (601, 701, 1105, 1301) display as saved facts; the card's frozen direct facts still come from Registry. Request detail reads use the index before log scanning and retain Registry `hasTrait`/artwork checks. |
| Browser fallback | Deliberate network abortion retains the pages, rule attribution, chain eligibility advice and complete scanned history. A refresh switching an already loaded history from indexer to scan keeps rows visible and does not duplicate them. |
| Static export | `base: './'`, existing 90-file layout including manifest, local runtime scripts, complete ABI/data/art/handbook assets and relative entry URLs. Manifest and static-release checks pass. |
| Responsive primary action and metadata | At 390×844, Explore wallet is within the first screen at y=475.39–519.39. Title, favicon, description, og:title and local og:image exist. All 17 canonical routes/aliases load at 1280 and 390 with no page overflow. |
| No new dependency or protected edit | Existing manifests, lockfiles, Foundry configuration, remappings, modules, lib pointers and all forbidden paths are unchanged. Generated dependencies, browsers, caches, archives and scratch evidence are excluded. See `submission-audit.json`. |

## Commands and actual results

Commands are from `web/` unless stated otherwise. Node 22.23.2 and npm 10.9.8 were used. npm cache and downloaded browser binaries were placed outside the submission. Installed `web/node_modules/` is ignored at every nesting level by the existing ignore rule.

| Command/check | Actual outcome |
| --- | --- |
| `npm ci --cache /tmp/sworn-npm-cache --no-audit --no-fund` | Passed; unchanged lockfile, no new dependency |
| `node scripts/agents.mjs` | Passed; exported copies equal the pinned canonical inputs |
| `npm run typecheck` | Passed; `tsc --noEmit` |
| `npm run build` | Passed; all three canonical ABI hashes/source-pin checks, Vite build, deployment manifest and static-release gate |
| `npm run verify:export` | Passed; every exported asset enumerated and hashed; no fixture transport or absolute entry URL |
| `npm test` | 284 passed; 0 failed, skipped or cancelled, including 9 new indexer tests |
| `node tests/indexer-browser.mjs` | 6 scenario groups: community meaning/icon, eligible count 5, not-met count 0, indexed history/details, outage and refresh fallback, all routes/primary controls |
| `SWORN_TEST_RPC=<read-only transport> node tests/indexer-live-browser.mjs` | Live API and Ethereum reads pass for counts 5/47/0, card 2's four verified requests and a saved detail view. The test transports public RPC requests through the contributor-provided endpoint; reports name the public source. No write method is forwarded. |
| Root `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste` | Passed 14/16 checks; screenshots inspected. Playwright was selected via `IMD_PLAYWRIGHT`; browser files via `PLAYWRIGHT_BROWSERS_PATH`. |
| `git diff --check` and source/export path audits | Passed; no whitespace errors or prohibited edits |
| WebKit installation and launch | Browser downloaded, but launch fails because the host lacks GTK4, Graphene, GStreamer and other required shared libraries. Rendered WebKit checks were not performed. |

Inherited build warnings concern dependency `use client` directives, a browser-externalized `node:worker_threads` module and bundler timings. They do not fail the build; no related runtime exception occurred in the production interaction or live tests.

`browser-validation.json`, `live-browser-validation.json`, `taste.json`, `export-manifest.json` and `submission-audit.json` contain the current measured results. Named screenshots are retained under `artifacts/screenshots/`; scratch screenshots and logs are removed before submission. Older reports elsewhere in the source describe earlier assignments and are not claims that those commands were rerun here. The test catalog Solidity fixture comes verbatim from the pinned commit; it lets its documentation test check that catalog without changing this project's older root contracts.

## Interaction observations

The production export was served under `/preview/`. A deterministic read-only wallet/RPC fixture used captured real API responses. Normal scenarios produced no console errors, page exceptions or missing local assets. The outage scenario deliberately aborts indexer connections and therefore records expected `net::ERR_FAILED` network messages separately; it still completes its scan paths. No external script was requested. External requests stayed within the existing public Ethereum RPC pool, `api.imd.fun` and the specified indexer; the preserved IPFS paths were not needed in these scenarios.

Live reads independently showed count 5/met true for `0x887b86b6b6957f7bbea88b8cefd392f39236a88c`, count 47/met true for `0xe5b1275fb926613d983da33fbfe1f331b7f64f2a`, and count 0/not met for `0x84f4b7424e1b0464f9c749725c1f34bed9aa8ada`. Each was visible within five seconds after connection; exact final timings are in the live report. The existing Show ineligible facts disclosure was opened to inspect the negative row. Registry/API queries use the actual public wallet addresses; fixtures are not included in the production module graph.

History showed the same four verified request ids/traits and card 2 as the live wallet endpoint. The list also retains the original direct-facts snapshot entry. Saved request details still read Registry confirmation and optional oracle enrichment. Indexer events retain real block/transaction/request identifiers; the API omits log indices, so none is fabricated. Stable request/card keys handle same-block ordering, and mixed-source merging matches the same write using its identity, block and transaction.

Main actions exercised include hash navigation, valid read-only wallet connection, opening/dismissing the native wallet modal, address validation, the existing ineligible-row disclosure, entering Mint Fact preparation without signing, history refresh and View agents and results. No real account signed, no paid oracle request was created and no mainnet transaction was broadcast.

## Better Interface · six-domain coverage

The visual idea is the existing compact monospace Ethereum instrument: green actions and thin rules around wallet facts and the hive. The brief's “no design change” takes precedence over generic suggestions to change this established system. All six pinned domains were read and applied during implementation; `DESIGN.md` documents the final source tokens, type, spacing, components and breakpoints.

| Domain | Source review and rendered coverage | Limits |
| --- | --- | --- |
| Accessibility | New advice uses the existing `role=status`; names, amounts and addresses remain text. Existing named native buttons/links and wallet modal are reused. Keyboard Escape, invalid-field focus/aria-invalid and normal contrast/target checks passed. | No screen-reader session or complete WCAG audit. Existing color-only inline links were reported in the previous release; axe was not rerun here. |
| Layout | Existing fact/picker grids and responsive rules reused; complete addresses wrap. Inspected community Catalog/Mint, positive/negative/outage rows and history at 1280/390. All 17 routes/aliases have no page overflow at those widths; entry probe also checks 320/1440. Main action remains on the first phone screen. | All-route 320/1440, RTL and 200% text-zoom checks not performed. |
| Writing | Replaced T/threshold-only community labels with field-derived words, full filter addresses and a registrant line. Count, threshold, indexed block and fallback source are explicit; panel/payment warnings stay. Unknown remains advisory, never silently false. | Wording for other valid rule kinds is model-tested; live registered example is kind 1. |
| Typography | Existing body/small type, line heights, monospace stack and tabular numbers retained. Long addresses and multi-line source text were inspected without clipping. Probe reports six sizes including one-offs on the entry page. | Installed system face varies by platform; no new font or global type change. Full conditional Fact Check type inventory not measured. |
| Colors | Existing text/muted/danger/accent tokens reused; status also uses words. All measured entry-page text/background pairs pass the probe's 4.5:1/3:1 thresholds. | Probe measures its entry surface, not every possible progress/transaction state. |
| UI | Existing CommunityCard, evidence marks, status, native disclosure and history rows reused. Loading, unknown, met, not-met, successful indexed history, outage and retry paths checked. Reduced-motion entry probe passes. | No new paid verification animation or transaction receipt was generated. WebKit launch unavailable. |

## Findings, fixes and retained exceptions

1. **Writing/data: community rows hid their actual condition.** `web/src/pages.tsx:303` and `web/src/claim.tsx:1457`; previously `T1 · threshold 5`. Changed to the shared field-derived description and registrant, with full addresses and block separators. Why: requested rule meaning and truthful readable conditions. Reproduced in Catalog and Mint Facts at 1280/390; final screenshots and assertions show all fields.
2. **UI: personal community Mint rows lacked their card.** `web/src/claim.tsx:1499`; previously the preview rendered only for ids below 10001. Changed to the existing CommunityCard branch; Catalog also uses it at `web/src/pages.tsx:307`. Why: requested icon parity without adding a visual system. Rechecked by image-source/row assertions and screenshots at both widths.
3. **Bug found during integration: source-switch refresh could duplicate rows or restart an unfinished scan.** `web/src/fact-check/history-controller.ts:102` preserves the original visible rows/coverage while scanning; `web/src/fact-check/history-model.mjs:111` replaces the same indexed write when its RPC log arrives. Why: preserve the existing history behavior during an indexer outage. Unit assertions and a browser refresh from indexed history into aborted-indexer fallback now pass without duplicate entries or a loading loop.
4. **Retained design exception, not a new defect: uppercase headings.** `web/src/pages.tsx:213` and `:216`, `WHY SWORN` and `BUILT BY THE SWARM`. The probe fails its casing preference. Keep: the assignment explicitly says “no design change.” They are inherited and below the first screen.
5. **Retained design exception, not a new defect: monospace prose.** `web/src/styles.css:30`, the global `ui-monospace` stack. The probe fails its prose-family preference. Keep: the established instrument-panel design and explicit “no design change.” Font-family/weight counts themselves meet the probe's limits.

The probe's other fourteen checks pass: render, layout, targets, contrast, tracking, eyebrows, type-sizes, glyphs, slogans, repetition, copy-budget, chrome, motion and share. The inherited long landing headline and monospace character were preserved under the same brief constraint. No new design finding remains open on the changed surfaces.

## Remaining limitations

WebKit could not launch with this machine's libraries. No real wallet signing, paid oracle request, complete live historical outage scan, screen-reader audit, RTL or zoom audit was performed. Live external service availability can change. The original fallback still has its original deadline and RPC limitations; a failure stays explicitly unknown and identifies the chain scan. A failed fallback attribution read says registrant unavailable. These limits do not replace the recorded passing build, unit, Chromium and live read checks.

The protected older launch #2147 project stays intact. Runtime source/ABI checks continue to use the pinned imported launch #2404 deployment, as before this assignment. No address, ABI, chain, wallet connector, dependency or transaction construction was retargeted.
