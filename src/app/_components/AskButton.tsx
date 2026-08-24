'use client'

import { type ReactNode, useState } from 'react'

import Button, { type ButtonSize, type ButtonVariant } from '@/app/_components/Button'
import Modal from '@/app/_components/Modal'
import { qa } from '@/app/_data/content'

/**
 * The Google Form, asked to render without its own page chrome. Everything else
 * on the site is one page, so the form shouldn't be the one thing that sends
 * people away — especially when the answer comes back onto this very page.
 */
const embedHref = `${qa.formHref}${qa.formHref.includes('?') ? '&' : '?'}embedded=true`

type AskButtonProps = {
  children?: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

const AskButton = ({
  children = 'Napísať otázku',
  variant = 'sun',
  size = 'md',
  className,
}: AskButtonProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button variant={variant} size={size} className={className} onClick={() => setIsOpen(true)}>
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Máte otázku pre nás?">
        {/* Mounted only while the modal is open, so nobody pays for Google's
            form on a page view that never asks anything. */}
        {isOpen && (
          <iframe
            src={embedHref}
            title="Dotazník — otázka pre kandidátov"
            loading="lazy"
            className="block h-[min(65dvh,38rem)] w-full border-0 bg-cream"
          />
        )}

        {/* Embedded third-party frames are a thing browsers and extensions
            block, so the way out stays visible. */}
        <p className="border-t-2 border-dashed border-ink/25 px-5 py-4 font-mono text-[11px] leading-relaxed text-ink/55 uppercase md:px-6">
          Formulár sa nezobrazuje?{' '}
          <a
            href={qa.formHref}
            target="_blank"
            rel="noreferrer"
            className="text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand"
          >
            Otvorte ho v novom okne ↗
          </a>
        </p>
      </Modal>
    </>
  )
}

export default AskButton
