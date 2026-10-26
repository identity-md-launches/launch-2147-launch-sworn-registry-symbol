# Sworn · Fact Check interface

## Overview

The final source is `web/` from `banse/sworn` commit `f6e80c156946020d5eb411a22fbf9ff962615438`; `dist/` is that commit's unchanged production export. This document describes the implementation, not a redesign. The earlier `site/` frontend is retained history.

Sworn is a public instrument for inspecting wallet facts on Ethereum, minting an optional card, requesting facts and curating wallet lists. Its visual system uses system monospace, near-black surfaces, green actions, square controls, thin structural rules and a thirteen-family hive. The landing puts the address form before its explanatory prose. The hive is supporting artwork, with synthetic illustrations explicitly labeled.

## Colors

The app's canonical tokens are at `web/src/styles.css:1`.

| Token | Value | Implemented role |
| --- | --- | --- |
| `--bg` | `#0a0a0a` | Page, fields, buttons and dialogs |
| `--text` | `#d9e0da` | Primary text and keyboard focus outline |
| `--muted` | `#8c968e` | Secondary text, sources and navigation |
| `--faint` | `#5f6861` | Neutral field/button borders and limited secondary marks |
| `--rule` | `#1f1f1f` | Structural separators and disabled borders |
| `--row-rule` | `#151515` | Hover and disabled surfaces |
| `--accent` | `#00ff41` | Links, primary fills, selected navigation and status emphasis |
| `--direct` | `#00cc33` | Direct evidence |
| `--shared` | `#dbfee6` | Shared evidence and primary hover fill |
| `--panel` | `#8ff0a4` | Panel evidence |
| `--danger` | `#ff7777` | Error text and invalid field border |

The rendered landing's solid text/background pairs passed the pinned contrast probe. Inline links have a separate distinction issue: the current axe scan flags links distinguished only by color; see validation. No full accessibility pass is claimed.

Verification progress adds local colors in `web/src/progress-experience.css`: the overview uses `#0b130d` with a `#285c35` border; summary states use `#69ed8b`, `#ff9d9d` and `#bdc8bf`. These are implemented exceptions to the global tokens, not additional global ramps.

The bundled handbook has its own stylesheet at `web/public/docs/style.css`: background `#090b09`, surface `#101510`, text `#dce3da`, muted `#a0aca0`, accent `#6be64b`, border `#293329` and focus `#b2ff93`. Its print media block switches to a light paper palette. No app theme switch exists.

## Typography

