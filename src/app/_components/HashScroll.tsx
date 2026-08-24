'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Scrolls to the `#section` in the URL on a client-side navigation. On a full
 * page load the browser does this itself, but arriving from the Q&A page as
 * `/#temy` is a router navigation, and the hash isn't part of the route.
 */
const HashScroll = () => {
  const pathname = usePathname()

  useEffect(() => {
    const { hash } = window.location
    if (!hash) {
      return
    }

    document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [pathname])

  return null
}

export default HashScroll
