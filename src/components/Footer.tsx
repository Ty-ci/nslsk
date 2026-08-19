import { candidates } from '../content.ts'

const Footer = () => (
  <footer className="band-ink text-cream">
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14 md:flex-row md:items-end md:justify-between">
      <div className="flex items-center gap-4">
        <img src="/favicon.svg" alt="" aria-hidden="true" className="w-12 animate-spin-slow" />
        <p className="font-display text-3xl leading-none text-cream uppercase">
          {candidates.map((candidate) => candidate.name).join(' · ')}
        </p>
      </div>

      <p className="font-mono text-[11px] leading-relaxed tracking-wide text-cream/50 uppercase">
        Kandidatúra do Náčelníctva SLSK
        <br />
        Skautský snem 2026
      </p>
    </div>
  </footer>
)

export default Footer
