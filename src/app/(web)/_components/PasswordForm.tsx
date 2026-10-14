'use client'

import { type SubmitEvent, useId, useState } from 'react'

import Button from '@/app/(web)/_components/Button'

type PasswordFormProps = {
  onUnlock: (password: string) => Promise<boolean>
  /** The button's label; it reads „Overujem…“ while the password is checked. */
  submitLabel: string
  /** Focus the field at once — when the form is the thing the person came for. */
  autoFocus?: boolean
  className?: string
}

// The password field and its button (DESIGN_SPECS.md §6.15). A wrong password
// keeps what was typed, says so, and puts the focus back for another try.
const PasswordForm = ({
  onUnlock,
  submitLabel,
  autoFocus = false,
  className,
}: PasswordFormProps) => {
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
    <form className={className} onSubmit={(event) => void submit(event)}>
      <label htmlFor={inputId} className="block text-sm font-semibold text-navy">
        Heslo
      </label>
      <input
        id={inputId}
        name="password"
        type="password"
        autoComplete="current-password"
        required
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        aria-invalid={error !== '' || undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 block min-h-11 w-full rounded-xl border-2 border-navy bg-white px-4 text-base text-ink focus-ring aria-invalid:border-[#8a1c1c]"
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-sm font-semibold text-[#8a1c1c]">
          {error}
        </p>
      ) : null}

      <Button type="submit" className="mt-6 w-full" disabled={isPending}>
        {isPending ? 'Overujem…' : submitLabel}
      </Button>
    </form>
  )
}

export default PasswordForm
