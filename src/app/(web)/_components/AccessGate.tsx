'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import Eyebrow from '@/app/(web)/_components/Eyebrow'
import Lily from '@/app/(web)/_components/Lily'
import PasswordForm from '@/app/(web)/_components/PasswordForm'
import Section from '@/app/(web)/_components/Section'
import { useAccess } from '@/lib/access/client'

// The password prompt (DESIGN_SPECS.md §6.15), in place of a locked page.
const PasswordPrompt = ({ onUnlock }: { onUnlock: (password: string) => Promise<boolean> }) => (
  <Section py="py-16 md:py-24" labelledBy="access-title">
    <div className="mx-auto max-w-md rounded-card border border-line bg-white p-6 md:p-10">
      <Lily className="size-10 text-navy" />
      <Eyebrow className="mt-6">Chránený obsah</Eyebrow>
      <h1 id="access-title" className="mt-4 text-h3 font-semibold max-md:text-[1.375rem]">
        Táto časť webu je len pre Náčelníctvo, Ústredie a podporné tímy
      </h1>
      <p className="mt-3 text-sm/6">
        Zadaj heslo — tento prehliadač si ho zapamätá, takže sa ťa nabudúce nebude pýtať.
      </p>

      <PasswordForm
        className="mt-6"
        onUnlock={onUnlock}
        submitLabel="Odomknúť"
        // The prompt is the only thing on the page — start typing at once.
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
    </div>
  </Section>
)

/**
 * Shows the page only once the key it needs (see `src/lib/navigation.ts`) is
 * unlocked. Wraps the content, not the header and footer, so the menu stays
 * usable on a locked page.
 */
const AccessGate = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const { state, unlock } = useAccess(pathname)

  if (state === 'open') {
    return <>{children}</>
  }

  if (state === 'checking') {
    return (
      <Section py="py-24">
        <p role="status" className="text-center text-sm text-muted">
          Overujem prístup…
        </p>
      </Section>
    )
  }

  return <PasswordPrompt onUnlock={unlock} />
}

export default AccessGate
