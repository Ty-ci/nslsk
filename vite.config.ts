import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import { defineConfig, loadEnv } from 'vite'

/**
 * Serves `/api/content` during `npm run dev` using the very same module the
 * Netlify function uses in production, so local and deployed content can't
 * drift. Credentials come from `.env.local` (they are not `VITE_`-prefixed, so
 * they stay server-side and never reach the bundle).
 */
const sheetContentApi = (env: Record<string, string>): Plugin => ({
  name: 'nslsk-sheet-content-api',
  apply: 'serve',
  configureServer(server) {
    Object.assign(process.env, env)

    server.middlewares.use('/api/content', (_request, response) => {
      void (async () => {
        response.setHeader('content-type', 'application/json')

        try {
          // Loaded through Vite so the function's TypeScript is transformed,
          // and re-loaded per request so edits to it apply without a restart.
          const { loadSheetContent } = (await server.ssrLoadModule(
            '/netlify/lib/sheets.mts',
          )) as typeof import('./netlify/lib/sheets.mts')

          response.end(JSON.stringify(await loadSheetContent()))
        } catch (error) {
          server.config.logger.error(`/api/content failed: ${String(error)}`)
          response.statusCode = 502
          response.end(JSON.stringify({ error: 'Content is temporarily unavailable.' }))
        }
      })()
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), sheetContentApi(loadEnv(mode, process.cwd(), ''))],
}))
