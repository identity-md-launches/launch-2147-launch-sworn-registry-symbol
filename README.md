# Sworn

## Sworn: for judges

Sworn is an ownerless Ethereum-mainnet registry of verifiable facts about wallets, collection symbol **SWORN**. Its credential is `hasTrait(wallet, traitId)`; an ERC-721 card is a transferable display artifact whose facts remain attached to its claimant wallet. Direct facts are read live from WhitelistCurator.sol and Identity.md, while oracle facts require a Registry-verified IMD Oracle attestation.

**Use-funds warning.** This is a live mainnet integration, not an independent security audit. The delivery exercised transactions on a local mainnet fork, not through a real browser wallet; Oracle, Intake, BurnExecutor V2, bridge, public RPC and wallet dependencies can fail or change outside the ownerless Registry. An oracle request may spend IMD without becoming a trait. The supplied evidence says there is no attestation signed for this Registry yet, so the vector below proves oracle format/signature only, not a completed Sworn claim.

Two built-site issues remain: WhitelistCurator does not display the requested census-band/ETH totals, and Landing/About link to `@swornbyswarm` although the supplied project records do not establish control of that account. Documentation does not represent those as fixed.

| Hackathon criterion | Evidence |
| --- | --- |
| Launch record | [Launch PR](https://github.com/identity-md-launches/launch-2147-launch-sworn-registry-symbol/pull/1), source commit `b86d7aea5bd2d67e38c6868148168fabf3c83b3d` |
| Registry deployment | [Registry on Etherscan](https://etherscan.io/address/0x39bec7648259d5a128c29b24951eabcd4d1f95a6), [runtime/getter record](artifacts/chain-verification.json) |
| Public identity | The site links [@swornbyswarm](https://x.com/swornbyswarm), but that handle is **not vouched for** by the supplied records |
| Radar | No Radar entry or URL is present in this checkout; none is claimed as evidence |

### A live fact read

The first public contributor named in the fork tests has Spawned (101). This command returned `true` against PublicNode during this documentation pass:

```sh
cast call 0x39bec7648259d5a128c29b24951eabcd4d1f95a6 \
  'hasTrait(address,uint16)(bool)' \
  0x200e710acaa6a93bbc77146026328c40f1d60fb1 101 \
  --rpc-url https://ethereum-rpc.publicnode.com
# true
```

### Attestation format check

This [served oracle attestation](https://api.imd.fun/oracle/requests/91782ffa-316d-4ea9-853c-f18b8352e068/attestation) has UUID `91782ffa-316d-4ea9-853c-f18b8352e068`, derived from the first 16 bytes of its `oracleRequestId`. It predates Sworn. The served fixture spells typed `uint8` as `"bool"`, so this fresh-clone command normalizes just that representation before checking it against the configured attester:

```sh
tmp=$(mktemp)
sed 's/"answerType": "bool"/"answerType": 0/' \
  reference/attestations/2026-10-11-nonce-true.json > "$tmp"
cast wallet verify --address 0x5598aa9146215bc13eb26f2c692ad1461fd32982 \
  --data --from-file "$tmp" \
  0x8eeb0914ad4737db829200a167532b234e885b042a463fe1448128c01113a81a62cf5cf525efe4b2168e007769abd3a4ab43f9cb4c410bdc771fd67e355c2bb61c
# Validation succeeded. Address 0x5598Aa9146215Bc13eb26f2c692Ad1461Fd32982 signed this message.
```

### Renderer golden cards

The following regular SVGs are decoded Renderer golden outputs, not screenshots or private-wallet data.

| Golden | SVG |
| --- | --- |
| Synthetic full house | [synthetic_fullhouse.svg](docs/cards/synthetic_fullhouse.svg) |
| Synthetic honey | [synthetic_honey.svg](docs/cards/synthetic_honey.svg) |
| Synthetic collector | [synthetic_collector.svg](docs/cards/synthetic_collector.svg) |

### Entrant disclosure

The existing disclosure says the entrant operates IMD seats IDMD #420, #3 and #7, and that the seats/wallets abstain from sponsor-pool upgrades and showcases. This checkout does **not** provide seat URLs, proof that those seats did not work on jobs before launch, a site-job record naming them, or a recusal request to the organiser. The supplied public links are the [launch record](https://github.com/identity-md-launches/launch-2147-launch-sworn-registry-symbol/pull/1) and [job-record index](https://github.com/identity-md-launches/launch-2147-launch-sworn-registry-symbol/pulls). This is an incomplete disclosure, not evidence that the missing records or recusal exist.

## What this project is

This repository contains Solidity source for the deployed Registry, Composer and Renderer and a static React/TypeScript site in [site/](site/). Its intended URL is [sworn.site.identitymd.eth.limo](https://sworn.site.identitymd.eth.limo/); the checked-in static export is [dist/](dist/). The site uses hash routes and needs no server rewrite rule.

| Contract | Address |
| --- | --- |
| Registry | `0x39bec7648259d5a128c29b24951eabcd4d1f95a6` |
| Composer | `0x06bf2168dd115fa37bd1637fa1f50adb29a3029d` |
| Renderer | `0xea9185cc6dffe42a8c059b099c50cb21021439ad` |
| WhitelistCurator.sol | `0xcB0b0531e86A9aC36Fa865cA8e3dbccF047FDA91` |
| Identity.md / IDMD | `0x0000eC93127BAA929E58E97dd0095A2BFb38ec1D` |
| IMD | `0xD34a99Bc0f67aE1bbd63C660e6d0b0dd03E263B7` |
| Intake v2 | `0xa43e6f75ee006411f79ac1c84120606c2330de82` |
| Attester | `0x5598aa9146215bc13eb26f2c692ad1461fd32982` |
| BurnExecutor V2 | `0xe29386719C155B6847aD5a4E97C6674f10ffc750` |

The frozen families are Spawned, Zero-Shot, Hopper, Bullfrog, Benchmarked, Armed, Uptime, Holdout, Final Token, Hotfix, PID, Top Weights and Pretrained. [CATALOG.md](CATALOG.md) holds the 25 ids and rules. SWORN is a card collection symbol, not a new coin; fees use IMD.

## Build, test, and serve

Use Node.js 22.12+ and npm. From a fresh clone, run the development server:

```sh
git clone https://github.com/identity-md-launches/launch-2147-launch-sworn-registry-symbol.git sworn
cd sworn/site
npm ci
npm run dev
```

To check and serve a production build:

```sh
cd sworn/site
npm ci
npm run typecheck
npm test
npm run check:abi
npm run build
npm run preview
```

`npm run build` writes `../dist/`. Serve that complete directory. Routes look like `#/explorer?address=0x…`, so no fallback route is needed. Every script/image is bundled; the browser has no API key, analytics, CDN or request to `api.imd.fun`. It tries public RPCs in order—MEV Blocker, PublicNode, Thirdweb—and shows **RPC unavailable** instead of fabricating a read.

[artifacts/validation.md](artifacts/validation.md) reports the worker’s 27 frontend tests, 98 browser checks, local-fork transaction flow, and 24 burn-rule EVM tests. It is not independent certification. No separate fuzz report is supplied; its 64 fuzz runs and source-suite notes are reported in [test/NOTES.md](test/NOTES.md). The launch audit result here is the matching runtime/getter record in [artifacts/chain-verification.json](artifacts/chain-verification.json), not a third-party audit.

## Use the site

Read-only routes need no wallet. Claim actions require an injected EIP-1193 wallet on Ethereum mainnet and a positive runtime/dependency check; a mismatch becomes a red banner and blocks signing.

| Route | What it does | Permission and failure mode |
| --- | --- | --- |
| `#/` | Introduction and address lookup. | Public; incomplete address is rejected. |
| `#/catalog` | 25 facts, families, evidence classes and windows. | Public/static; frozen populations are not live counts. |
| `#/explorer?address=0x…` | Reads 25 facts, Curator/IDMD values, card, pending/verified facts and Renderer preview. | Any valid address, no wallet. RPC failure clears data and offers retry; no proof is not a negative verdict. |
| `#/claim` | Mint, paid/sponsored requests, community registration, shared facts, and exact-IMD ETH purchase. | Mainnet wallet and integrity check required. Rejection, stale price/quote, wrong account/chain, failed receipt, failed RPC, eligibility check or contract revert stops the flow; no unresolved transaction is resent automatically. |
| `#/fact-vs-artifact` | Credential/card comparison and verification guide. | Public/static, no write. |
| `#/integrate` | Solidity/cast examples and checked addresses. | Public/static; an unavailable browser RPC is not a deployment certification. |
| `#/whitelistcurator` | Bundled 66-hour census and source excerpt. | Public/local JSON. Its bands are `00–23`, `24–64`, `65`, not the required census-band presentation, and lack ETH totals. |
| `#/about` | Ownerlessness, limits and public links. | Public/static; its X link is not established by the project records. |

Only transaction intent and hashes are retained in tab-scoped session storage for reload recovery. No wallet identity, connection, key, or signature is persisted.

## Registry public entry points

All listed reads are callable by anyone. The standard ERC-721 surface—`name`, `symbol`, `balanceOf`, `ownerOf`, approvals, transfers and `supportsInterface`—also applies with normal ERC-721 authorization/receiver failures. Card ownership is never a credential.

| Entry point(s) | Caller | Behavior and failure modes |
| --- | --- | --- |
| `hasTrait`, `traitsOf`, `tokenOf`, `claimantOf`, `mintedAtBlock`, `verified`, `verifiedSpecsOf`, `traitClass`, `traitName`, `specOf`, `pendingOf`, `pendingRequest`, `sharedPending`, `sharedFact`, `pool`, `poolUsed`, `idmdSponsored`, `lastPoolDay`, `nextSpecId`, `deployedAt`, `burnExecutor`, dependency getters/constants | Anyone, view | Inspect state. Unknown trait/absent mapping reads return false or default data; `hasTrait(address(0), id)` is false. |
| `tokenURI`, `cardOf` | Anyone, view | Read/render a card; unknown token reverts `NoCard`. Parse metadata `fixedVal` and `threshold` as exact integers: bare JSON numbers can exceed 2^53. |
| `composeBody`, `questionHashOf`, `attestationDigest` | Anyone, view/pure | Preview request/digests. Invalid/non-oracle ids can revert when composing. |
| `mintCard()` | Caller, once | Pulls 0.10 IMD and mints a card. Reverts `AlreadyMinted` or on failed IMD allowance/balance. Direct facts do not need a mint. |
| `upgrade(ids,maxPrice)` | Caller pays | Requests eligible chain ids, 1301, or community kinds 1/2/4/5. Reverts for no/direct/unknown/shared ids, duplicate/pending/verified facts, price above max, or failed IMD transfer. Price is spent even if the answer later fails. |
| `requestSharedFact(factId,maxPrice)` | Anyone pays | Starts one T3 fact request. Reverts for non-T3, stored/pending fact, excessive price, or IMD transfer failure. |
| `applySharedFact(factId,list)` | Caller | Marks caller if exact list hash contains them in the eligible head. Reverts for missing/wrong list, already-verified caller, or absence from list. |
| `registerSpec(spec)` | Anyone pays | Validates/stores immutable spec at ids from 10001 for `SPEC_FEE` = 6.4 IMD. Reverts if Composer validation or IMD transfer fails. First claim is separate: 6.9 IMD at the observed 0.5 IMD request price, plus gas. |
| `sponsor(amount)` | Anyone | Donates IMD to an irreversible pool; failed allowance/transfer reverts. |
| `claimSponsored(traitId)` | Curator member | Pool request for eligible caller trait. Reverts for membership, trait, used/pending/verified, daily-limit, pool, or burn fee/refund failures. Submitted requests retain allowance use after a miss/abandonment. |
| `upgradeSponsored(idmdTokenId,ids)` | IDMD holder who is a Curator member | One pool trait via a token seat. Reverts for empty/multiple ids, non-holder/member, exhausted nine-request seat, normal pool limits, or burn fee/refund failure. |
| `abandon(requestId)` | Claimant after 14 days; anyone for shared request | Clears a pending request; reverts `NotPending`, `TooEarly`, or `NotClaimant`. It never returns payment/allowance. A contract claimant needs an authorized route to call `abandon` itself, never an unrestricted forwarder. |
| `onResult`, `onFailure` | Intake v2 only | Callback functions; other senders revert `NotIntake`. Bad-but-decodable evidence is recorded as miss/no-verdict, not a trait. |

### Composer and Renderer public functions

Both helper contracts are view/pure-only and callable by anyone; neither has a wallet action or owner permission. Composer exposes `catalogSpec`, `hasDirectTrait`, `traitsOf`, `traitName`, `answerTypeOf`, `panelOf`, `mainnetHeightBound`, `compose`, and `validateSpec`. They respectively expose frozen catalog rules, live direct predicates, trait/name/class helpers, the off-mainnet height bound, a canonical request body, and spec validation; invalid ids/spec fields make the relevant catalog/validation call revert. Renderer exposes `template`, `offsets`, `tokenURI(Card)`, `preimage(Card)`, `image(Card)`, and `escapeJson`. They return the fixed rendering material or render supplied Card data; malformed caller-supplied Card/spec data can make an encode/render call revert or yield only the values supplied. The Registry uses these helpers, but no helper grants a caller permission to change Registry state.

### Sponsored burn behavior

Sponsored requests are created before the best-effort burn. A preview that itself reverts emits `BurnSkipped(claimant, 1)`. An exhausted inner quote is caught by BurnExecutor V2 and answers `(0,0,0)`; Registry treats that as below 69 IMD, skipping fee and burn **without an event**. A quote above the 0.005 ETH cap emits code 3; a bridge failure, including a bridge-time quote above the attachment, emits code 2 and returns ETH. On success the executor keeps only its own quote and returns the rest. `BurnTriggered` records source-chain submission, not completed Base delivery.

## How to verify a card

1. Read `claimantOf(tokenId)`, `tokenOf(wallet)`, `hasTrait(wallet, traitId)`, and `verified(claimant, traitId)`. A zero request id means no accepted proof, not false. Decode Base64 tokenURI JSON losslessly: `fixedVal` and `threshold` can exceed 2^53. For a no-card wallet, build the documented Card input and call `Renderer.tokenURI(Card)`.

2. Rerun the exact recipe/window from [CATALOG.md](CATALOG.md) and [TEMPLATES.md](TEMPLATES.md) against two public RPCs. T1 counts logs; T2 sums; T3 groups/sums/ranks with ascending-address tiebreaks; T4 compares a historical call; T5 reads historic nonce. Check the closing block hash, shared-list hash/length/order, `hasJoined` before a first hour, and that `contributedBy` is a largest single send.

3. Format the first 16 bytes of an `oracleRequestId` as a UUID and open `https://api.imd.fun/oracle/requests/<uuid>/attestation`. Check canonical question hash (not whole body), answer/window/hash, issued/expiry, panel values, and EIP-712 signer `0x5598aa9146215bc13eb26f2c692ad1461fd32982` under IdentityMD Oracle v2, chain 1, this Registry. Metadata `minPanelSize`/ `minQuorum` are acceptance minima, not signed panel counts.

4. Rebuild Solidity 0.8.24 with unchanged Foundry settings, byte-compare Registry/Composer/Renderer runtime, then compare all eight dependency getters with [site/addresses.json](site/addresses.json) and [the launch record](site/public/data/launch-record.json).

## Design and references

[DESIGN.md](DESIGN.md) is consistent with the built site: system monospace text, thin rules, dense tables, local assets, square controls, responsive table scrolling, and the documented faint-source contrast exception. This README does not claim to repair the site audit findings above.

Read [INTEGRATION.md](INTEGRATION.md) for Intake/attestation protocol, [CONCEPT.md](CONCEPT.md) for rationale, [DISCLOSURE.md](DISCLOSURE.md) for the existing entrant disclosure, and [reference/PROVENANCE.md](reference/PROVENANCE.md) for evidence provenance.
