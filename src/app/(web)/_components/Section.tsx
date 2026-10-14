import type { ReactNode } from 'react'

import Container from '@/app/(web)/_components/Container'

type Tone = 'white' | 'surface' | 'navy'

type SectionProps = {
  children: ReactNode
  id?: string
  tone?: Tone
  /** Vertical padding override, e.g. a hero's taller `py-*`. */
  py?: string
  /** Labels the band for screen readers — pass the id of its heading. */
  labelledBy?: string
}

const tones: Record<Tone, string> = {
  white: 'bg-white',
  surface: 'bg-surface',
  navy: 'bg-navy text-white [&_h2]:text-white [&_h3]:text-white',
}

// A full-bleed band with the page column inside. Bands, not shadows, are what
// separate content groups (DESIGN_SPECS.md §6.5).
const Section = ({
  children,
  id,
  tone = 'white',
  py = 'py-16 md:py-24',
  labelledBy,
}: SectionProps) => (
  <section id={id} aria-labelledby={labelledBy} className={`${tones[tone]} ${py}`}>
    <Container>{children}</Container>
  </section>
)

export default Section
