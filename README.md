# nslsk

A mostly static site built with **Vite + React + TypeScript + Tailwind CSS**: a one-pager whose nav
anchors to its sections, plus one real route — `/otazky`, the Q&A page.

## Getting started

```bash
npm install      # first time only
npm run dev      # start the dev server at http://localhost:5173
```

## Where the content lives

- **`src/content.ts`** — everything written by hand: candidates, shared topics, copy.
- **The Google Sheet behind the Q&A form** — everything that changes without a deploy:
  - sheet `otazky`: questions from the form plus the answers written next to them. A row is
    published only when its `Zverejniť?` checkbox is ticked, and the asker's name is printed only
    when their own consent column says it may be. `Odpoveď` is rendered as Markdown.
  - sheet `eventy`: the meeting slots in “Stretnime sa” (`Názov`, `Forma`, `Termín`, `Popis`).
    `Popis` is rendered as Markdown, so `[text](url)` links work.
  - In both sheets the header is the **third** row; the two rows above it are instructions.

The sheet is read server-side by `netlify/lib/sheets.mts` and served as JSON from `/api/content`
(the Netlify function in `netlify/functions/`, and an equivalent dev-server route wired up in
`vite.config.ts`). Private columns — contact details, moderation notes, unpublished rows — never
leave the server. Responses are cached for a minute, so an edit in the sheet shows up on the site
within about that long.

### Environment

`/api/content` needs a service account that the spreadsheet is shared with, in `.env.local` for
local development and in the Netlify site settings for deploys:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL = …@….iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY = -----BEGIN PRIVATE KEY-----\n…\n-----END PRIVATE KEY-----\n
GOOGLE_SHEET_ID = …            # optional, defaults to the live spreadsheet
```

Neither is `VITE_`-prefixed, so neither can end up in the browser bundle.

## Scripts

```bash
npm run build      # typecheck (tsc -b) + production build to dist/
npm run lint       # eslint
npm run prettier   # format
```
