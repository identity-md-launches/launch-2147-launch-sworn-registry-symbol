# Sworn · implemented design, 1.0.1

## Overview

The source of truth is unchanged `web/` from `banse/sworn` commit `5e0dce32d16e034d02dc018323c8615f37188383`; `dist/` is that commit's supplied export. This describes the implementation, not a redesign or new build. The earlier `site/` frontend is historical.

Sworn lets visitors inspect Ethereum wallet facts, mint an optional card, verify facts, define community rules and curate lists. Its instrument-panel character uses system monospace, near-black surfaces, green actions, square controls, thin rules and a thirteen-family hive. The landing places the address form before explanatory prose. Synthetic artwork is labeled as illustration rather than a wallet credential.

## Colors

Global tokens are declared in `web/src/styles.css:1`.

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#0a0a0a` | Page, controls and dialogs |
| `--text` | `#d9e0da` | Primary text and focus outlines |
| `--muted` | `#8c968e` | Secondary copy, sources and navigation |
| `--faint` | `#5f6861` | Neutral control borders |
| `--rule` | `#1f1f1f` | Structural rules and disabled borders |
| `--row-rule` | `#151515` | Hover/disabled surfaces |
| `--accent` | `#00ff41` | Links, primary fills and selected states |
| `--direct` | `#00cc33` | Direct evidence |
| `--shared` | `#dbfee6` | Shared evidence and primary hover |
| `--panel` | `#8ff0a4` | Panel evidence |
| `--danger` | `#ff7777` | Errors and invalid borders |

Evidence labels accompany color. `web/src/fact-check/fact-check.css` scopes matching `--fc-*` colors and `--fc-rule: #222`; progress strips add `#0d140d` and `#344333`. `web/src/progress-experience.css` uses `#0b130d`/`#285c35` progress surfaces and `#69ed8b`, `#ff9d9d`, `#bdc8bf` summary states. These are local exceptions, not global ramps.

The handbook's `web/public/docs/style.css` uses `#090b09` background, `#101510` surface, `#dce3da` text, `#a0aca0` muted text, `#6be64b` accent, `#293329` borders and `#b2ff93` focus. Print styles use light paper colors. No app theme switch exists. The rendered landing passed the pinned solid-background contrast check; conditional states and inline link distinction are not certified.

## Typography

The stack is `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`, with no downloadable font. Body weight is 400 and emphasis generally 600. Actual system font availability varies by visitor. Root line-height is 1.6, prose 1.65 and code blocks 1.7. Numbers use `tabular-nums`.

| Token | Size | Role |
| --- | --- | --- |
| `--label` | 11px | Small labels and sources |
| `--small` | 12px | Navigation, status, captions |
| `--body` | 13px | Default UI and data |
| `--prose` | 15px | Prose, brand, tertiary headings |
| `--step` | 19px | Procedure/progress emphasis |
| `--title` | 24px | Section headings |
| `--display` | 34px | Page titles and landing headline |

`h1` uses 600 weight, 1.3 line-height, −0.02em tracking and balanced wrapping. The landing uses 1.25/−0.03em and a 19ch desktop/22ch phone measure. The wordmark tracks at 0.12em. `h4` and `.subpart-title` are muted uppercase. Modal/Fact Check styles include local sizes such as 20px. The source declares seven global size tokens even though the landing probe fits its per-viewport thresholds. Uppercase landing headings and monospace prose are inherited exceptions.

At ≤600px the main address and form fields use 16px input text. Addresses, receipts and status text wrap with `overflow-wrap: anywhere`; code blocks scroll locally. Curator paragraphs cap at 78ch and payment explanations at 65ch. The handbook is a separate reading surface: 16px root (15px under 540px), 1.75 line-height, a responsive title and 74ch prose.

## Layout

Header, main and footer share a 1,264px maximum frame with 32px side padding, giving 1,200px content. Main padding is 40px above/72px below, reduced to 28px/48px with 16px side padding on phones. Spacing tokens are 4, 8, 12, 16, 20, 24, 32, 40 and 48px (`--s1` through `--s12`, with gaps).

The desktop landing uses `minmax(0, 1.1fr) minmax(0, 1fr)`, a 48px gap, form left and hive right. Its record strip has four cells. Structural sections use top rules. `web/src/site-navigation.css` overrides the older header rules with a brand/navigation/wallet grid.

| Width | Adaptation |
| --- | --- |
| ≤1200px | Navigation below the brand/wallet row |
| ≤1150px | Landing gap becomes 32px; input/action groups wrap |
| ≤1000px | Curator facts/ranges become two columns; progress adapts |
| ≤900px | Evidence classes become two columns; Catalog proportions tighten |
| ≤800px | Connected wallet text/art stack |
| ≤780px | Landing, Explorer, mint and comparison layouts stack; record strip has two columns |
| ≤760px | Fact Check canvas/agent surfaces adapt |
| ≤640px | Wallet bottom sheet; forms and fact/evidence rows stack |
| ≤600px | 16px page padding, four-column header navigation, full-width address action and 16px inputs |
| ≤480px | Task-tab/payment spacing tightens |

