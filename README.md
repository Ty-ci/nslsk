# nslsk

A mostly static site built with **Next.js (App Router) + React + TypeScript + Tailwind CSS**: a
one-pager whose nav anchors to its sections. There is no second route — the Q&A lives inside the
„Spojme sa" section, under its own `#otazky` anchor.

While the content is being written, the one-pager is parked at **`/dev`** and `/` is just the
turning lily. Every in-page link is therefore hash-only (`#temy`, never `/#temy`), so the anchors
follow the page when it moves back to `/` — see `anchorHref` in
[`src/app/_lib/navigation.ts`](src/app/_lib/navigation.ts).

## Getting started

```bash
npm install      # first time only
npm run dev      # start the dev server at http://localhost:3000
```

## Layout

```
src/app/
  layout.tsx              shell: <html>, metadata and the design tokens
  page.tsx                / — parked: the turning lily, nothing else
  (pages)/dev/layout.tsx  the real shell: header, body, colophon
  (pages)/dev/page.tsx    the one-pager — maps section ids onto components
  [...slug]/page.tsx      catch-all → redirects unknown paths to /
  api/content/route.ts    GET /api/content, the sheet-backed JSON
  _components/            shared UI
  _sections/              the one-pager's sections
  _hooks/                 client-side hooks (scroll-spy, sheet fetch)
  _lib/                   navigation, theme, the /api/content client
  _data/content.ts        hand-written copy
  _services/sheets.ts     server-only Google Sheets reader
  globals.css             Tailwind entry point + the design tokens
```

Section order and the nav menu live in [`src/app/_lib/navigation.ts`](src/app/_lib/navigation.ts);
each id is wired to its component in
[`src/app/(pages)/dev/page.tsx`](<src/app/(pages)/dev/page.tsx>), and the `Record` there makes
TypeScript insist on a component for every entry. `navigation.ts` deliberately imports no
components — the header is a client component, so anything it reached would ship to the browser.

## Where the content lives

- **`src/app/_data/content.ts`** — everything written by hand: candidates, shared topics, copy.
- **The Google Sheet behind the Q&A form** — everything that changes without a deploy:
  - sheet `otazky`: questions from the form plus the answers written next to them. A row is
    published only when its `Zverejniť?` checkbox is ticked, and the asker's name is printed only
    when their own consent column says it may be. `Odpoveď` is rendered as Markdown.
  - sheet `eventy`: the meeting slots in „Spojme sa" (`Názov`, `Forma`, `Termín`, `Popis`).
    `Popis` is rendered as Markdown, so `[text](url)` links work.
  - In both sheets the header is the **third** row; the two rows above it are instructions.

The sheet is read server-side by [`src/app/_services/sheets.ts`](src/app/_services/sheets.ts) (which
imports `server-only`, so it can never be pulled into a client bundle) and served as JSON from
`/api/content` by the route handler in [`src/app/api/content/`](src/app/api/content/). Private
columns — contact details, moderation notes, unpublished rows — never leave the server. Responses are
cached for a minute, so an edit in the sheet shows up on the site within about that long.

### Environment

`/api/content` needs a service account that the spreadsheet is shared with, in `.env.local` for
local development and in the Netlify site settings for deploys:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL = …@….iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----\n
GOOGLE_SHEET_ID = …            # optional, defaults to the live spreadsheet
```

Neither is `NEXT_PUBLIC_`-prefixed, so neither can end up in the browser bundle.

## Deployment

Netlify, via [`@netlify/plugin-nextjs`](https://github.com/opennextjs/opennextjs-netlify): the plugin
maps the App Router's routes, the `/api/content` handler and the static assets onto Netlify's own
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
