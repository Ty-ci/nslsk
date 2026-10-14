'use client'

import { usePathname } from 'next/navigation'
import { type ReactNode, type SubmitEvent, useId, useState } from 'react'

import Button from '@/app/archiv/kandidatka2026/_components/Button'
import Label from '@/app/archiv/kandidatka2026/_components/Label'
import Section from '@/app/archiv/kandidatka2026/_components/Section'
import { offsetStatic } from '@/app/archiv/kandidatka2026/_lib/theme'
import { useAccess } from '@/lib/access/client'

// The same password gate as the infoweb's (the logic lives in
// `src/lib/access/client.ts`), dressed in the archive's poster look.
const PasswordPrompt = ({ onUnlock }: { onUnlock: (password: string) => Promise<boolean> }) => {
  const inputId = useId()
  const errorId = useId()
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const input = event.currentTarget.elements.namedItem('password') as HTMLInputElement
    setIsPending(true)
    setError('')

    const granted = await onUnlock(password).catch(() => false)
    if (!granted) {
      setError('Nesprávne heslo, alebo sa ho teraz nepodarilo overiť. Skús to znova.')
      setIsPending(false)
      input.select()
    }
  }

  return (
    <Section>
      <div className={`mx-auto max-w-lg bg-cream-light p-6 md:p-10 ${offsetStatic}`}>
        <Label className="text-brand">Archív · chránený obsah</Label>
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-ink uppercase md:text-5xl">
          Zadaj heslo
        </h1>
        <p className="mt-4 text-ink/75">
          Archív kandidatúry je len pre Náčelníctvo, Ústredie a podporné tímy. Tento prehliadač si
          heslo zapamätá.
        </p>

        <form className="mt-6" onSubmit={(event) => void submit(event)}>
          <label htmlFor={inputId} className="block label text-ink">
            Heslo
          </label>
          <input
            id={inputId}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            // The prompt is the only thing on the page — start typing at once.
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={error !== '' || undefined}
            aria-describedby={error ? errorId : undefined}
            className="mt-2 block w-full border-2 border-ink bg-cream px-3 py-2.5 text-ink outline-none focus-visible:border-brand"
          />
          {error ? (
            <p id={errorId} role="alert" className="mt-2 text-sm font-bold text-brand-dark">
              {error}
            </p>
          ) : null}

          <Button type="submit" variant="sun" className="mt-6" disabled={isPending}>
            {isPending ? 'Overujem…' : 'Odomknúť'}
          </Button>
        </form>
      </div>
    </Section>
  )
}

/** Shows the archive only once its key (see `src/lib/navigation.ts`) is unlocked. */
const AccessGate = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname()
  const { state, unlock } = useAccess(pathname)

  if (state === 'open') {
    return <>{children}</>
  }

  if (state === 'checking') {
    return (
      <Section>
        <p role="status" className="text-center label text-ink/60">
          Overujem prístup…
        </p>
      </Section>
    )
  }

  return <PasswordPrompt onUnlock={unlock} />
}

export default AccessGate
