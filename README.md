# Sworn · Indexer integration

This release keeps the Sworn site from [banse/sworn commit `f6e80c156946020d5eb411a22fbf9ff962615438`](https://github.com/banse/sworn/tree/f6e80c156946020d5eb411a22fbf9ff962615438/web) and adds the four requested indexer integrations. `web/` contains the source and unchanged dependency lockfile; repository-root `dist/` contains the production build for the existing **sworn** hosting name (`sworn.site.identitymd.eth`). The publisher serves that export after submission.

## Install, build and preview

Use Node **22.12 or newer** and npm 10 or newer:

```sh
cd web
npm ci
node scripts/agents.mjs
npm run typecheck
npm run build
npm run verify:export
npm run preview
```

Open the preview URL printed by Vite. `npm run dev` runs the source development server. The build verifies the pinned ABI/source inputs, writes `../dist/`, generates its asset manifest and checks the static release. The canonical `agents/sworn/SKILL.md` and `llms.txt` are included at the root because `scripts/agents.mjs` copies them into the export. Build configuration, dependencies, ABIs and data files are unchanged.

For a dependency-free preview of the delivered export, run this from the root:

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173/`. Relative entry assets (`base: './'`) and hash routes also work below a gateway subpath. No server rewrite or runtime script from another origin is required. Title, favicon, description, Open Graph title and local share image are included.

## Indexer reads and fallbacks

The only indexer base URL in application source is `INDEXER_BASE_URL` in [`web/src/indexer.mjs`](web/src/indexer.mjs), defaulting to `https://sworn.vibingco.de/api`. Change that constant and rebuild to use another indexer. Its [public API README](https://github.com/identity-md-launches/launch-2602-sworn-indexer-ponder-indexer) documents the response fields. Requests are read-only, omit credentials and abort after 1.5 seconds or when their caller is cancelled.

- Community eligibility (ids **10001 and above**) first reads `/rules/:id/eligibility?wallet=…`. A supported, fully indexed answer carries its count, threshold, comparison, verdict, coverage block and transfers into the existing advice. The text says `Source: indexer, block N`. Unavailable, unsupported, incomplete or malformed answers retain the original bounded browser scan and say `Source: chain scan`, including when the scan cannot finish. Catalog eligibility checks, including snapshots and the live checks for 601 and 1301, never call this endpoint.
- `/rules` supplies community metadata. Catalog and Mint Facts describe the event/function, wallet field, fixed filter, threshold and window in words, show complete addresses and the registrant, and reuse the existing `CommunityCard` hive. If the indexer is unavailable, `specOf` supplies the rule and `SpecRegistered` supplies attribution. A failed attribution read is explicitly shown as unavailable.
- `/wallets/:address` supplies request history and outcomes (`pending`, `verified`, `missed`, `noverdict`, `abandoned`) and the card. Fact Check and wallet request-history reads use it before scanning logs. Existing Registry reads still confirm held facts, frozen direct facts and card artwork. The original scan and its coverage/retry states remain available during an outage.

The existing **Show ineligible facts** disclosure still controls rows found not met; use it to inspect their counts. Eligibility remains advice, and the panel/Registry decide whether to store a fact. No transaction preparation or signing behavior was changed.

## Routes and source binding

| Route | Main interaction |
| --- | --- |
| `#/` | Explore a public wallet without connecting |
| `#/catalog` | Inspect catalog/community facts and the embedded Explorer |
| `#/mint` | Mint an optional card |
| `#/request` | Review held facts and request a new fact |
| `#/fact-check` | Follow requests and inspect saved fact history |
| `#/register` | Define an immutable community rule |
| `#/curator` | Filter candidates, export lists and check eligibility |
| `#/integrate`, `#/about` | Read contract and evidence documentation |
| `docs/index.html` | Bundled handbook and local search |

All existing aliases remain, including `#/explorer`, `#/wallet`, `#/wallet-facts`, `#/claim`, `#/oracle`, `#/fact-check-demo`, `#/fact-vs-artifact` and `#/whitelistcurator`. The imported app retains its **launch #2404** binding in `web/deployment-handoff.json`; this project's earlier launch #2147 contracts and records remain untouched. Nothing is deployed or retargeted on chain.

Wallet connections retain the pinned EIP-6963 browser discovery, wallet-browser mobile links and Coinbase connector. The production app contacts public Ethereum RPCs, `api.imd.fun`, IPFS gateways when needed, and the Sworn indexer. No private credential, relay account or added npm dependency is needed.

## Validation

```sh
cd web
npx playwright install chromium
npm test
node tests/indexer-browser.mjs
# Optional: a read-only mainnet transport, never a private key.
SWORN_TEST_RPC=https://ethereum-rpc.publicnode.com node tests/indexer-live-browser.mjs
```

Browser downloads and npm caches can be placed outside the repository with `PLAYWRIGHT_BROWSERS_PATH` and npm's `--cache` option. The browser tests serve the actual export below `/preview/`, use a read-only injected test wallet and reject signing/broadcast methods. Captured API replies under `web/tests/fixtures/indexer/` are test fixtures; the production app contains no fixture responses. `pinned-Catalog.sol` is the upstream catalog fixture used by the documentation test; the older root contract sources are preserved.

Worker results on 2026-10-27:

| Check | Actual result |
| --- | --- |
| Install, agent generation, typecheck, production build, export verification | Passed |
| Full unit suite | 284 passed, 0 failed |
| Production interaction suite | 6 scenario groups passed; all 17 routes/aliases at 1280 and 390px; no unexpected console/page errors or overflow |
| Live API + mainnet reads | Counts 5, 47 and 0 returned in about one second; card 2 wallet's four verified requests and saved details rendered |
| Pinned design probe | 14/16 passed; inherited monospace prose and uppercase headings retained under “no design change” |
| WebKit | Launch attempted; host libraries missing, so rendered WebKit checks were not performed |

The build emits inherited dependency `use client`, browser-externalized worker-module and bundler-timing warnings. Chromium showed no related runtime error. Deliberately aborted indexer requests produce expected browser network errors in the outage test; the fallback succeeds. No real account was signed with, no paid oracle request was created, and no mainnet transaction was sent.

[DESIGN.md](DESIGN.md) documents the final implementation. [artifacts/validation.md](artifacts/validation.md) records commands, findings, six-domain coverage and limitations. Current reports replace the earlier immutable-export reports. The old `tools/verify-sworn-v2.py` and `tools/validate-sworn-v2.mjs` are historical release tools; they do not define this patched release's checks.

## Project history and licenses

`site/` is the earlier frontend/redirect source; `src/`, `script/` and the Solidity tests are the older contract project. Existing dependency pointers and protected build files are preserved. Historical documentation remains in `CONCEPT.md`, `CATALOG.md`, `TEMPLATES.md`, `INTEGRATION.md`, `DISCLOSURE.md` and `reference/PROVENANCE.md`.

Project and third-party notices remain in `LICENSE` and `web/LICENSES/`. Better Interface and documentation-guide attribution are retained in `DESIGN.md` and `web/LICENSES/Better-Interface.txt`.
