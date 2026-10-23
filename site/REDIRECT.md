# Sworn test-site redirect

The launch #2147 site now redirects to `https://swornbyswarm.sites.imd.fun/`.
The shipping entry is `site/index.html`; it imports no application modules.
The earlier React, wallet and registry modules remain as historical source, but
none is bundled or executed. There is no RPC, wallet connection, analytics,
remote font or request to `api.imd.fun` in the redirect export.

The page title remains exactly `Sworn | Wallet facts on Ethereum`. Its only
visible content is the requested heading, paragraph and native `Open Sworn`
link. The inline script first adds `window.location.hash` to the link and then
calls `window.location.replace` with that destination. No timer or route
allowlist is involved, so unknown and encoded fragments also survive. Without
JavaScript, the head's meta refresh opens the destination root after one second.
The canonical URL always names that root.

## Build and preview

Use the existing package manifest, lockfile and Vite configuration unchanged:

```sh
cd site
npm ci
npm run typecheck
npm run build
npm run preview
```

Vite uses `base: './'` and writes `../dist/`. The preparation step now checks
that `site/public/` contains only `favicon.svg`; it no longer generates or copies
registry data. The favicon is the existing logo, moved without modification.
Inline styles and a classic inline script leave the export with just
`index.html` and `favicon.svg`. The favicon and metadata image use the relative
URL `./favicon.svg`. The old `assets/`, `data/` and `examples/` are absent from
both the public input and export.

For this assignment, installation and build execution used a temporary copy of
the exact site source, outside the repository, to avoid changing repository
dependency directories. The resulting export was copied to `dist/`. The final
rebuild was compared byte for byte with the delivered export.

## Implemented design

The root `DESIGN.md`, `README.md` and `artifacts/` are intentionally preserved
as requested. This source-local record describes the smaller final page.

`site/index.html:17` reuses the documented dark palette: `--bg: #0a0a0a`,
`--text: #d9e0da`, and `--accent: #00ff41`. All text uses
`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`, with no font download.
Body and link text are 13px/1.55 at weight 400; the page heading is 24px/1.3 at
weight 500. There is no tracking, text transformation or additional type scale.

The main frame is at most 1200px wide, horizontally centered, with 38px vertical
and 32px horizontal padding. At widths up to 600px it uses 24px and 16px padding.
The heading has an 18px bottom margin; the paragraph has a 16px bottom margin
and a 76ch maximum measure. Long text can wrap without clipping. The native
underlined link has a minimum 44px target height, a 2px text-color keyboard
outline with 4px offset, and text-color hover/pressed states. There are no
containers, navigation bars, cards, illustrations, shadows or animations.

## Validation and Better Interface review

Reviewed the pinned Better Interface workflow and core principles in all six
domains. The idea is a minimal relocation notice in Sworn's existing type and
colors, with one action to reach the current site.

| Domain | Coverage and result |
| --- | --- |
| Accessibility | One native main landmark, one h1 and a named native link. Keyboard Tab/Enter, 44px target, visible focus screenshot and axe WCAG 2.2 AA scan checked in Chromium; zero axe violations or incomplete rules. Screen-reader and physical-device sessions were not performed. |
| Layout | Fallback checked at 320, 390, 600, 780 and 1440 CSS pixels. No page-width overflow; action visible on the first screen at all five widths. At 390 the action ends at 193.61px. Text enlargement to 200% was checked; browser-native zoom and RTL were not checked. |
| Writing | Heading, paragraph, link, title and target compared exactly against the brief. No added visible copy. |
| Typography | Two sizes, two weights, one system monospace stack; wrapping inspected in the 390px and 1440px screenshots. System fallback fonts can differ between devices. |
| Colors | Rendered text/background pairs measured by the pinned probe: heading and paragraph 14.73:1; link 14.50:1. Focus screenshot inspected. No light-theme variant is part of this page; forced-colors rendering was not checked. |
| UI | Native link behavior and keyboard activation checked; hover and pressed rules reviewed in source. No motion, overlays, loading states, forms or wallet states apply. Reduced-motion emulation found no animations. |

Findings and fixes:

- `site/scripts/prepare.mjs:3`: the former preparation step recreated retired
  registry data. Replaced it with a public-directory guard, removed the old
  public payloads, and confirmed that production builds output only two files.
- `site/index.html:22`: the probe flags monospace prose. The brief explicitly
  requires the type already documented in `DESIGN.md`; the existing system
  monospace stack is therefore retained as an intentional requirement.
- No unresolved functional or applicable visual defect was found in the
  Chromium checks performed. The original test fixture reused same-document
  hash navigation; it was corrected to load a fresh document for each visit
  before validating fragment-specific link behavior.

Actual commands and outcomes:

- `npm run build`: passed, including the build script's TypeScript check.
- `npm run typecheck`: passed separately.
- Extracted the production inline script and ran
  `tsc --noEmit --allowJs --checkJs --skipLibCheck --lib ES2022,DOM`: passed.
- Final production rebuild: both export files matched byte for byte; the export
  totals 12,225 bytes. Scope and whitespace checks passed. No file outside
  `site/` and `dist/` changed, including all protected build/dependency files.
  The deliverable tree is approximately 3.81 MB before compression and 1.85 MB
  as a compressed current-tree archive, below the 8 MiB limit; no dependency
  directory or package archive was added to the submission.
- `node site/tests/redirect-browser.mjs --playwright <external module> --axe <external module>`:
  **36 checks passed, zero failed**, Chromium. All six required entry fragments
  plus two arbitrary fragments were tested over an HTTP subpath and `file:`.
  Redirect requests occurred in 25–103ms; history length and Back confirmed that
  the redirect page was replaced. Link hrefs preserve each fragment. No-JavaScript
  visits with no hash and `#/claim` reached the destination root in 1050ms and
  1047ms. No console, resource or unexpected-request errors were observed.
- WebKit could not launch; no WebKit behavior or screenshots are claimed.
- Ran the pinned command
  `node .imd/reads/skills/design-critic/scripts/taste.mjs --out test/scratch/taste --offline`
  on the production export. It navigated away before measurement, producing an
  empty-page render/share failure. Its other checks are not treated as evidence.
- Ran the same unmodified probe against a scratch fixture copied from the
  production export with only the meta refresh and `location.replace` call
  suppressed. **15/16 checks passed**; only the required monospace prose was
  flagged. Render, layout, target size, contrast and metadata passed. This is
  evidence about the fallback, not a substitute for redirect interaction tests.

The browser test intercepts only the destination navigation, serving an inert
document there; it does not load or certify the new site's application. Its
visual fixture disables the two automatic navigations while retaining the
production page's DOM, styles, metadata and hash-link assignment. Browser
screenshots and detailed results were generated under `test/scratch/redirect/`
and `test/scratch/taste-fallback/`; these temporary verification files are not
part of the submitted export. The 390px, desktop and focused screenshots were
visually inspected. Full social-network unfurl behavior, including SVG image
support, was not verified.

Complete for the stated redirect scope with the browser limitations above.
Guidance attribution and license texts remain in `site/LICENSES/Better-Interface.txt`.
