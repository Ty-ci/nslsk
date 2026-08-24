import { redirect } from 'next/navigation'

// Anything that isn't the one-pager or the Q&A page — an old link, a typo —
// lands on the one-pager, the way the router's catch-all route used to.
//
// This is a route rather than `not-found.tsx` on purpose: a `redirect()` from
// the not-found boundary answers 404 and no browser follows it, whereas an
// unmatched route sends a real redirect.
const CatchAll = () => {
  redirect('/')
}

export default CatchAll
