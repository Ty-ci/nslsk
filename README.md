# nslsk

A simple static website built with **Vite + React + TypeScript + Tailwind CSS + React Router**.

## Getting started

```bash
npm install      # first time only
npm run dev      # start the dev server at http://localhost:5173
```

## Scripts

| Command             | What it does                                      |
| ------------------- | ------------------------------------------------- |
| `npm run dev`       | Start the Vite dev server with hot reload         |
| `npm run build`     | Type-check and build the static site into `dist/` |
| `npm run preview`   | Serve the production build locally to verify it   |
| `npm run typecheck` | Type-check without emitting                       |
| `npm run prettier`  | Format all files with Prettier                    |

## Project structure

```
src/
  main.tsx            # entry point — mounts React + Router
  App.tsx             # route definitions
  index.css           # Tailwind entry (@import "tailwindcss")
  components/
    Layout.tsx        # shared header/nav + <Outlet /> for pages
  pages/
    Home.tsx          # landing page
    About.tsx         # static content page
    Playground.tsx    # interactive page (client-side state)
```

Add a page by creating a component in `src/pages/` and registering a
`<Route>` for it in `src/App.tsx`.

## Deploying (Netlify)

`netlify.toml` already declares everything Netlify needs:

- **build command** `npm run build`
- **publish directory** `dist`
- an SPA fallback redirect so React Router deep links / refreshes don't 404

To deploy, connect this repo in the Netlify dashboard (or run
`npx netlify deploy --build`) — no extra configuration required.

## Tailwind

Tailwind v4 is wired in via the `@tailwindcss/vite` plugin (see
`vite.config.ts`) and activated by the single `@import "tailwindcss";` line in
`src/index.css`. No `tailwind.config.js` or PostCSS setup needed — customize
via CSS `@theme` if/when you want to.
