# Sworn interface

## Overview

Sworn is a public instrument panel for one Ethereum registry. Its eight hash routes use dense tables, numbered procedures and thin rules. The address search is the landing page’s primary action. Wallet controls live in the claim guide. The implementation is in `site/src/`; `dist/` is the static production export.

The brief’s exact copy, monospace prose, tracked uppercase labels, small type, square controls and Renderer artwork are intentional product requirements. Apply those choices consistently when adding another page.

## Colors

The canonical tokens are at `site/src/styles.css:1`.

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#0a0a0a` | Page, fields and controls |
| `--text` | `#d9e0da` | Reading text and focus outlines |
| `--muted` | `#8c968e` | Sources, labels, navigation, captions |
| `--faint` | `#5f6861` | Large step numbers, source line numbers, field borders |
| `--rule` | `#1f1f1f` | Section and structural rules |
| `--row-rule` | `#151515` | Table rows and selected-row surface |
| `--accent` | `#00ff41` | Links, primary buttons, active menu, header rule |
| `--direct` | `#00cc33` | Direct evidence and the verified source excerpt |
| `--shared` | `#dbfee6` | Shared evidence |
| `--panel` | `#8ff0a4` | Panel evidence |
| `--danger` | `#ff7777` | Mismatch banner and input errors |

The card retains the Renderer’s class colors. White dots mark exactly 202, 801, 901, 1001, 1101–1104 and 1201; `isRare` is in `site/src/catalog.ts`.

Measured solid text/background contrast against `--bg`: text 14.73:1, muted 6.48:1, accent 14.50:1, direct 9.13:1 and error 7.69:1. Faint is 3.43:1. Large step numbers meet the large-text threshold; the required 12px source line numbers do not meet the 4.5:1 small-text threshold. Their exact prescribed color is retained and recorded as a review limitation, not an accessibility pass.

## Typography

All interface text uses `ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`. There are no downloaded fonts. The SVG assets retain the Renderer’s own font declaration.

| Role | Size | Weight / spacing |
| --- | --- | --- |
| Landing headline | 34px | 500; line height 1.25 |
| Page title, statistics, step numbers | 24px | Titles 500; steps 400 |
| Brand | 15px | 600; tracking 0.22em |
| Procedure headings | 15px | 500 |
| Body | 13px | 400; line height 1.55 |
| Table body and menu | 12px | 400 |
| Section labels | 11px | 500; uppercase; tracking 0.12em |
| Family labels | 11px | Uppercase; tracking 0.08em |
| Table heads and sources | 10px | Heads tracked 0.12em; sources untracked |

Captions are 11px. Phone input text is 16px to avoid Safari’s automatic field zoom. Strong text uses 600. Tables use line height 1.6, code 1.7 and the verbatim source 1.8. Long prose generally uses `.measure` at 76ch. Addresses wrap; code and tables scroll within focusable regions. Numeric formatting is explicitly `en-US`, and integer token metadata is losslessly decoded.

## Layout

The header, main and footer have a 1,200px maximum outer width and 32px side padding. Claim and About use 976px content, equivalent to a 1,040px frame with the same side padding. At 600px and below the outer padding becomes 16px.

Sections have a 1px top rule and 30px vertical padding, reduced to 24px on phones. Common control gaps are 8–12px; larger groups use 24–36px. The desktop landing pairs the intro and address form with a 330px sample card, then four bordered statistic cells and a three-column procedure. Explorer places a 300px card to the left of the family table. The claim mint block has one accent border, a 300px card on the left and text and action on the right. Claim steps reserve a 48px number column.

At 1,100px the header and address controls wrap. At 780px the landing, Explorer and mint block stack; the claim mint action precedes its image visually so it remains on the first phone screen. At 600px statistics become two columns, address controls stack, and spec fields become one column. Tables retain their columns and scroll sideways with a visible instruction. The 66-hour chart scales to its container and has a complete data table.

Production pages were checked at 320, 390, 780 and 1,280px in Chromium and WebKit, and at 1,440px by the pinned probe. Page-width overflow was absent. At 390 × 844 the landing action ended at 675.97px and the claim mint action at 837.33px in both engines.

## Elevation & Depth

The surface system is flat. Rules carry structure; the single accent border identifies the card mint. There are no shadows, gradients, overlays, entrance effects or animations. Hover, pressed, focus, selected and disabled states change instantly.

## Shapes

All containers and controls have radius 0. The only round UI marks are the required 4px white rarity dots; these are evidence marks rather than rounded surfaces. The committed logo is the full-house Renderer image with its token-number text removed. The sample is the specified synthetic Renderer preview. Generation and hashes are recorded in `artifacts/renderer-assets.json`.

## Components

`site/src/components.tsx` supplies `Section`, `Source`, `AddressForm`, `Table`, `ClassMark`, `ContractAddress`, `WhySworn` and `HowToVerify`. Reuse these instead of adding another surface style. `Table` owns its focusable scroll region; `Source` provides the small muted attribution beside a quantity. `AddressForm` validates a full address, focuses errors and announces its result. The verbatim source uses one flex row per line and a fixed, non-shrinking 48px line-number gutter.

Buttons and button links have a minimum 44px height. Primary actions use accent fill and dark text; secondary actions have an accent outline. Focus uses a 2px text-color outline with 4px offset. Native labels, selects, checkboxes, radios, details and links provide keyboard behavior. Rare marks have image roles and accessible names. Code regions are focusable for keyboard scrolling.

`site/src/Claim.tsx` owns the four trait procedures and the separate card mint. `site/src/flow.ts` owns explicit ready, wallet, pending, confirmed, rejected, failed, replaced and unknown transaction states. Eligibility is read before buying or approving IMD, so existing cards and verified/pending requests stop before funding. Each receipt is checked before another transaction; reconnecting revalidates earlier receipts. A tab-scoped transaction journal permits reload recovery and never automatically broadcasts. Wallet identity, connection, keys and signatures are not persisted.

`site/src/chain.ts` owns checked mainnet reads and complete wallet snapshots. Failure clears the result and displays RPC unavailable. A dependency mismatch is a red text-and-border banner and blocks signing. Oracle entries without accepted evidence say “not claimed.”

## Do’s and Don’ts

- Start a page with the existing `main` frame, one page title and `Section` components.
- Keep comparable facts in tables, with the same column order and a source beside quantities.
- Preserve exact protocol names, ids, owner-approved copy and Renderer art.
- Keep primary interactions visible at 390px; verify the production export after changing density.
- Use the existing class markers for evidence and words for transaction status.
- Keep radius 0 and the single accent. Do not add fonts, icon sets, decorative imagery, gradients, shadows or motion.
- Preserve lossless integers and fail-closed RPC behavior when changing data views.

Design review used the pinned Better Interface guide across all six domains. Guidance attribution: [Jakub Krehel, Better Interface](https://github.com/jakubkrehel/skills/tree/267330e1adfc66a718fb65fa6918c1f06d0a689e/skills/better-interface), MIT; documentation method: [Paul Bakaus, Impeccable](https://github.com/pbakaus/impeccable/blob/9d715cc4f5564a990ca8345abfdd5df6dc9b41c8/skill/reference/document.md), Apache-2.0. The supplied license texts are preserved in `site/LICENSES/Better-Interface.txt`.