The app stack is `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. There are no downloadable fonts. Actual installed system faces depend on the visitor's platform. Body line-height is 1.6, prose 1.65 and code 1.7; root numbers use `tabular-nums`.

| Token | Size | Use |
| --- | --- | --- |
| `--label` | 11px | Sources and small labels |
| `--small` | 12px | Navigation, status and captions |
| `--body` | 13px | Default UI and data |
| `--prose` | 15px | Prose, brand and tertiary headings |
| `--step` | 19px | Procedure/progress emphasis |
| `--title` | 24px | Section headings |
| `--display` | 34px | Page titles and landing headline |

Weights are predominantly 400 and 600. Main titles use 600, balanced wrapping, line-height 1.3 and tracking −0.02em. Landing titles use line-height 1.25 and tracking −0.03em, with a width of 19ch on desktop and 22ch on phones. The wordmark uses 0.12em tracking. Fact Check history headings use a local 20px size; its progress/canvas surface also has local sizes rather than using only the global tokens. `h4` and `.subpart-title` are uppercase and muted. Two landing section labels are authored in capitals.

At 600px and below, the address, form-grid and recovery fields use 16px input text. Long addresses, proof text and statuses wrap with `overflow-wrap: anywhere`; code blocks scroll locally. Prose spans its available content width unless a specific component sets a measure. Curator paragraphs cap at 78ch; transaction payment explanations cap at 65ch. The landing probe observed six sizes, including one-off sizes; the global source declares the seven tokens above. That measurement does not certify a six-size limit across conditional Fact Check states.

The handbook uses a system monospace stack, a 16px root and 1.75 line-height, reduced to a 15px root under 540px. Its title uses `clamp(2rem, 3.7vw, 3.35rem)` and its prose is limited to 74ch. It is a distinct reading surface, not the app's compact scale.

## Layout

`web/src/styles.css` defines a 1,264px maximum outer frame with 32px side padding, giving 1,200px content at the maximum. Header, main and footer align to that frame. Main padding is 40px above and 72px below. Phones use 16px side padding and 28px/48px main vertical padding.

The spacing tokens are `--s1: 4px`, `--s2: 8px`, `--s3: 12px`, `--s4: 16px`, `--s5: 20px`, `--s6: 24px`, `--s8: 32px`, `--s10: 40px` and `--s12: 48px`. Existing components also contain literal spacings.

The desktop landing has a 1.1fr/1fr split, a 48px gap, copy/address form on the left and a square hive on the right. The four-cell record strip and evidence grids follow it. Sections use top rules. Catalogue rows align fact, rule and evidence without nested decorative cards.

| Breakpoint | Implemented behavior |
| --- | --- |
| ≤1200px | The active compact header puts navigation in a second row; below 600px its links use a four-column grid |
| ≤1150px | Input/action groups wrap; landing gap shrinks |
| ≤1000px | Curator facts and numeric ranges become two columns; progress layouts adapt |
| ≤900px | Evidence classes become two columns; catalogue proportions tighten |
| ≤800px | Connected wallet summary and artwork stack with a 24px gap |
| ≤780px | Landing, Explorer, mint and comparison layouts stack; records become two columns; catalogue rows put the rule below the fact |
| ≤760px | Fact Check verification canvas and agent views adapt to a phone layout |
| ≤640px | Wallet picker becomes a full-width bottom sheet; forms, evidence and fact rows become one column |
| ≤600px | 16px frame padding; full-width stacked address action; compact section gaps; 16px form text; Curator grids become one column |
| ≤480px | Task-tab padding and mint/payment gaps tighten |

Curator's seven-column table has a 1,050px minimum width inside a focusable horizontal scroll region. Code and the handbook's tables also scroll within their own containers. The page itself did not overflow at 320, 390, 780 or 1440px on any of the ten app routes checked in Chromium.

At 390 × 844, the home address action occupies y=475.39–519.39px. Product heading, field and action are visible in the first screen. This measurement is for the homepage, not every transaction step. The handbook switches from a sidebar layout to stacked navigation at 950px and tightens again at 540px.

## Elevation & Depth

The app is primarily flat: near-black surfaces, one-pixel rules and state borders. There are no decorative card shadows or gradient text. Native dialogs sit in the top layer with a dark backdrop. Progress summaries use modest tonal surfaces and borders; Curator notices use a left accent rule.

Loading uses a labeled progress state. The `swarm-wait` animation is enabled only for `prefers-reduced-motion: no-preference`; the landing has no endless animation. The handbook explicitly removes animations and transitions for reduced motion. No theme transition exists.

## Shapes

Buttons, fields and panels use square corners. The hive's hexagons are data/artwork, not general panel shapes. The white rarity dot accompanies a text label. Existing wallet marks retain their vendor colors and forms in `web/src/wallet-icons.ts`. No custom image, icon, font or palette was commissioned for this import.

## Components

| Source | Reuse points and behavior |
| --- | --- |
| `web/src/components.tsx` | `Section`, `Status`, `Mark`, `AddressForm`, `ContractList`, `Sources`, `CodeBlock`, `Card`, `CommunityCard`, `WalletFactRows` |
| `web/src/App.tsx` | Shared header/footer, route titles, main focus, skip link, public read recovery, global providers and lazy Fact Check loading |
| `web/src/site-navigation.tsx`, `web/src/site-navigation.css` | Compact primary navigation, native More disclosure, secondary destinations and route/anchor focus |
| `web/src/task-navigation.mjs` | Mint Card, Mint Wallet Facts and Mint Rule destinations plus legacy bookmark resolution |
| `web/src/wallet.tsx` | `ConnectControl`, native modal wallet sheet, EIP-6963 discovery, mobile wallet-browser links and Coinbase connector |
| `web/src/claim.tsx` | Card snapshot, fact picker, costs and immutable-rule form |
| `web/src/controllers/transactions.tsx` | Explicit preparation, signature, pending, receipt and recovery states |
| `web/src/swarm.tsx` | Request progress, agreement and recorded-result presentation |
| `web/src/curator.tsx`, `web/src/curator.css` | Fact/weight selection, evidence modes, historical filtering, current reads, CSV/JSON export and consumer tabs |
| `web/src/wallet-facts.tsx` | Claimed wallet facts and links into Fact Check request history |
| `web/src/wallet-summary.tsx`, `web/src/wallet-summary.css` | Held facts table, card artwork and selected-family highlight |
| `web/src/fact-check/FactCheckLive.tsx` | Disconnected prompt, public wallet links, bounded history, refresh and retry |
| `web/src/fact-check/FactCheckRequest.tsx` | Validated request selection and pending-transaction bridge |
| `web/src/fact-check/FactCheckView.tsx`, `web/src/fact-check/fact-check.css` | Verification stages, agents, agreement, Registry confirmation, artwork and evidence disclosure |
| `web/public/docs/app.js` | Local handbook search, clear/Escape behavior and desktop contents disclosure |

Buttons have a minimum 44px height. Primary actions are green with dark text; secondary buttons are transparent with a neutral border. Hover adjusts border/text/surface, active fills accent, and disabled controls use muted text and structural borders. Inputs follow the same square treatment and use a danger border when invalid. Focus is a 2px text-color outline with 4px offset. Some navigation/link targets are smaller than 44px; the landing target-spacing probe passed the 24px baseline.

`AddressForm` rejects malformed addresses, focuses the input and updates a status region linked by `aria-describedby="address-error"`. The missing description target noted in the previous release is fixed in the imported upstream source. `Card` uses local SVG artwork or the deployed Renderer image; interactive hive cells are named buttons that filter families. The wallet sheet uses `showModal()`, keyboard navigation, Escape and backdrop dismissal, and restores its opener. On phones it includes safe-area bottom padding.

The saved Fact Check view was also inspected at 390px using a real Registry event and API-returned agent results; it showed a recorded fact and eight reported panel members. No paid request was created.

Current chain data comes through `web/src/chain.ts` and `web/src/rpc.mjs`, with deployment/ABI/runtime checks and explicit unavailable states. Historical candidate data is labeled separately from accepted Registry facts. The transaction journal does not make a transaction successful until confirmed evidence supports it. These behaviors were inspected up to the wallet-signing boundary; no real wallet flow was executed.

### Fact Check and navigation additions

The current header uses `SiteNavigation`, with Catalog, Mint Card, Mint Facts, Fact Check, Mint Rule, About and Docs visible outside More. `web/src/site-navigation.css` overrides the older general header rules: the desktop frame is a three-column brand/navigation/wallet grid; at 1200px it becomes two rows; at 600px navigation becomes four columns. The More menu is a native `details` element with a bordered, positioned list. Escape, outside pointer/focus and route selection dismiss it, with keyboard focus restored to its summary when appropriate.

Fact Check's history is a flat list with rules, a checkmark, fact name, question, block number and transaction link. At 600px its three-column rows become two columns, with the transaction link under the fact text. Wallet addresses wrap in full. The disconnected state explains that a card is optional and offers Connect wallet, Mint Facts and Mint Card. Errors expose retry/recovery controls. History refresh reads bounded 7,200-block pages, progressively adding older facts; partial coverage is labeled.

The scoped `--fc-*` palette repeats the app background/text/muted/accent/panel/danger values and uses `--fc-rule: #222`. A progress strip uses `#0d140d` and a `#344333` separator. The verification surface shows stages, an agent/quorum meter and a hive canvas. Recorded outcomes require Registry evidence; API agreement alone is not presented as a saved fact. Reduced-motion CSS removes the orbit/pulse/reveal animations and transitions. Conditional live agent animation was source-reviewed and covered by upstream model/render tests; a new paid oracle request was not created for visual testing.

