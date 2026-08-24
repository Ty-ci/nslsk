'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Scrolls to the `#section` in the URL after the page mounts. The browser does
 * this itself on a plain load, but not when the target is a block that only
 * appears once the sheet content arrives — and not on a client-side navigation,
 * where the hash isn't part of the route.
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
