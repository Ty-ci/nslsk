'use client'

import { type ReactNode, useId, useState } from 'react'

import Button from '@/app/(web)/_components/Button'
import PasswordForm from '@/app/(web)/_components/PasswordForm'

type EditUnlockProps = {
  /** Says what is read-only and what the password allows. */
  children: ReactNode
  onUnlock: (password: string) => Promise<boolean>
  className?: string
}

// Shown over editable content while the edit password (`whole-web-edit`, see
// `src/lib/navigation.ts`) isn't entered: a note, and a button that opens the
// password form in place. Viewing needs no more than the page's own password.
const EditUnlock = ({ children, onUnlock, className = '' }: EditUnlockProps) => {
  const formId = useId()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`rounded-card bg-blue-tint p-4 text-sm/6 text-navy ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p>{children}</p>
        <Button
          variant="outline"
          size="sm"
          aria-expanded={isOpen}
          aria-controls={formId}
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? 'Zavrieť' : 'Povoliť úpravy'}
        </Button>
      </div>

      {isOpen ? (
        <div id={formId} className="mt-4 max-w-sm">
          <p>Zadaj heslo na úpravy — tento prehliadač si ho zapamätá.</p>
          <PasswordForm className="mt-4" onUnlock={onUnlock} submitLabel="Povoliť úpravy" />
        </div>
      ) : null}
    </div>
  )
}

export default EditUnlock