The connected wallet summary uses a 1.1fr/0.9fr text/art grid, a 40px gap and a fixed-layout facts table. Selected cells use background `#122413`, accent outline and text `#b6f1b2`. At 800px the grid stacks; artwork caps at 420px. These conditional connected states were source-reviewed, not exercised with a connected real account.

## Do's and Don'ts

- For this pinned release, preserve every source/export byte; keep reports and release tooling outside `dist/` and `web/`.
- For a future page, reuse the shared frame and route system, one page title, `Section`, `Status`, existing field/button styles and evidence marks.
- Select a color by its implemented role and reuse the spacing tokens before adding literals.
- Keep wallet credentials separate from card ownership and historical candidates separate from current Registry evidence.
- Preserve complete addresses, amounts and metadata; use wrapping or an explicit local scroll container.
- Check the first phone screen, dialog keyboard path and static gateway subpath after future changes.
- Record accessibility findings; the frozen export is not permission to claim an audit pass.

Review used all six domains of the pinned Better Interface guide. Guidance: [Jakub Krehel, Better Interface](https://github.com/jakubkrehel/skills/tree/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-interface), MIT. Documentation method: [Paul Bakaus, Impeccable](https://github.com/pbakaus/impeccable/blob/9d715cc4f5564a990ca8345abfdd5df6dc9b41c8/skill/reference/document.md), Apache-2.0. License notices are retained in `web/LICENSES/Better-Interface.txt`. Coverage, source findings and unperformed checks are in `artifacts/validation.md`.