Curator's 1,050px minimum-width table has a focusable horizontal scroll region; code and handbook tables also scroll locally. Handbook navigation stacks under 950px and tightens under 540px. Ten app routes were checked at 320, 390, 780 and 1440px with no page overflow. At 390×844 the home action spans y=475.39–519.39, visible with the heading and address field. Native zoom, RTL and pseudo-localization were not verified.

## Elevation & Depth

The app is flat: one-pixel structural/state borders and subtle tonal surfaces, without decorative shadows or gradient text. Native dialogs use the top layer and a dark backdrop (`rgb(0 0 0 / 0.8)`). The wallet picker caps at 420px wide/85dvh high with local scrolling and `overscroll-behavior: contain`.

Progress uses text labels. `swarm-wait` is guarded by `prefers-reduced-motion: no-preference`; Fact Check disables orbit/pulse/reveal motion for reduced motion. The landing probe found no endless animation or `transition: all`. Conditional paid-request animation was source-reviewed, not observed during a new paid request. The 1.0.1 `web/src/fact-check/hive-anchor.mjs` retains the progress hive's scroll position during phase changes, including dialogs/narrow screens; helper tests are in `web/tests/hive-anchor.test.mjs`.

## Shapes

Buttons, fields and panels have square corners. Hexagons identify hive artwork/evidence rather than general surfaces. Rarity dots have textual labels. Wallet marks retain vendor forms/colors in `web/src/wallet-icons.ts`. No asset or font was added for this import.

## Components

| Source | Reuse and states |
| --- | --- |
| `web/src/components.tsx` | `Section`, `Status`, `Mark`, `AddressForm`, `Card`, `CommunityCard`, `WalletFactRows`, contract/source/code patterns |
| `web/src/App.tsx` | Frame/footer, route titles, main focus, skip link, loading/recovery and lazy Fact Check |
| `web/src/site-navigation.tsx` and `.css` | Primary links, native More disclosure, current destination and keyboard/focus |
| `web/src/task-navigation.mjs` | Mint destinations and legacy bookmarks |
| `web/src/wallet.tsx` | EIP-6963, native wallet dialog, wallet-browser links, Coinbase and connection/error/switch/disconnect states |
| `web/src/claim.tsx` | Card preparation, fact picker, fees/consent and community-rule form |
| `web/src/controllers/transactions.tsx` | Preparation, signature, pending, receipt and recovery |
| `web/src/curator.tsx` and `.css` | Fact/weight filters, historical/current evidence, CSV/JSON and consumer tabs |
| `web/src/wallet-summary.tsx` and `.css` | Held-fact table, card and family highlight |
| `web/src/fact-check/FactCheckLive.tsx` | Public/connected history, refresh/retry, loading/disconnected states |
| `web/src/fact-check/FactCheckView.tsx` and `fact-check.css` | Stages, agents, agreement, Registry confirmation and evidence disclosure |
| `web/src/community-rule.mjs` | Compact Mint rule/window/question; full raw Catalog rule |
| `web/public/docs/app.js` | Handbook search, Escape clear and contents disclosure |

Buttons have 44px minimum height, neutral borders, accent hover/active states and explicit disabled styling. `.primary` fills accent with dark text and uses `--shared` on hover. Inputs use matching square forms with danger borders when invalid. Focus is a 2px text-color outline offset 4px. Wallet rows are ≥48px; their close control is 36px. The home target-spacing probe passed the 24px baseline; that does not establish 44px targets everywhere.

`AddressForm` validates on submit, focuses invalid input, sets `aria-invalid` and references its status/error with `aria-describedby="address-error"`. Native modal behavior contains focus; Escape/backdrop/close dismissal and focus restoration are supported. More supports keyboard opening and Escape. Hash navigation moves focus to the destination. These paths and Curator tab keyboard navigation were exercised.

Community facts reuse the mini hive. Mint's compact 1.0.1 summary describes qualifying IMD payments as paid swarm requests and separates rule/window from registrant; Catalog retains raw conditions/full addresses. Known negatives sit behind a counted disclosure. Loading/met/not-met/unavailable advice is textual, with `Source: indexer, block N` or `Source: chain scan`. Advice never substitutes for Registry proof. Fact Check distinguishes accepted/saved facts from API progress and retains read recovery.

## Do's and Don'ts

- Preserve both imported folders byte for byte for this release; make future UI changes in a separately reviewed source/build release.
- For a future page, reuse the shared frame, hash route, one `h1`, `Section`, `Status`, controls and evidence marks.
- Choose tokens by role and reuse spacing and primary/secondary action styles.
- Keep full conditions reachable in Catalog, and keep fees, consent and provenance visible.
- Distinguish historical candidates, live reads, pending requests and confirmed Registry facts.
- Recheck phone entry actions, modal keyboard behavior and static subpath assets after future changes.

All six pinned Better Interface domains informed the review. Guidance: [Jakub Krehel, Better Interface](https://github.com/jakubkrehel/skills/tree/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-interface), MIT. Documentation method: [Paul Bakaus, Impeccable](https://github.com/pbakaus/impeccable/blob/9d715cc4f5564a990ca8345abfdd5df6dc9b41c8/skill/reference/document.md), Apache-2.0. Notices remain in `web/LICENSES/Better-Interface.txt`. Findings and unperformed checks are in `artifacts/validation.md`.
