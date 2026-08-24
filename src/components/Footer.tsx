import { candidates } from '../content.ts'
import Field from './Field.tsx'

const Footer = () => (
  <footer className="band-ink text-cream">
    {/* Colophon, the way a poster prints its imprint along the bottom edge.
        Extra bottom padding leaves room for the sticky invite bar. */}
    <div className="mx-auto max-w-6xl px-6 pt-14 pb-24 md:pb-20">
      <div className="flex items-center gap-4">
        <img src="/favicon.svg" alt="" aria-hidden="true" className="w-12 animate-spin-slow" />
        <p className="font-display text-3xl leading-none text-cream uppercase">Spolu do toho</p>
      </div>

      <dl className="mt-10 grid max-w-4xl gap-x-16 gap-y-4 border-t-2 border-cream/25 pt-8 md:grid-cols-2">
        <Field name="Kandidujú" onDark>
          {candidates.map((candidate) => candidate.name).join(' · ')}
        </Field>
        <Field name="Do orgánu" onDark>
          Náčelníctvo SLSK
        </Field>
        <Field name="Rozhoduje" onDark>
          Skautský snem 2026
        </Field>
        <Field name="Stav" onDark>
          dopĺňame priebežne
        </Field>
      </dl>
    </div>
  </footer>
)

export default Footer
