# nslsk

The internal infoweb of the **Náčelníctvo Slovenského skautingu** (2026–2029), for the Náčelníctvo,
the Ústredie and the support teams. Built with **Next.js (App Router) + React + TypeScript + Tailwind
CSS**, with Google Sheets as the CMS.

It is two sites in one app:

- **The infoweb** at `/`: the current site. Its visual language is specified in
  [`DESIGN_SPECS.md`](DESIGN_SPECS.md); build anything new from that.
- **The archive** at `/archiv/kandidatka2026`: the 2026 candidacy one-pager „Spolu do toho!“,
  frozen as it was. The old `/otazky` and `/dev` paths redirect into it (`next.config.mjs`).

Each site has **its own root layout and its own stylesheet**, so neither design can leak into the
other. There is deliberately no top-level `src/app/layout.tsx`. Moving between the two is a full
page load.

## Getting started

```bash
npm install      # first time only
npm run dev      # start the dev server at http://localhost:3000
```

## Layout

```
DESIGN_SPECS.md                   design system of the infoweb (tokens, components, rules)
google-apps-script/changelog.gs   logs manual spreadsheet edits (paste into the sheet's Apps Script)
src/
  lib/navigation.ts               every route: menu label + which password keys view / edit it
  lib/access/                     the password gate
    check.ts                      checks a password against the `keys` tab (server-only)
    actions.ts                    server action the prompt calls
    client.ts                     localStorage + useAccess() hook for the gates
  lib/changelog/                  the `changelog` tab: logChange(), readChangelog()
  lib/google-sheets/              shared, server-only Google Sheets access
    spreadsheet.ts                the site's spreadsheet ID, links to its tabs
    client.ts                     service-account auth, getValues(), updateValues(), appendValues()
    cells.ts                      header matching and cell helpers
  app/
    robots.ts                     /robots.txt: disallow everything (internal web)
    (web)/                        THE INFOWEB (route group: no URL segment)
      layout.tsx                  root layout: <html>, Georama, header, footer, noindex
      web.css                     Tailwind entry point + design tokens (DESIGN_SPECS.md §11)
      page.tsx                    / — homepage
      not-found.tsx, [...slug]/   404 for every unmatched path
      _components/                design-system primitives (Button, Section, Lily, AccessGate, …)
      _data/people.ts             the Náčelníctvo: nicknames and areas
      onboarding/                 /onboarding — sheet-backed checklist
        page.tsx                  intro + stepper, then tabs: Checklist | História zmien
        actions.ts                server actions: checklist, its history, tick/untick a cell
        _lib/sheet.ts             reads/writes the `onboarding` tab (server-only)
        _data/seed.json           mock tasks, shown read-only if the sheet can't be read
        _data/phases.ts           the onboarding timeline
        _components/              checklist UI
    archiv/kandidatka2026/        THE ARCHIVE (own root layout)
      layout.tsx, archive.css     the poster look, scoped to the archive
      page.tsx                    the one-pager
      api/content/route.ts        GET /archiv/kandidatka2026/api/content (Q&A + events)
      _services/content.ts        parses the candidacy sheet (server-only)
      _components/ _sections/ _hooks/ _lib/ _data/
```

Each stylesheet uses `@import 'tailwindcss' source('.')`, so it only scans its own folder for
classes. ESLint's Tailwind rules check each folder against its own stylesheet
(`eslint.config.mjs`).

## Access: passwords from the sheet

Every page except the homepage is behind a password. Which route needs which key is set in one
place, [`src/lib/navigation.ts`](src/lib/navigation.ts). A path not listed there is locked with
`whole-web-view`, so a forgotten entry hides a page rather than exposing it.

The passwords live in the **`keys`** tab (header on row 3: `Key | Value | Note`). A key's `Value`
is its password; change it in the sheet and it applies within a minute. Each route names two keys:
`access` to see it (`whole-web-view`) and `edit` to change what it shows (`whole-web-edit`). Today
the only editable content is the onboarding checklist. The tab also holds `onboarding-view` and
`onboarding-edit`, ready to be wired in: add the name to `accessKeys` and assign it to a route.

How it works:

- On a locked page the browser asks for the password once. The server checks it against the sheet,
  and on success it is kept in `localStorage`. Later visits check the stored password with the
  server quietly, and the prompt comes back only if it stopped working.
- The page layout only _hides_ locked pages in the browser. What is actually protected is the
  sheet data: the onboarding checklist and the archive's Q&A are sent only to requests that carry
  a valid password (server actions and the archive API check it every time). Text written into a
  page's code ships with it, so don't put anything secret there.
