# N-SLSK infoweb — design system specification

The visual language for the internal infoweb of the Náčelníctvo Slovenského skautingu. Its readers
are the Náčelníctvo, the Ústredie and the support teams. Everything new on the site (everything
outside `/archiv`) is built from this document. The implementation lives in
[`src/app/(web)/web.css`](<src/app/(web)/web.css>) (tokens) and
[`src/app/(web)/_components/`](<src/app/(web)/_components/>) (primitives). If the code and this
document disagree, fix one of them; don't let them drift.

**Sources.** The design follows **[snem.skauting.sk](https://snem.skauting.sk/)** (the newest and
preferred reference) for palette, type and overall air. It borrows the **component structure** of
**[sluzba.skauting.sk](https://sluzba.skauting.sk/)**, recoloured from its red into the snem palette.
**[skauting.sk](https://skauting.sk/)** confirms the shared brand: the same navy, blue and yellow,
Georama, and the asymmetric "leaf" radius. See [§12](#12-sources-and-what-was-taken) for detail.

---

## 1. Principles

1. **Calm and white.** Lots of air, one column of content on a 1080px grid, white as the default
   surface. The site is a working tool, so it should be quiet. Colour marks state and action; it
   isn't decoration.
2. **Navy carries, yellow points.** Navy is the voice: headings, primary buttons, body emphasis.
   Yellow is a highlighter for _the one thing_ on a screen: the active item, the key CTA, a
   placeholder warning. Blue is a supporting accent, never the main text colour.
3. **The leaf.** The asymmetric radius (`14px 35px 35px 14px`) is the brand's signature shape.
   Use it on interactive pills (buttons, tags, eyebrows, filter chips) and nowhere else, so it keeps
   meaning "you can act here".
4. **Flat.** No gradients, no glassmorphism, no drop shadows on resting UI. Depth comes from colour
   bands and borders. The one shadow token is reserved for things that float over the page.
5. **Honest content.** Mock or unverified content is always labelled (see the placeholder banner).
   Internal readers act on what this site says.

---

## 2. Colour

### 2.1 Tokens

| Token         | Hex       | Use                                                                                       |
| ------------- | --------- | ----------------------------------------------------------------------------------------- |
| `navy`        | `#002855` | Headings, primary buttons, links, nav text, dark bands, form-control borders              |
| `navy-700`    | `#003a75` | Hover state of navy fills                                                                 |
| `blue`        | `#00b5e2` | Decorative accent: icons on navy, illustration, progress fill on navy, rules              |
| `blue-ink`    | `#0077a8` | Blue that can carry text on white (secondary links, info icons)                           |
| `blue-tint`   | `#e9f5fc` | Info surfaces, selected rows, focus background of inputs                                  |
| `yellow`      | `#ffcd00` | Highlight: active nav underline, key CTA, placeholder banner, timeline line, list bullets |
| `yellow-600`  | `#e6b800` | Hover state of yellow fills                                                               |
| `yellow-tint` | `#fff6cc` | Soft warning / "pripravujeme" surfaces                                                    |
| `purple`      | `#702f8a` | Reserved for safeguarding (Bezpečný skauting / Safe from Harm) content only               |
| `green`       | `#2f7a2b` | Done / success state only (check marks, "hotovo")                                         |
| `ink`         | `#363332` | Body text                                                                                 |
| `muted`       | `#626262` | Secondary text, captions, metadata                                                        |
| `line`        | `#ebebeb` | Hairlines, card borders, dividers (decorative only)                                       |
| `surface`     | `#f7f7f7` | Alternate section band, subtle panels                                                     |
| `white`       | `#ffffff` | Default page and card surface                                                             |

### 2.2 Contrast: allowed pairs (WCAG 2.1)

| Foreground on background | Ratio     | Allowed for                                                            |
| ------------------------ | --------- | ---------------------------------------------------------------------- |
| `navy` on `white`        | 14.6:1    | Any text                                                               |
| `ink` on `white`         | 12.5:1    | Any text                                                               |
| `muted` on `white`       | 6.1:1     | Any text                                                               |
| `muted` on `surface`     | 5.7:1     | Any text                                                               |
| `blue-ink` on `white`    | 5.0:1     | Any text                                                               |
| `purple` on `white`      | 8.5:1     | Any text                                                               |
| `green` on `white`       | 5.3:1     | Any text                                                               |
| `white` on `navy`        | 14.6:1    | Any text                                                               |
| `yellow` on `navy`       | 9.8:1     | Any text                                                               |
| `navy` on `yellow`       | 9.8:1     | Any text: the yellow CTA and the placeholder banner                    |
| `navy` on `blue`         | 6.1:1     | Any text                                                               |
| `blue` on `white`        | **2.4:1** | **Never text.** Large decorative shapes only                           |
| `yellow` on `white`      | **1.5:1** | **Never text, never a meaningful border.** Fills behind navy text only |
| `white` on `blue`        | **2.4:1** | **Never**                                                              |

Rules that follow from the table:

- **Links** are `navy` with an underline (`decoration-yellow decoration-2` on hover). Never use plain
  `blue` for text.
- **Non-text UI** (checkbox borders, input borders, focus rings) needs 3:1, so use `navy`, not
  `line`.
- **Never use colour alone to signal meaning.** Pair it with an icon or a word: a done task shows a
  check _and_ strike-through, not just green.

---

## 3. Typography

**One family: [Georama](https://fonts.google.com/specimen/Georama)**, the face of all three
reference sites. It is loaded through `next/font/google` (self-hosted, `latin-ext` for Slovak
diacritics) and exposed as `--font-sans`. Fallback: `system-ui, -apple-system, 'Segoe UI', sans-serif`.
Don't add a second face. snem's italic Bellota is not carried over.

| Role    | Size / line-height (desktop)             | Mobile (<768px) | Weight  | Colour | Tailwind          |
| ------- | ---------------------------------------- | --------------- | ------- | ------ | ----------------- |
| Display | 64 / 1.05                                | 40 / 1.1        | 800     | navy   | `text-display`    |
| H1      | 48 / 1.1                                 | 34 / 1.15       | 700     | navy   | `text-h1`         |
| H2      | 36 / 1.2                                 | 28 / 1.2        | 700     | navy   | `text-h2`         |
| H3      | 28 / 1.3                                 | 22 / 1.3        | 600     | navy   | `text-h3`         |
| H4      | 22 / 1.4                                 | 19 / 1.4        | 600     | navy   | `text-h4`         |
| Lead    | 18 / 1.7                                 | 17 / 1.65       | 400     | ink    | `text-lead`       |
| Body    | 16 / 1.75                                | 16 / 1.7        | 400     | ink    | `text-base`       |
| Small   | 14 / 1.6                                 | 14 / 1.6        | 400–600 | muted  | `text-sm`         |
| Eyebrow | 13 / 1.2, uppercase, `tracking-[0.08em]` | same            | 700     | navy   | `eyebrow` utility |

- This corrects snem, where h2 (60px) is larger than h1 (48px). Here every level is smaller than
  the one above.
- Headings use `text-balance`; paragraphs use `text-pretty` and a max measure of `65ch`.
- Bold inside body copy is weight 600, not 700.
- Numbers in tables and progress counts use `tabular-nums`.

---

## 4. Layout and spacing

- **Container:** `max-w-[1080px]` centred, with a 16px gutter on mobile (`px-4`) and 24px from `sm`
  (`sm:px-6`). This matches snem's 1080/1060px. The `Container` component is the only thing that
  sets page gutters.
- **Spacing:** 4px base grid (Tailwind's default scale). Prefer steps 2, 3, 4, 6, 8, 12, 16, 24, 32.
- **Section rhythm:** `py-16` on mobile, `md:py-24`, and `lg:py-32` for heroes. Consecutive sections
  on the same surface share their padding, so there are no double gaps.
- **Grid:** cards sit in `grid gap-6` with `sm:grid-cols-2 lg:grid-cols-3`. Avoid more than three
  columns of text.
- **Breakpoints:** Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280). These map onto
  snem's 480 / 768 / 960 / 1240.
- **Mobile first:** every page must work at 375px with no horizontal scroll.

---

## 5. Shape and elevation

| Token            | Value                              | Use                                                                           |
| ---------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| `rounded-leaf`   | `14px 35px 35px 14px`              | Buttons, eyebrow pills, tags, filter chips                                    |
| `rounded-leaf-r` | `35px 14px 14px 35px`              | Mirrored leaf: a pill whose "stem" points right (rare, for symmetry in pairs) |
| `rounded-card`   | `24px`                             | Cards, panels, banners inside the page column                                 |
| `rounded-media`  | `12px`                             | Images, avatars that aren't circles, embeds                                   |
| `rounded-full`   | `9999px`                           | Avatars, progress tracks, the lily disc                                       |
| `shadow-float`   | `0 15px 30px rgba(1, 7, 39, 0.13)` | Only things above the page: dropdowns, dialogs, toasts                        |

- Borders are 1px `line` for cards and 2px `navy` for interactive outlines (outline button,
  checkbox).
- Nothing at rest has a shadow.

---

## 6. Components

Every component lives in `src/app/(web)/_components/` (shared) or in a route's own `_components/`
(page-specific). Anatomy → variants → states → Tailwind.

### 6.1 Site header

- **Anatomy:** small lily (28px, navy) + wordmark "Náčelníctvo SLSK" (700, navy) on the left; nav
  links on the right; on mobile the nav wraps under the wordmark (no hamburger while there are ≤ 4
  items).
- **Behaviour:** white, at least `h-16`, bottom border `line`. Sticky (`sticky top-0 z-50`) together
  with the placeholder banner above it, as one block.
- **Nav link:** 15px / 600 / navy. **Active:** a 3px `yellow` underline (`aria-current="page"`).
  **Hover:** `bg-surface`, in the leaf shape.
- Pages that need a sticky element under that block offset it with `top-32` (`lg+`, where the
  banner fits on one line).

### 6.2 Site footer

- `bg-navy text-white`, `py-12`. A lily in white, a one-line description, and a row of links
  (yellow on hover).
- A last line in `text-white/70 text-sm`: "Interný web Náčelníctva Slovenského skautingu".

### 6.3 Button

The leaf-shaped pill. Height 44px (`md`) or 36px (`sm`), padding `px-6` / `px-4`, 15px / 700,
**sentence case** (snem uses uppercase; we drop it for readability of Slovak diacritics).

| Variant   | Rest                               | Hover / active                               | Use                                 |
| --------- | ---------------------------------- | -------------------------------------------- | ----------------------------------- |
| `primary` | `bg-navy text-white`               | `bg-navy-700`                                | The main action                     |
| `accent`  | `bg-yellow text-navy`              | `bg-yellow-600`                              | At most one per screen: the key CTA |
| `outline` | `border-2 border-navy text-navy`   | fills `bg-navy text-white` (sluzba pattern)  | Secondary actions                   |
| `ghost`   | `text-navy underline-offset-4`     | underline in yellow                          | Tertiary, inline                    |
| `on-dark` | `border-2 border-white text-white` | fills `bg-yellow text-navy` (sluzba pattern) | On navy bands                       |

- **States:** `focus-visible` ring (see §8); `disabled` → `opacity-50 cursor-not-allowed`, with no
  hover change.
- An optional trailing arrow `→` nudges 2px right on hover.
- A route `href` renders `next/link`, an outside URL renders `<a>`, and no `href` renders
  `<button>`.

### 6.4 Eyebrow

A small label above a heading that names the section. Leaf pill, `bg-yellow text-navy`, eyebrow
type, `px-3 py-1`. The `quiet` variant (`bg-blue-tint`) is for sub-sections. This is the recoloured
version of sluzba's pink section-label pill.

### 6.5 Section

A full-bleed band with a `Container` inside.

| Tone      | Classes                                                                        | Use                                            |
| --------- | ------------------------------------------------------------------------------ | ---------------------------------------------- |
| `white`   | `bg-white`                                                                     | Default                                        |
| `surface` | `bg-surface`                                                                   | Alternate bands to separate content groups     |
| `navy`    | `bg-navy text-white` (headings white, eyebrow stays yellow)                    | Hero-like emphasis, footer-adjacent CTA        |
| `split`   | `bg-[linear-gradient(180deg,var(--color-surface)_50%,var(--color-white)_50%)]` | Cards that straddle two bands (sluzba pattern) |

### 6.6 Card

- **`outline`** (default): `bg-white border border-line rounded-card p-6 md:p-8`. Title is H4 navy;
  body is small/ink. A linked card is fully clickable (link on the title, stretched with
  `after:absolute after:inset-0`). On hover the border turns `navy` and the arrow nudges.
- **`navy`**: `bg-navy text-white`. Used for key facts (date, place, deadline), as in snem's info
  tiles.
- **`yellow`**: `bg-yellow text-navy`. One important notice per page at most.
- **`muted`**: `bg-surface text-muted` with a "Pripravujeme" tag. Not interactive (no hover, no
  link).

### 6.7 Arrow list

Content lists use a yellow `›` marker (snem's `icon-right-dir`): `marker:text-yellow` won't render
a custom glyph reliably, so the marker is a `before:` pseudo-element in yellow, 700.

### 6.8 Accordion / disclosure

- Native `<details>`/`<summary>`. The summary is 16 / 600 / navy with a chevron that rotates 180°
  when open (200ms).
- Rows are separated by 1px `line`. No boxed background; the open row gets `bg-surface` only if it
  holds long content.

### 6.9 Tag / badge

- Leaf pill, 12px / 600, `px-2.5 py-0.5`.
- **Tones:** `neutral` (`bg-surface text-muted`), `navy` (`bg-navy text-white`), `info`
  (`bg-blue-tint text-navy`), `done` (`bg-green/10 text-green`), `warn` (`bg-yellow-tint text-navy`).
- Used for owners, deadlines, phases and statuses.

### 6.10 Alert / banner

- **Inline alert:** `rounded-card p-4`, an icon + text. Tones `info` (`bg-blue-tint`), `warn`
  (`bg-yellow-tint`), `error` (`bg-[#fde8e8] text-[#8a1c1c]`).
- **Placeholder banner** (page-level): full width, `bg-yellow text-navy`, `py-2.5`, 14px / 600,
  centred, with a ⚠ icon. Rendered by the root layout **above the header** on every infoweb page
  (not in the archive), sticky together with the header. `role="note"`. Use it
  on any page whose content is mock, a draft or not yet verified. **Never dismissible**: the warning
  must survive a screenshot.

### 6.11 Checklist item

- **Anatomy:** a custom checkbox (22px, `rounded-md`, 2px `navy` border; checked = `bg-navy` with a
  white check), then the title (16 / 600 / ink), then meta tags (owner, due date), then an optional
  `<details>` description.
- **Done:** the title is `text-muted line-through decoration-muted/60` and a `done` tag is added, so
  the state isn't carried by colour alone.
- **Pending write:** the checkbox shows a subtle pulse and is `aria-busy`. **Failed write:** the
  state reverts and an inline error line in `#8a1c1c` explains why.
- **Read-only:** `disabled` checkbox in `opacity-60` with a tooltip/explanation nearby. Without the
  edit password, that explanation is the edit unlock: a `bg-blue-tint` note above the list with an
  outline `sm` button „Povoliť úpravy“ that opens the password form (§6.15) in place.
- **Target size:** the whole label row is clickable, at least 44px tall.

### 6.12 Progress bar

`h-2 rounded-full bg-line` track with a `bg-navy` fill (`bg-yellow` on navy surfaces). Always
paired with a text count ("7 / 12"), `tabular-nums`. `role="progressbar"` with `aria-valuenow`,
`aria-valuemin` and `aria-valuemax`.

### 6.13 Phase stepper / timeline

- **Horizontal on `md+`, vertical on mobile.** Nodes are 32px circles: done = `bg-navy text-white`,
  current = `bg-yellow text-navy` with a navy ring, upcoming = `bg-white border-2 border-line`.
- Connectors are 3px lines in `yellow` (snem's timeline colour) between done/current nodes and in
  `line` after them.
- Each node has a label (14 / 600 / navy) and a when-line (13 / muted).

### 6.14 Person chip / avatar

- **Avatar:** a 40px circle with initials (700), `bg-blue-tint text-navy`. Photos, when there are
  any, use `rounded-full object-cover`.
- **Chip** (filter): a leaf pill with avatar + nickname. Selected = `bg-navy text-white`; rest =
  `border border-line`; hover = `border-navy`. It is a toggle: `aria-pressed`.

### 6.15 Password prompt

Shown in place of a locked page's content; the banner, header and footer stay, so the menu still
works.

- **Anatomy:** an outline card (`max-w-md`, centred): lily (40px, navy), then a `Chránený obsah`
  eyebrow, then an H3-size heading saying who the page is for, then one line saying the browser will
  remember the password, then a labelled password field, then a full-width primary button
  „Odomknúť“.
- **Field:** `min-h-11`, 2px `navy` border, `rounded-xl`, autofocused, with
  `autocomplete="current-password"` so password managers work.
- **States:**
  - **Checking:** the button reads „Overujem…“ and is disabled.
  - **Wrong password:** the border turns `#8a1c1c`, an error line appears under the field
    (`role="alert"`), the typed text is selected for retyping.
  - **Checking a stored password** on arrival: a quiet „Overujem prístup…“ status line, with no
    card. This avoids flashing the prompt at someone who is already unlocked.

### 6.16 Tabs

Switch between views of the same thing (a checklist and its history) without leaving the page.

- **Anatomy:** a row of tab buttons on a 1px `line` bottom rule, then the active panel (`pt-8`).
  Labels are 15px / 600 / navy, in sentence case and short (one or two words).
- **Active:** a 3px `yellow` bottom bar, like the active header link. **Hover:** a faint
  white wash. On narrow screens the row scrolls sideways instead of wrapping.
- **Behaviour:** the WAI-ARIA tabs pattern: `role="tablist"`, `tab` and `tabpanel`, with
  `aria-selected`. ←/→ move between tabs, and Home/End jump to the first or last. Only the active tab
  is in the Tab order.
- **Panels stay mounted** (just `hidden`), so a tab keeps its state (filters, scroll, loaded data)
  while another is open. A panel that shows live data reloads when it is opened.

---

## 7. The lily (ľalia)

- **Source:** the SLSK lily outline in [`public/favicon.svg`](public/favicon.svg), a single-path
  vector of the current mark. It is rendered inline by the `Lily` component so it can take
  `currentColor`.
  - The full logo (lily + "Slovenský skauting" lettering) exists only as PNG on the brand sites, so
    use it only where the full lockup is required, from
    `brand.skaut.sk/wp-content/uploads/skauting-brand-logo-zaklad-640.png`.
- **Colours:** navy on white; white on navy; navy on a yellow disc (hero). Never blue on yellow, and
  never recoloured into off-palette colours.
- **Clear space:** at least ½ of the lily's width on every side. Minimum size: 20px.
- **Motion:** on the homepage hero the lily turns slowly around its vertical axis ("turntable",
  `rotateY` 0→360°, 12s, linear, infinite). Under `prefers-reduced-motion: reduce` it stands still.
  Never spin it in-plane (it reads as a loading spinner), and never animate it anywhere but the
  hero.

---

## 8. Interaction, motion and accessibility

- **Focus:** `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy`.
  On navy surfaces use `outline-yellow`. Never remove focus styles.
- **Motion:** 150–250ms, `ease-out`, on `color`, `background-color`, `border-color`, `transform`,
  `opacity`. No motion that conveys information by itself. Everything decorative stops under
  `motion-reduce:`.
- **Targets:** at least 44×44px for anything tappable on touch.
- **Semantics:** one `<h1>` per page; landmarks (`header`, `nav`, `main`, `footer`); `lang="sk"`.
- **Icons:** inline SVG, 24px grid, 2px stroke, `stroke="currentColor"`, `aria-hidden` unless they
  are the only label. No icon-font or icon-library dependency.
- **Images:** meaningful ones get Slovak `alt` text; decorative ones get `alt=""`.

---

## 9. Voice and content

- **Slovak**, informal **"ty"** form (the readers are colleagues), short and concrete.
- Sentence case everywhere: headings, buttons, nav.
- Abbreviations as the organisation writes them: N-SLSK, Ú-SLSK, SLSK, Malý snem, Skautský snem.
- Dates as `6. – 8. 11. 2026`; times as `18:00`.
- Call people by their scout nickname (Funo, Barča, Zved…), and by role where a name isn't the point.
- Mock or draft content is labelled (see §6.10). Never present a placeholder as a fact.

---

## 10. Do / don't

| Do                               | Don't                                         |
| -------------------------------- | --------------------------------------------- |
| One yellow highlight per view    | Yellow text on white, yellow borders on white |
| Navy headings, ink body          | Blue body text or blue headings               |
| Leaf radius on interactive pills | Leaf radius on cards, images or containers    |
| Flat bands to separate content   | Drop shadows on resting cards                 |
| Georama only                     | A second display face                         |
| Label mock content               | Ship placeholder text unlabelled              |

---

## 11. Tailwind tokens

These are mirrored in [`src/app/(web)/web.css`](<src/app/(web)/web.css>). Tailwind v4 is
configured in CSS; there is no `tailwind.config`.

```css
@theme {
  --color-navy: #002855;
  --color-navy-700: #003a75;
  --color-blue: #00b5e2;
  --color-blue-ink: #0077a8;
  --color-blue-tint: #e9f5fc;
  --color-yellow: #ffcd00;
  --color-yellow-600: #e6b800;
  --color-yellow-tint: #fff6cc;
  --color-purple: #702f8a;
  --color-green: #2f7a2b;
  --color-ink: #363332;
  --color-muted: #626262;
  --color-line: #ebebeb;
  --color-surface: #f7f7f7;

  --font-sans: var(--font-georama), system-ui, -apple-system, 'Segoe UI', sans-serif;

  --text-display: 4rem;
  --text-display--line-height: 1.05;
  --text-h1: 3rem;
  --text-h1--line-height: 1.1;
  --text-h2: 2.25rem;
  --text-h2--line-height: 1.2;
  --text-h3: 1.75rem;
  --text-h3--line-height: 1.3;
  --text-h4: 1.375rem;
  --text-h4--line-height: 1.4;
  --text-lead: 1.125rem;
  --text-lead--line-height: 1.7;

  --radius-leaf: 14px 35px 35px 14px;
  --radius-leaf-r: 35px 14px 14px 35px;
  --radius-card: 24px;
  --radius-media: 12px;

  --shadow-float: 0 15px 30px rgba(1, 7, 39, 0.13);
}
```

The mobile type sizes are applied in the components (`text-h2 max-md:text-[1.75rem]`), not
as separate tokens.

---

## 12. Sources and what was taken

| Site                             | Stack                 | Taken                                                                                                                                                                                                               | Left behind                                                                       |
| -------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **snem.skauting.sk** (preferred) | WordPress + BeTheme   | Palette (navy `#002855`, blue `#00b5e2`, yellow `#ffcd00`), Georama, 1080px container, white airy layout, yellow active-menu underline, yellow arrow bullets, yellow timeline, navy/yellow info tiles, pill buttons | Bellota italic, BeTheme green `#72bf44`, the h1 < h2 inversion, uppercase buttons |
| **sluzba.skauting.sk**           | WordPress + BeTheme   | Component vocabulary: leaf buttons (`14px 35px 35px 14px`) with hover-fill, leaf section labels, outlined cards, split 50/50 section backgrounds, CTA bands, counters                                               | Red / pink / beige palette, 900-weight headings, the Inter menu face              |
| **skauting.sk**                  | WordPress + Newspaper | Brand confirmation (same navy/blue, Georama, leaf radii `11px 50px 50px 11px` on banners), purple `#702F8A` for safeguarding, 12px image radius                                                                     | Magazine density, sky-blue dominance, TheSans / Open Sans / Roboto                |

**Brand manual:** [brand.skaut.sk](https://brand.skaut.sk) has the official colours, typography and
logo pages, but they are behind a member login, so the values above are taken from the live sites'
CSS. Re-check them against the manual when someone with access can.

> ⚠ **Security note:** at the time of writing (10/2026), the public homepage of brand.skaut.sk
> contains injected spam links (online-casino SEO spam). Report this to komunikacia@skauting.sk.
