# Sworn

Sworn is an ownerless registry on Ethereum mainnet, collection symbol **SWORN**. It records facts about wallets; its transferable ERC-721 card displays the claimant’s facts. **`hasTrait(wallet, traitId)` is the credential, never `ownerOf`.** A wallet needs no card to have a fact.

The public site is prepared for [sworn.site.identitymd.eth.limo](https://sworn.site.identitymd.eth.limo/). Its complete static export is in [dist/](dist/), with React/TypeScript source, a package manifest and a pinned lockfile in [site/](site/). Hash routing and relative asset paths work at an IPFS gateway subpath. No publishing or onchain deployment is part of this change.

## Run and rebuild the site

Use Node.js 22.12 or newer and npm. From the repository root:

```sh
cd site
npm ci
npm run dev
```

Vite prints the local development URL. To check, rebuild and preview the production export:

```sh
npm run typecheck
npm test
npm run check:abi
npm run build
npm run preview
```

`build` writes the repository-root `dist/`, including its images, JSON references and examples. `preview` serves that export. A normal static file server can serve `dist/` directly; application routes are fragments such as `#/catalog` and `#/explorer?address=…`, so no rewrite server is needed. Keep the entire export together.

The frontend uses React, Vite, TypeScript, viem and lossless-json. It bundles every script and image and uses system monospace fonts. It has no server, API key, analytics, CDN or browser request to `api.imd.fun`. Attestations are ordinary links that visitors open themselves. Public RPCs are selectable in the footer: `rpc.mevblocker.io` by default, then `ethereum-rpc.publicnode.com` and `1.rpc.thirdweb.com`. Failed reads rotate operators and end in **RPC unavailable**, with no fabricated result.

Build dependencies and browser tooling used for this delivery were installed under `/tmp`; no dependency directory, cache or registry archive is submitted. The original Foundry configuration, dependencies and lockfiles are unchanged.

## The eight pages

| Route | Contents |
| --- | --- |
| `#/` | Exact introduction, wallet lookup, four sourced figures, Renderer sample, procedure, purpose and contributor links |
| `#/catalog` | The 25 frozen ids by their 13 final family names, rules, populations, evidence classes and block windows |
| `#/explorer` | Wallet-less reads of all 25 `hasTrait` values, community ids, card id, Curator getters and IDMD balance; a card or pure Renderer preview |
| `#/claim` | Separate card mint, four trait procedures, sponsored claims, paid upgrades, shared facts, community registration and optional ETH payment |
| `#/fact-vs-artifact` | Fact/card comparison, attestation limits and the four verification steps below |
| `#/integrate` | Credential integration, compiled Solidity and executable cast examples, addresses and dependency verification |
| `#/whitelistcurator` | Hour bands, deposit chart, all 66 hours and verified source lines 4–62 |
| `#/about` | Why Sworn exists, ownerlessness, no coin, MIT and public work links |

The families are Spawned, Zero-Shot, Hopper, Bullfrog, Benchmarked, Armed, Uptime, Holdout, Final Token, Hotfix, PID, Top Weights and Pretrained. Catalog ids are `family × 100 + tier`; community ids begin at 10,001. Lower tiers remain true. PID ids are independent facts and its displayed slot uses the lowest verified id.

WhitelistCurator.sol aimed to make an onchain allowlist that other contracts could read directly. Sworn builds on that frozen record. WhitelistCurator.sol is not sybil-resistant by design; its own source comment is reproduced without rewriting. SWORN is the card collection’s symbol, not a new coin. Fees use the existing IMD token.

## Mainnet deployment and evidence

| Contract | Address |
| --- | --- |
| Registry | `0x39bec7648259d5a128c29b24951eabcd4d1f95a6` |
| Composer | `0x06bf2168dd115fa37bd1637fa1f50adb29a3029d` |
| Renderer | `0xea9185cc6dffe42a8c059b099c50cb21021439ad` |

[site/addresses.json](site/addresses.json) contains every protocol dependency, the canonical Universal Router, v4 Quoter, PoolManager, Permit2 and the verified IMD/ETH CappedBurnHook PoolKey. Native ETH’s zero currency and a T5 spec’s required zero target are protocol encodings, not placeholder recipients. Wallet examples are the synthetic `0x000000000000000000000000000000000000c1a1` and the three public contributors named in the fork tests.

The [launch record](site/public/data/launch-record.json) pins source commit `b86d7aea5bd2d67e38c6868148168fabf3c83b3d`. All three frontend ABIs were derived with the unchanged Solidity 0.8.24 build and match its canonical Keccak hashes. [Chain verification](artifacts/chain-verification.json) records matching deployed runtime hashes. The site reads `curator()`, `imd()`, `intake()` and the other five dependency getters and compares all three runtime hashes. A mismatch displays a red banner and blocks transactions. Read-only integrity checks may reuse a positive result for 60 seconds; each transaction forces a fresh check.

[reference/anchors/hours.json](reference/anchors/hours.json) contains the single `eth_getLogs` census of Deposited and FirstDeposit over W_LIFE: **28,353 deposits and 19,522 contributors**. Logs were fetched together with an OR topic filter in disjoint adaptive chunks. The closing block hash was checked through two operators. The site bundles the same data and the verbatim Blockscout v2 source excerpt. Contributor counts per hour are distinct within that hour and must not be summed across hours.

The [Renderer asset record](artifacts/renderer-assets.json) identifies both committed SVGs and their exact Card inputs. The logo comes from the requested full-house card with communityCount 8,192, with only the token-number text removed. The landing card is the specified synthetic preview, not a private wallet.

## Claims, payment and recovery

Minting costs **0.10 IMD**, once per claimant wallet, with no claims needed. Direct facts need no transaction. Armed 601 is true while the wallet holds an Identity.md, independently of Curator membership.

The pool pays for one catalog chain request per Curator wallet per UTC day, once per trait and at most nine per wallet over its lifetime. Identity.md holders who are also Curator members can use their token’s seat through `upgradeSponsored`; a token has nine lifetime requests, including across transfers, and shares the wallet’s daily and per-trait limits. Reverted calls consume no allowance. Submitted requests retain their usage after a miss, no verdict or abandonment.

Paid upgrades take catalog chain ids, 1301 and community kinds 1, 2, 4 and 5. They cost `k × priceOf`, spent whatever the answer, with the reviewed price supplied as `maxPrice`. Top Weights and other kind-3 specs use one paid `requestSharedFact`, followed by each eligible wallet’s gas-only `applySharedFact` with the exact attested list.

A community trait costs 6.9 IMD: 0.5 for your first claim and 6.4 IMD paid forward into the pool by registerSpec(). The first claim is separate and uses the current live oracle price; 0.5 IMD was the read price during validation. Registration’s id is extracted from that transaction’s own `SpecRegistered(traitId, registrant)` log, never predicted.

IMD remains the default payment path. On the claim page only, an injected EIP-1193 wallet can instead buy the exact required IMD with ETH. EIP-6963 discovery lists multiple installed browser providers. Phones can open the site in a wallet’s browser. Only Ethereum mainnet is accepted; connections are not persisted.

The ETH path quotes exact output through the canonical v4 Quoter, refreshes every 15 seconds, caps input at 1% slippage and encodes a 120-second deadline. One Universal Router execution swaps through the pinned CappedBurnHook pool, takes exactly the IMD amount to the connected account and sweeps unused ETH to the same account. Before funding, the site checks for an existing card, an already-verified fact or a pending request. Then the wallet approves exactly the required IMD to the Registry and confirms the Registry call. Each step checks its preceding receipt, account, chain and calldata. A failed quote offers a plain Uniswap link.

Sponsored calls read BurnExecutor V2’s `previewBridge()` live. Below 69 IMD, no ETH is attached. At or above 69 IMD, exactly the quoted LayerZero fee is attached when it is at most 0.005 ETH; above the cap no fee is attached. A changed quote stops for review; an unavailable preview never supplies a guessed fee. The Registry’s best-effort bridge behavior, refund paths and source-chain events remain as deployed. A bridge submission does not prove completed Base delivery.

Only this tab’s transaction intent and hashes are kept in session storage for reload recovery. No wallet identity, connection, key or signature is stored. Reconnect and check receipts after reloading. An unresolved broadcast is never automatically resent; a missing hash can be recovered from wallet activity. Rejections, pending receipts, replacements, cancellations and onchain failures have separate states. Account or chain changes invalidate stale work.

## How to verify a card

1. **Read the Registry.** Read `claimantOf(tokenId)`, `tokenOf(wallet)`, `hasTrait(wallet, traitId)` and `verified(claimant, traitId)`. A zero verified request id means no accepted proof, not a negative verdict. Decode tokenURI’s Base64 JSON without converting its bare integer recipe fields to floating point. `fixedVal` and `threshold` may exceed 2^53. The oracle array contains the recipe, block bounds, minimum panel/quorum and both request ids. `composeBody` returns the exact request body and question hash. Community metadata displays the first 32 verified specs while retaining the full community count. For an unminted wallet, the site builds the documented Card input and calls the pure Renderer.

2. **Rerun the recipe against two public RPCs.** Use the stored item and exact block window from [CATALOG.md](CATALOG.md) and [TEMPLATES.md](TEMPLATES.md). Derive topic0 from the canonical event signature and place indexed arguments in their declared topic positions. T1 counts matching logs; T2 sums its named field; T3 groups by the named key, sums and ranks descending, breaking ties by ascending address. Verify a shared answer against `keccak256(abi.encode(address[]))` and the stored length. T4 compares a historical call; T5 reads the account’s historical nonce, with threshold 20 for 1301. Confirm the closing block hash. Direct facts read Curator getters or IDMD balance live: check `hasJoined` before interpreting firstHour, and treat contributedBy as the largest single send, not a sum.

3. **Check the attestation.** Format the first 16 bytes of oracleRequestId as an `8-4-4-4-12` UUID and open `https://api.imd.fun/oracle/requests/<uuid>/attestation`. Check the question hash against the canonical question document, not the entire request body. Check the answer type, answer, block bounds/hash, issue time, expiry and signed panel values. Require `agreed >= quorum`, the Registry’s acceptance minima and the EIP-712 signer `0x5598aa9146215bc13eb26f2c692ad1461fd32982` under domain name `IdentityMD Oracle`, version `2`, chain id `1` and the deployed Registry as verifyingContract. `attestationDigest` and [INTEGRATION.md](INTEGRATION.md) describe the exact binding. The metadata’s minPanelSize/minQuorum are acceptance minima, not the actual signed panel values. A signature proves acceptance of an answer under these rules, not sybil resistance or future behavior.

4. **Compare deployed code with a rebuild.** Rebuild the reviewed launch source using the unchanged `foundry.toml`: Solidity 0.8.24, optimizer 200, Cancun, no metadata hash or CBOR. Compare `eth_getCode` byte for byte with the Registry, Composer and Renderer deployedBytecode outputs. There are no immutables to patch. Read all eight dependency getters and compare them with the launch record and addresses.json. The site performs these runtime/getter checks before signing. Card ownership can change; its claimant and the meaning of `hasTrait` do not transfer with it.

## Validation performed

The worker ran the production build, TypeScript check, **27 frontend unit/state tests**, ABI/hash verification and a clean `npm ci` rebuild. The clean export matches the delivered export byte for byte. The export has **13 files, 680,066 bytes**; [the manifest](artifacts/export-manifest.json) lists their hashes.

Chromium and WebKit exercised all eight routes at 320, 390, 780 and 1,280px, navigation, input errors, keyboard skip/focus, phone actions, payment selection, reload recovery, offline behavior, source text equality and local resources. The **98 checks passed with the prescribed source-line contrast exception retained**. Both first-screen actions were visible at 390 × 844. Live Chromium reads confirmed a public contributor’s 25 facts, 13-family summary, unminted Renderer preview, live price, honest RPC failure and mismatch/wrong-chain blocking.

A local mainnet fork exercised the actual canonical exact-output swap and ETH refund, exact approval, card mint and Registry.tokenURI, paid request, spec registration id from its receipt, pure preview and sponsored daily limit. No transaction left the fork. The unchanged contract’s **24 burn-rule EVM tests passed**, including boundary fees, failed preview/bridge, surplus refunds and reentry guards.

The pinned taste probe ran on the export at 320, 390 and 1,440px: **11/16 checks passed**. Its five objections concern the owner-approved uppercase/tracked labels, monospace prose and complete landing copy. Those choices remain. Accessibility review fixed rare-mark roles and keyboard access to code scrolling. The required source line numbers remain `#5f6861`, measured at **3.43:1** against the background at 12px; this is recorded rather than called an AA pass.

[artifacts/validation.md](artifacts/validation.md) records commands, six-domain coverage, findings, screenshots and limitations. [DESIGN.md](DESIGN.md) documents the final implementation. These are worker-side checks, not independent certification. Native screen-reader sessions, physical phones, native browser zoom, a real wallet extension signing on mainnet and completed oracle/Base delivery were not tested. WebKit rendered and exercised the interface, but this machine’s isolated WebKit HTTPS transport returned an internal error for live RPC access; live browser RPC success was verified in Chromium.

## Contract development and references

The existing Solidity project is unchanged. With its existing dependencies available:

```sh
forge build
forge test
python3 tools/gen_template.py --check
```

The standalone [Solidity integration example](site/public/examples/SwornGate.sol) compiled with solc 0.8.24. Both [cast examples](site/public/examples/read-registry.sh) ran against the deployed Registry and returned false and 0 for the synthetic wallet at the checked block.

To regenerate the historical census, use Python 3 with requests and Foundry’s cast, then run `python3 site/scripts/census.py` from the repository root. It asserts the frozen totals before writing either copy. From `site/`, `node scripts/render-assets.mjs` reproduces the two pure Renderer SVGs using public RPCs. Neither operation deploys a contract or needs a key.

Read [CONCEPT.md](CONCEPT.md), [CATALOG.md](CATALOG.md), [TEMPLATES.md](TEMPLATES.md), [INTEGRATION.md](INTEGRATION.md), [DISCLOSURE.md](DISCLOSURE.md) and [reference/PROVENANCE.md](reference/PROVENANCE.md) for the protocol and evidence. Public work: [repository](https://github.com/identity-md-launches/launch-2147-launch-sworn-registry-symbol), [launch record](https://github.com/identity-md-launches/launch-2147-launch-sworn-registry-symbol/pull/1), [job records](https://github.com/identity-md-launches/launch-2147-launch-sworn-registry-symbol/pulls), [imd.fun](https://imd.fun), [IMD agents](https://imd.fun/docs) and [@swornbyswarm](https://x.com/swornbyswarm).

Sworn is MIT licensed; see [LICENSE](LICENSE). Design-guide attribution and its preserved license notices are in DESIGN.md and `site/LICENSES/Better-Interface.txt`.
