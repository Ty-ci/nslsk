import { Link } from 'react-router-dom'

import { candidates, qa } from '../content.ts'
import { qaPath, sectionPath } from '../navigation.ts'

const linkClass = 'label text-cream/70 transition-colors hover:text-cream'

// Colophon, the way a poster prints its imprint along the bottom edge: one rule,
// the wordmark, a short line of links, and who is on the ballot. Nothing turns,
// nothing animates — it is printed.
const Footer = () => (
  <footer className="band-ink text-cream">
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="flex flex-col gap-6 border-b-2 border-cream/25 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <img src="/favicon.svg" alt="" aria-hidden="true" className="w-10 shrink-0" />
          <p className="font-display text-3xl leading-none text-cream uppercase">Spolu do toho</p>
        </div>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to={qaPath} className={linkClass}>
            Otázky a odpovede
          </Link>
          <Link to={sectionPath('stretnutia')} className={linkClass}>
            Stretnime sa
          </Link>
          <a href={qa.formHref} target="_blank" rel="noreferrer" className={linkClass}>
            Napísať otázku ↗
          </a>
        </nav>
      </div>

      <p className="mt-6 font-mono text-[11px] leading-relaxed tracking-wide text-cream/55 uppercase">
        {candidates.map((candidate) => candidate.name).join(' · ')} — kandidáti do Náčelníctva SLSK
        · Rozhoduje Skautský snem 2026 · Obsah dopĺňame priebežne
      </p>
    </div>
  </footer>
)

export default Footer
