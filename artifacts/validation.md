# Sworn delivery validation

Worker-side implementation and checks, 2026-10-18 UTC. Execution profile: none. This record is not independent certification.

## Scope and decisions

Eight static hash routes implement the brief’s single-registry instrument panel. Source, manifest and lockfile are under `site/`; the export is `dist/`. The original Solidity sources, Foundry configuration, dependencies, `.github`, `.env` and `.git` were not edited. The root ignore file has an exact evidence-file allowlist with a 2 MiB total budget, documented in `path-budget.json`. Dependencies, compiler binaries, browser runtimes and package caches used for checks were kept outside the submission.

The brief’s exact headline, landing prose, claim sentences, monospace type, uppercase tracking, prescribed sizes and quoted-source punctuation were preserved. Injected EIP-1193/EIP-6963 wallets are used on the claim page, following the assignment’s narrower wallet requirement. No wallet connection is persisted. A tab-scoped intent/hash journal is the minimum recovery state needed to prevent a repeated swap after reload; it stores no key, signature or wallet identity.

Read-only snapshots fail closed. Prices and proofs are never invented to make an unavailable RPC look successful. A price change stops the prepared flow. Protocol addresses, chain, PoolKey, recipients, exact output, maximum input and deadline are bound before signing. All actual transaction execution during validation occurred on an isolated local fork, with no private key or live transfer.

## Commands and outcomes

| Check | Actual result |
| --- | --- |
| `npm ci` in a clean isolated copy of `site/` | Passed; lockfile reproduced the dependency graph |
| `npm run typecheck` | Passed |
| `npm test` | 27 frontend tests passed; 0 failed |
| `npm run check:abi` | All three canonical ABI hashes and runtime fixtures match the launch record |
| `npm run build` | Passed; output directed to repository `dist/` during the isolated build |
| Second clean production build | Byte-for-byte identical to the delivered export; hashes in `export-manifest.json` |
| `node site/tests/browser.mjs` with external Playwright and axe modules | 98 checks passed across Chromium and WebKit, with the two explicitly recorded source-line contrast exceptions |
| `node site/tests/live-browser.mjs` | Four live Chromium checks passed: real preview/price, oracle wording, all-RPC failure, mismatch and wrong-chain blocking |
| `SWORN_BROWSER=webkit node site/tests/live-browser.mjs` | Live HTTPS transport failed in this isolated runtime with “WebKit encountered an internal error”; not counted as a live RPC pass |
| `node --import tsx tests/fork.mts` from the isolated site copy, with `SWORN_FORK_RPC=https://ethereum-rpc.publicnode.com` | Eight fork checks passed initially at block 26,217,852 and again after the eligibility guard at block 26,218,094 |
| `forge test --use /tmp/solc-0.8.24 --out /tmp/sworn-burn-tests --cache-path /tmp/sworn-burn-cache --match-path test/BurnRule.t.sol --offline --fuzz-runs 64` | 24 EVM burn-rule tests passed; 0 failed/skipped |
| Solidity integration example, solc 0.8.24 | Compiled successfully |
| `bash site/public/examples/read-registry.sh` | Both exact published calls ran against the Registry; returned false and 0 for the synthetic wallet |
| `python3 site/scripts/census.py` | One census produced 28,353 deposits, 19,522 FirstDeposit events and 19,522 distinct contributors; 66 rows |
| Pinned taste probe, `--out test/scratch/taste --offline` | 11/16 checks passed; five owner-approved design differences retained |

The production bundle has one Vite warning for a roughly 552 KB JavaScript chunk. The complete export is smaller than 1 MiB, includes its runtime assets and is comfortably within the submission budget. There were no missing local resources or page script errors in the final two-engine route matrix. External requests were limited to the three configured public RPC hosts; the browser did not call the attestation API or a CDN.

The supplied MCP browser launcher could not start because its expected Chrome distribution was absent. Standalone Playwright Chromium and WebKit were installed under `/tmp` instead. WebKit required isolated shared libraries and software EGL to render. It successfully ran the local UI and error-state checks; its separate live HTTPS failure remains a limitation. The first fork attempt reached the canonical swap/refund but was rate-limited by the first RPC operator; the full successful run used the second configured operator. No requester input was needed.

