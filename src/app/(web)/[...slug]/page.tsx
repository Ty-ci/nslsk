import { notFound } from 'next/navigation'

// With no top-level root layout, an unmatched URL has nowhere to render a 404
// of its own. This catch-all claims every path no other route does and hands
// it to the infoweb's `not-found.tsx` — with a real 404 status.
const CatchAll = () => notFound()

export default CatchAll
