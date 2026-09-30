'use client'

import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'

type ClampProps = {
  children: ReactNode
  className?: string
}

// Sheet text can run long, and one wordy entry shouldn't push the rest of the
// list off the screen. Anything past three lines is folded away behind a quiet
// toggle; shorter text prints as-is, with no toggle at all.
//
// Whether the text overflows can only be known once it is laid out, so the
// clamp is always applied while collapsed and measured against itself — and
// re-measured whenever the box changes width and the text rewraps.
const Clamp = ({ children, className = '' }: ClampProps) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)

  useLayoutEffect(() => {
    const content = contentRef.current
    if (!content || isExpanded) return undefined

    const measure = () => setIsOverflowing(content.scrollHeight > content.clientHeight + 1)
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(content)

    return () => observer.disconnect()
  }, [isExpanded, children])

  return (
    <div className={className}>
      <div ref={contentRef} className={isExpanded ? '' : 'line-clamp-3'}>
        {children}
      </div>

      {(isOverflowing || isExpanded) && (
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((expanded) => !expanded)}
          className="mt-2 cursor-pointer label text-ink/50 underline decoration-ink/25 decoration-1 underline-offset-4 transition-colors hover:text-brand hover:decoration-brand"
        >
          {isExpanded ? 'Zobraziť menej' : 'Zobraziť viac'}
        </button>
      )}
    </div>
  )
}

export default Clamp