## Chain, transaction and data evidence

- `abi-verification.json`: the three launch ABI hashes, derived from the unchanged Solidity 0.8.24 source. `chain-verification.json`: matching deployed runtimes and read block.
- `fork-validation.json`: actual canonical Router swap, exact IMD receipt and ETH refund; exact approval; Registry mint and tokenURI; paid request with maxPrice; own-receipt community id; unminted public-contributor Renderer preview; sponsored claim; daily-limit explanation.
- The initial fork swap bought exactly 100,000,000,000,000,000 IMD units. Its maximum was 225,303,950,952,475 wei; actual input was 223,073,218,764,826 wei and 2,230,732,187,649 wei returned. These are one fork’s recorded observations, not a current quote.
- Frontend tests cover wrong chain, changed accounts, an aborted stale session, exact calldata and recipients, quote expiry, integer slippage rounding, failed and replaced receipts, cancellation, wallet rejection, unknown swap recovery after reload, missing approval, changed oracle price, failed/changed burn preview and the 69 IMD / 0.005 ETH boundaries. A receipt can advance only after successful account/calldata checks. Registration reads only its own SpecRegistered event.
- The original EVM suite verifies inclusive threshold/cap behavior, no fee below threshold, over-cap skips, failed preview/bridge refunds, successful surplus returns, forced refunds, fee shortfall rollback and reentry guards.
- `renderer-assets.json` records the two onchain pure Renderer inputs and SVG hashes. The logo’s token-number text is removed; the sample card is synthetic.
- `reference/anchors/hours.json` records one OR-topic census, endpoint provenance, raw-stream checksum and cross-checked closing block. Only aggregate rows are published.
- `reference/anchors/WhitelistCurator-excerpt.json` and the bundled copy retain exact source lines 4–62, API URL and full-source SHA-256. Both engines compared all 59 code strings to the reference, word for word.
- Lossless metadata tests use 9,007,199,254,740,993 and uint256 maximum. Bare JSON integer lexemes remain exact strings. Locale checks run with `de-DE` and live Chromium with `fr-FR`; numeric formatting is explicitly en-US.

## Better Interface coverage

The pinned contents/workflow and the core principles of all six domains were read and applied while building. The owner’s visual brief took precedence over conflicting house defaults.

| Domain | Coverage and evidence | Limits |
| --- | --- | --- |
| Accessibility | Native labelled forms, links and buttons; keyboard skip/focus; focusable table/code scrolling; named rarity marks; state/error announcements; axe on all eight pages in both engines | No native screen-reader session. Required faint source line numbers retain the documented contrast limitation. Axe incomplete results are retained in the JSON summary rather than treated as full compliance. |
| Layout | All routes at 320, 390, 780 and 1,280px in both engines; probe at 1,440px; zero page-width overflow; phone mint action; bounded table/source scrolling; fixed source gutter | No physical phone or native 200% browser zoom. English-only layout; RTL/localization variants were not requested. |
| Writing | Exact required copy; final family names; contract naming; source labels; costs and irreversible spending; not-claimed wording; recoverable pool, quote and wallet errors | External attestation availability and asynchronous verdicts were not certified. |
| Typography | Source/computed sizes, system monospace, tabular numerals, wrapping, readable code and sources; mobile field sizing; screenshot inspection | Platform font rendering may vary. No downloaded font was introduced. |
| Colors | Actual prescribed solid tokens; rendered probe/axe checks; computed ratios; evidence colors also named in text; mismatch state | Small source line numbers measure 3.43:1, below 4.5:1, and retain the brief’s exact color. |
| UI | Header active state, primary/outline controls, hover/focus/pressed/disabled states, blank/loading/RPC error, transaction states and recovery; no motion or decorative components | Real wallet-extension prompts and physical-device signing were not exercised. A local EIP-1193 test provider and a keyless fork covered the transaction path. |

