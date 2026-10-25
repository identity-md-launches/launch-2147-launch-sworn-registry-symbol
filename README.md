# Sworn · version 2

The static site under the existing name **sworn** now serves the version 2 app from [banse/sworn](https://github.com/banse/sworn/tree/f4e16276a954f0c9c7327733ba6adee298279fa6), commit `f4e16276a954f0c9c7327733ba6adee298279fa6`. The previous redirect to `swornbyswarm.sites.imd.fun` is replaced by the app itself.

**Release policy:** `dist/` is the upstream production export, copied unchanged: **85 files, 2,305,898 bytes**. No production build was run for this delivery. Serve this directory directly. Its title, branding, ABIs, deployment metadata, documentation, agent files, snapshots, images and JavaScript are the pinned upstream bytes.

## Preview the delivered site

From the repository root, without installing dependencies or rebuilding:

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173/`. The entry assets use `./` URLs, and the app uses hash routes. The export also passed checks served under `/preview/`, as required for gateway subpaths. A static host needs no application route rewrite or backend.

The publication system consumes `dist/` under the existing `sworn.site.identitymd.eth` name after submission. This delivery does not invoke a hosting or blockchain deployment command.

## Source and installation

| Path | Contents |
| --- | --- |
| `dist/` | Exactly the 85-file pinned export; this is the hosting payload |
| `web/` | Pinned React/TypeScript source, public assets, scripts, tests, package manifest and lockfile |
| `site/` | Preserved earlier frontend and redirect source; not the source of the current export |
| `src/`, `script/`, `test/` | Preserved Solidity project for the earlier launch |
| `tools/verify-sworn-v2.py` | Dependency-free export/source integrity verification |
| `tools/validate-sworn-v2.mjs` | Read-only Chromium interaction and responsive checks |
| `artifacts/validation.md` | This delivery's results, design review and limitations |
| `DESIGN.md` | Tokens, components and responsive behavior of version 2 |

All 227 included `web/` files match the pinned commit. Only upstream `web/.gitignore` is omitted; existing ignore rules already exclude `node_modules/` at every level. No existing build configuration, dependency manifest or lockfile was changed. The added `web/package.json` and `web/package-lock.json` are the original upstream frontend files.

For source work, use Node.js 24 and npm:

```sh
cd web
npm ci
npm run typecheck
npm run dev
```

The lockfile pins React 19.3.1, Vite 8.3.5, TypeScript 7.0.2, viem 2.57.7 and wagmi 3.7.9, alongside Coinbase Wallet and React Query. Dependencies are installed normally; no dependency archives, caches or installed modules are part of this delivery.

## Rebuilding for future source changes

This is the upstream rebuild recipe for a future development release. **It was not run for this immutable import.** A rebuild replaces `dist/` and should not be used to recreate this pinned release for publication.

```sh
cd web
npm ci
npm run typecheck
npm run build
npm run preview
```

The build verifies pinned source inputs and ABI hashes, runs Vite with `base: './'`, writes `../dist/`, creates its deployment manifest and checks the static release. Rebuilding is documented, not certified here as byte-reproducible across runtimes. For this release, restore the upstream `dist/` from the exact commit instead of regenerating it.

## What the app does

Sworn is an ownerless Ethereum mainnet registry of wallet facts. A fact belongs to its original wallet; the optional ERC-721 card displays that record and can be transferred separately. The homepage's main action is **Explore wallet**, which works without connecting a wallet.

| Route | Main interaction |
| --- | --- |
| `#/` | Enter an Ethereum address and explore its record |
| `#/catalog` | Read the 25 facts, evidence classes and embedded Explorer |
| `#/explorer?address=…` | Inspect a wallet, card, fact families and exact Renderer metadata |
| `#/mint` | Mint an optional card through the visitor's wallet |
| `#/request` | Request or apply facts; follow verification progress |
| `#/register` | Define an immutable community rule |
| `#/wallet` | Read a connected wallet's facts and request history |
| `#/curator` | Filter historical candidates, export lists and check current eligibility |
| `#/integrate`, `#/about` | Contract integration, evidence and background |
| `docs/index.html` | Bundled handbook with local search |

Legacy hash bookmarks are handled inside the app. Unknown routes offer a return link.

The browser reads mainnet through the supplied public RPC pool, `api.imd.fun`, and IPFS gateways. Required static assets are bundled locally. These external services, wallet providers and network access are still needed for their respective live interactions. No backend, API key or relay project ID is required by this export.

The app preserves the **launch #2404** deployment recorded in [web/deployment-handoff.json](web/deployment-handoff.json) and [dist/imd-deployment.json](dist/imd-deployment.json). The older launch #2147 Solidity source and its evidence remain in the repository as history. This import neither retargets the upstream app to that older registry nor changes any contract. The read-only browser check validated the version 2 deployment against mainnet before loading a real wallet's card and facts.

Wallet discovery uses EIP-6963 and Coinbase Wallet. On phones, the picker offers links to supported wallets' own browsers. Signing actions depend on the visitor's wallet and a valid mainnet deployment check. This worker did not connect an account, sign or broadcast a transaction.

## Verification

Verify the committed payload without dependencies:

```sh
python3 tools/verify-sworn-v2.py
```

For an independent byte comparison, download the [pinned archive](https://codeload.github.com/banse/sworn/tar.gz/f4e16276a954f0c9c7327733ba6adee298279fa6) outside this repository and pass its path with `--archive`. During this delivery, all export and included source Git blob hashes were also compared with GitHub's recursive tree API for that commit.

Run the delivered interaction checker after installing source dependencies and Chromium:

```sh
cd web
npx playwright install chromium
cd ..
node tools/validate-sworn-v2.mjs
```

Its output goes into `test/scratch/v2-browser/`. It serves the committed export itself, including a gateway-style subpath, and does not build. `SWORN_TEST_RPC` optionally selects a read-only verification transport while the exported public RPC configuration stays unchanged. `SWORN_PLAYWRIGHT_MODULE` optionally selects an externally installed Playwright module.

Actual results for this delivery:

| Check | Result |
| --- | --- |
| Upstream export and source hashes | All 85 export files and 227 included source files match |
| Clean locked installation in a temporary copy | Passed, using `npm ci --ignore-scripts --no-audit --no-fund` |
| `npm run typecheck` | Passed, exit 0 |
| 28 upstream unit-test files | 189 tests passed, 0 failed |
| Source pin / canonical ABI verification | Passed for Renderer, Composer and Registry |
| `node scripts/manifest.mjs --check` | Passed; all 84 manifest-listed assets match |
| `node scripts/static-release.mjs` | Passed; relative assets and no fixture transport |
| Delivered interaction checker | 49 checks passed, 0 failed |
| Responsive layout | Nine routes checked at 320, 390, 780 and 1440px; no page overflow |
| First screen at 390 × 844 | Product, field and primary button visible; button ends at 499.39px |
| Pinned `taste@1` probe | 14/16 checks passed; retained upstream casing and monospace exceptions |
| axe accessibility scan | Seven routes checked; inline-link distinction findings remain |
| Production build | Not run, as explicitly requested |
| WebKit | Launch attempted; unavailable because required shared libraries are missing |

The unit-test run selected `tests/*.test.mjs` except `skill.test.mjs`. That excluded file compiles Solidity documentation examples and expects additional upstream root files; it was not run. Four selected tests use Vite's SSR module loader in the temporary copy. No production build, Solidity build, fork, or export regeneration was performed.

The design review covers all six pinned Better Interface domains. Unchanged upstream accessibility findings, scope conflicts, source locations and unperformed checks are documented in [artifacts/validation.md](artifacts/validation.md). A passing interaction or contrast probe is not a full accessibility or security certification. Upstream `web/VALIDATION.md`, `web/TEST-NOTES.md` and other retained historical evidence describe earlier work; this delivery claims only the checks recorded above.

## Project history and licensing

The repository's original contract documentation remains in [CONCEPT.md](CONCEPT.md), [CATALOG.md](CATALOG.md), [TEMPLATES.md](TEMPLATES.md), [INTEGRATION.md](INTEGRATION.md), [DISCLOSURE.md](DISCLOSURE.md) and [reference/PROVENANCE.md](reference/PROVENANCE.md). Those documents concern their recorded launches, not a new deployment by this task.

See [LICENSE](LICENSE) and [web/LICENSES/](web/LICENSES/) for the retained project and third-party notices. Better Interface guidance is credited in `DESIGN.md`.