- Editable content is read-only until the edit password is entered, in a „Povoliť úpravy“ form
  above it. It is remembered the same way, and the server action that writes to the sheet checks
  it on every change, so the view password alone can't tick boxes.
- Passwords are stored in plain text in the browser. That is enough for an internal web with mock
  content, not for sensitive data.

## Where the content lives

All of it is in one spreadsheet ([`src/lib/google-sheets/spreadsheet.ts`](src/lib/google-sheets/spreadsheet.ts)),
shared with the service account as **Editor** (the site writes ticks back).

### Infoweb: onboarding checklist

The tab **`onboarding`**. Rows 1–2 are instructions and **row 3 is the header**:

| ID  | Fáza | Úloha | Popis | Zodpovedný | Termín | Tím | Funo | Barča | Biely Medveď | Green | Kolohnáth | Zved | Žubro | Zdroj | Dôležitosť |
| --- | ---- | ----- | ----- | ---------- | ------ | --- | ---- | ----- | ------------ | ----- | --------- | ---- | ----- | ----- | ---------- |

- Under `Tím` and each person: `1` = done, `0` = to do, empty = the task isn't theirs. The site
  writes `1`/`0`, and refuses to tick an empty cell.
- `ID` must be unique and stable: ticks from the site are written to the row with that ID.
- `Fáza` should be one of the labels in `onboarding/_data/phases.ts`; anything else is listed under
  „Ostatné“.
- Columns are found by their header (case and diacritics don't matter), so they can be reordered.

If the sheet can't be read, the page shows `seed.json` read-only, with a note saying so.

### Changelog

The tab **`changelog`** (header on row 3: `Timestamp | Route | Change | Note (manual)`) records
every change to the checklist. The onboarding page shows the rows whose `Route` is `/onboarding`
in its „História zmien“ tab. Rows come from two writers:

- **The website** logs each tick and untick itself, tagged `[web]`.
- **Edits made by hand** in the spreadsheet are logged by an Apps Script, tagged `[tabuľka]`.
  Install it once: open the spreadsheet, go to Extensions → Apps Script, paste
  [`google-apps-script/changelog.gs`](google-apps-script/changelog.gs) and save. It is a simple
  `onEdit` trigger, so there's nothing else to set up. Google doesn't run it for the website's
  own API writes, so nothing is logged twice. It can't see inserted or deleted rows, or sorting.
  Edits to one task row within 10 minutes of each other become a single entry
  (`„Úloha“ — Funo: hotovo; Termín: „…“ → „…“`), rewritten with each edit; a Note on the entry
  closes it, and the next edit starts a new one. After changing the script, paste it again.

`Note (manual)` is for people: anything written there shows under the change on the page. Keep the
spreadsheet's time zone (File → Settings) on Bratislava so both writers' timestamps line up.

### Archive: candidacy Q&A and events

The tabs filled by the candidacy's Q&A form:

- sheet `otazky`: questions from the form and the answers next to them. A row is published only
  when its `Zverejniť?` checkbox is ticked, and the asker's name only when their consent column
  allows it. `Odpoveď` is Markdown.
- sheet `eventy`: meeting slots (`Názov`, `Forma`, `Termín`, `Popis`). `Popis` is Markdown.
- In both sheets the header is the **third** row.

It is read by `archiv/kandidatka2026/_services/content.ts` and served from
`/archiv/kandidatka2026/api/content`, cached for a minute. The endpoint wants the archive's
password (URI-encoded, in the `x-access-key` header). Private columns never leave the server.

### Environment

In `.env.local` for local development and in the Netlify site settings for deploys:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL = …@….iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----\n
GOOGLE_SHEET_ID = …            # optional; defaults to the site's spreadsheet (e.g. a copy for dev)
```

None of them is `NEXT_PUBLIC_`-prefixed, so none can end up in the browser bundle.

## Deployment

Netlify, via [`@netlify/plugin-nextjs`](https://github.com/opennextjs/opennextjs-netlify): the plugin
maps the App Router's routes, route handlers, server actions and static assets onto Netlify's own
primitives, so [`netlify.toml`](netlify.toml) declares no redirects or functions of its own.

## Scripts

```bash
npm run build      # production build (also runs eslint and tsc)
npm run start      # serve the production build
npm run lint       # eslint
npm run lint:fix   # eslint --fix
npm run typecheck  # tsc --noEmit
npm run prettier   # format
```