Measured contrast against `#0a0a0a`: body `#d9e0da` 14.73:1; muted `#8c968e` 6.48:1; accent `#00ff41` 14.50:1; direct `#00cc33` 9.13:1; faint `#5f6861` 3.43:1; error `#ff7777` 7.69:1. The faint 24px step numbers meet the large-text threshold. The 12px source line numbers are an explicit remaining limitation, not an AA pass.

At 390 × 844, both engines measured the landing action’s bottom at 675.97px and the claim mint action’s bottom at 837.33px. The product and primary action are visible on the first screen. Final screenshots were inspected for the desktop intro/card/stats/three columns, mobile action/focus, live Explorer summary and verified-source presentation.

## Findings, corrections and rechecks

| Finding | Source location | Change and evidence |
| --- | --- | --- |
| Renderer image encoding was initially assumed to be Base64 | `site/scripts/render-assets.mjs:19`, `site/src/format.ts:17` | Decode the actual percent-encoded SVG image and accept the Renderer’s data URI. Final SVGs are valid, rendered in both engines and recorded by hash. |
| Oracle action literal had the wrong byte length | `site/src/config.ts:36` | Construct bytes32 with `stringToHex(..., {size:32})`. Live price reads returned 0.5 IMD and the real preview completed. |
| Rare-mark accessible labels lacked semantic roles | `site/src/pages.tsx:48` | Add `role="img"` beside the existing name. The Catalog axe finding is resolved in both engines. |
| Scrolling integration code was not keyboard focusable | `site/src/pages.tsx:131` | Give each pre a labelled region and tab stop. The scrollable-region axe finding is resolved in both engines. |
| A few source line numbers visually crowded the code | `site/src/styles.css:149` | Use flex rows with a fixed non-shrinking 48px gutter. Check every line’s bounds at every route-matrix width, then inspect the updated source screenshot. |
| Source anchor could scroll before the async table loaded | `site/src/pages.tsx:143` | Scroll after both bundled references load. The Catalog warning link reaches the source in both engines. |
| Persisted intent or stale sessions could otherwise advance a flow | `site/src/flow.ts:25`, `site/src/flow.ts:137`, `site/src/wallet.ts:39` | Validate exact fees against calldata, re-read previous receipts and invalidate the session with AbortSignal. Reload, unknown-swap, replacement, rejection and stale-estimate tests pass. |
| Funding could begin before discovering an existing card or request | `site/src/flow.ts:38` | Read mint, verified and pending eligibility before buying or approving IMD. Both new no-wallet-transaction tests and the final real-contract fork run pass. |
| Repeated code/getter checks amplified public RPC load | `site/src/chain.ts:26` | Cache only positive read-only integrity checks for 60 seconds; force a fresh check for every transaction. The complete snapshot still uses one stated block and discards any failed result. |
| Required source-line color is below small-text AA contrast | `site/src/styles.css:150` | Retained `#5f6861` as explicitly requested. Each engine records the color-contrast exception; it is not hidden or called an AA pass. |

The pinned taste probe’s five retained differences are casing, tracking, eyebrows, type-faces and copy-budget. The brief explicitly approves “monospace for all text including prose,” “tracked uppercase labels,” the supplied sizes and the complete landing copy. The probe passed render, layout, targets, contrast on the landing, type-sizes, glyphs, slogans, repetition, chrome, motion and share metadata. The source excerpt’s author punctuation remains intact.

## Completion and remaining limits

The source, static export, lockfile, complete required runtime assets, census, source excerpt, design document and rewritten README are delivered. Reversible local checks and repairs are complete for the recorded scope. The final byte/path audit is recorded in `submission-audit.json`.

The site was not published or redeployed by this worker. Mainnet reads were checked; transactions were confined to a local fork. Oracle callback delivery and a completed Base burn were not exercised end to end. Live WebKit HTTPS on this machine failed with an internal transport error, while its local rendering, navigation, forms, offline states and accessibility checks ran. Required faint source numbers remain a documented contrast limitation. These limits are distinct from the successful production build, typecheck, unit tests, fork execution and static export checks.
