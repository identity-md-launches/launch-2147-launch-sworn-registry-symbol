# Sworn · Fact Check release

The next static release under **sworn** (`sworn.site.identitymd.eth`) is the production export from [banse/sworn, sworn-fact-check-site](https://github.com/banse/sworn/tree/f6e80c156946020d5eb411a22fbf9ff962615438), commit `f6e80c156946020d5eb411a22fbf9ff962615438`. It replaces the entire previous export at `f4e16276a954f0c9c7327733ba6adee298279fa6` and retains the existing hosting name.

**Release policy:** serve the committed `dist/` directly. It contains exactly **90 files, 2,411,318 bytes**, matching upstream byte for byte. No file was added, changed or omitted within the upstream export, and **no production build was run here**, as requested. GitHub's independent recursive tree API confirms all 90 Git blob hashes. The publisher consumes this export after submission; this task does not invoke a publishing or contract-deployment command.

## Preview without rebuilding

From the repository root:

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173/`. The entry assets use relative URLs, and navigation uses hash routes. The delivered export was also checked under `/preview/`, so gateway subpaths need no server route rewrite. The title, favicon, description, Open Graph title and local share image are included unchanged.

## Source and installation

| Path | Purpose |
| --- | --- |
| `dist/` | Exact 90-file hosting payload from the pinned commit |
| `web/` | Matching React/TypeScript source, assets, tests, package manifest and lockfile |
| `site/` | Preserved earlier frontend/redirect source; not the current export's source |
| `src/`, `script/`, `test/` | Preserved earlier Solidity project |
| `tools/verify-sworn-v2.py` | Dependency-free release/source integrity checker |
| `tools/validate-sworn-v2.mjs` | Browser checks of the committed export; does not build |
| `artifacts/validation.md` | Current results, six-domain design review and limitations |
| `DESIGN.md` | Implemented tokens, typography, components and responsive behavior |

All **319 included `web/` files** match upstream. Only `web/.gitignore` and `web/simulation/.gitignore` are omitted; the project's existing dependency exclusions remain effective. Existing package manifests, lockfiles, Vite/TypeScript configuration, Foundry configuration and dependency submodule pointers are unchanged. The pinned simulation fixtures and their Solidity vendor source are retained as source, not installed dependencies.

Use Node.js 24 and npm for future development:

```sh
cd web
npm ci
npm run typecheck
npm run dev
```

The existing lockfile pins React 19.3.1, Vite 8.3.5, TypeScript 7.0.2, viem 2.57.7, wagmi 3.7.9 and Coinbase Wallet SDK 4.3.7. Installed dependencies, caches, browser binaries and downloaded archives are not part of the submission.

## Rebuild a future development release

The upstream recipe below is documentation for future source work. **Do not run it to publish this immutable release**: it replaces `dist/`.

```sh
cd web
npm ci
npm run typecheck
npm run build
npm run preview
```

The build verifies pinned source/ABI inputs, runs Vite with `base: './'`, writes `../dist/`, generates the deployment asset manifest and checks the static release. This task did not test the production build or establish byte-reproducible rebuilding. Restore this exact release from the pinned archive instead of regenerating it.

## Main interactions

The homepage's **Explore wallet** form reads public facts without connecting a wallet. Navigation now exposes **Fact Check**, which follows verification requests and lists minted facts from Registry history. Its disconnected state opens the shared wallet picker; public `#/fact-check?wallet=…` links work without a wallet connection. Request links validate their parameters and offer recovery when invalid.

| Route | Interaction |
| --- | --- |
| `#/` | Enter an Ethereum address and explore its record |
| `#/catalog` | Browse facts and inspect wallets in the embedded Explorer |
| `#/mint` | Mint an optional card and inspect the connected wallet's card |
| `#/request` | Choose wallet facts to mint; follow request progress |
| `#/fact-check` | Follow live requests and read saved fact history |
| `#/register` | Define an immutable community rule |
| `#/curator` | Filter historical candidates, export lists and check eligibility |
| `#/integrate`, `#/about` | Contract integration and evidence documentation |
| `docs/index.html` | Bundled handbook with local search |

The More disclosure contains secondary destinations. Legacy bookmarks resolve inside the app, including `#/explorer`, `#/wallet`, `#/claim`, `#/oracle` and `#/fact-check-demo`. The latter routes resolve to the live Fact Check page; demo/simulation code is absent from the production scripts.

The browser reads Ethereum mainnet through public RPCs, `api.imd.fun` and IPFS gateways. These external services and a visitor's wallet are required for their respective live operations. No backend, private credential or relay project ID is part of this static app. The app preserves upstream **launch #2404**, as recorded in `web/deployment-handoff.json` and `dist/imd-deployment.json`. The project's older launch #2147 records remain history; this import does not retarget the app or deploy any contract.

Wallet discovery uses EIP-6963 and Coinbase Wallet. Phones offer links into supported wallets' own browsers. This worker did not connect an account, sign or broadcast a transaction.

## Verify the release

No dependencies are needed for integrity checking:

```sh
python3 tools/verify-sworn-v2.py
```

For independent comparison, download the [pinned archive](https://codeload.github.com/banse/sworn/tar.gz/f6e80c156946020d5eb411a22fbf9ff962615438) outside the repository, then run:

```sh
python3 tools/verify-sworn-v2.py --archive /path/to/sworn-f6e80c156946020d5eb411a22fbf9ff962615438.tar.gz
```

To check interactions after installing source dependencies and Chromium:

```sh
cd web
npx playwright install chromium
cd ..
node tools/validate-sworn-v2.mjs
```

Results and screenshots go to `test/scratch/fact-check-browser/`. The checker serves `dist/` under a subpath without rebuilding. `SWORN_PLAYWRIGHT_MODULE` optionally selects an external Playwright installation; `SWORN_TEST_RPC` optionally selects a read-only test transport without changing the exported public RPC configuration.

Current results:

| Check | Result |
| --- | --- |
| Exact export / included source | 90 / 319 files match the pinned commit |
| Git bundle size | Complete current content under 8 MiB, including a 64 KiB reserve; see submission audit |
| Typecheck | Passed |
| Selected upstream unit suite | 272 passed, 0 failed |
| Source pin, ABI and static-release checks | Passed |
| Chromium interaction checks | 59 passed, 0 failed, including live Fact Check history |
| Responsive initial routes | 40 layouts checked; no page overflow |
| Pinned design probe | 14/16; capitals and monospace exceptions retained |
| Production build | Not run, per explicit instruction |
| WebKit | Launch unavailable: required shared libraries missing |

Inline-link accessibility findings remain in the unchanged upstream export. Detailed results, the six-domain review, remaining limitations and the submission-size audit are recorded in [artifacts/validation.md](artifacts/validation.md). The specific instruction to preserve `dist/` unchanged and run no build takes precedence over the generic build/fix acceptance language. Upstream `web/VALIDATION.md` and other historical reports describe earlier work and are not claims about this delivery.

## Project history and licensing

Earlier contract documentation remains in `CONCEPT.md`, `CATALOG.md`, `TEMPLATES.md`, `INTEGRATION.md`, `DISCLOSURE.md` and `reference/PROVENANCE.md`. See `LICENSE` and `web/LICENSES/` for retained project and third-party notices. The implemented design and guide attribution are in `DESIGN.md`.
