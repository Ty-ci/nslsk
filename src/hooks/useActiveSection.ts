import { useEffect, useState } from 'react'

/**
 * Tracks which section is currently in view so the nav can highlight it.
 * `ids` must be a stable reference (define it at module scope).
 */
export const useActiveSection = (ids: string[]) => {
  const [activeId, setActiveId] = useState(ids[0] ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      // Trigger when a section crosses the middle of the viewport.
      { rootMargin: '-40% 0px -55% 0px' },
    )

    ids.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [ids])

  return activeId
}
