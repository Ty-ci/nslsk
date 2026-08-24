'use client'

import { type ReactNode, useEffect, useId, useRef } from 'react'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  /** Printed as the running head, and read out as the dialog's name. */
  title: string
  children: ReactNode
}

// A native `<dialog>`, so the browser does the hard parts: the top layer, the
// focus trap, Escape to dismiss and an inert page behind. What is left is the
// paper — a cream sheet with an ink rule and its offset shadow, on an ink wash.
const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) {
      return
    }

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  // A modal dialog doesn't stop the page behind it from scrolling, and the
  // one-pager is long enough that it would scroll away underneath.
  useEffect(() => {
    if (!isOpen) {
      return
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = overflow
    }
  }, [isOpen])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      // Escape closes it through the browser rather than through us, so the
      // parent's state has to follow the element either way.
      onClose={onClose}
      // The dialog box is exactly its content (`p-0`), so a click that lands on
      // the element itself came from the backdrop.
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose()
        }
      }}
      className="m-auto w-[min(44rem,calc(100vw-1.5rem))] max-w-none border-2 border-ink bg-cream p-0 text-ink shadow-[8px_8px_0_0_var(--color-ink)] backdrop:bg-ink/70 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex max-h-[calc(100dvh-3rem)] flex-col">
        <div className="flex items-center justify-between gap-6 border-b-2 border-ink px-5 py-4 md:px-6">
          <h2 id={titleId} className="font-heading text-2xl leading-none font-bold uppercase">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Zavrieť"
            className="-mr-1 shrink-0 border-2 border-transparent px-2 py-1 font-mono text-base leading-none font-bold text-ink/55 transition-colors hover:border-ink hover:text-ink"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </dialog>
  )
}

export default Modal
