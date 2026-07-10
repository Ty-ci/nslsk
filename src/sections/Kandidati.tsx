import Pill from '../components/Pill.tsx'
import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import { candidates } from '../content.ts'
import { inkAt, offsetCard } from '../theme.ts'

const Kandidati = () => (
  <Section>
    <SectionIntro
      index="01"
      eyebrow="Kandidáti"
      title="Štyria ľudia, jeden tím"
      lead="Kandidujeme spoločne — jedna na náčelníčku a traja na členov Náčelníctva SLSK. Každý z nás prináša svoju tému, ale program si stojíme za celý."
    />

    <div className="mt-14 grid gap-8 sm:grid-cols-2">
      {candidates.map((candidate, i) => {
        const ink = inkAt(i)

        return (
          <article key={candidate.name} className={`flex flex-col bg-cream p-6 ${offsetCard}`}>
            <div className="flex items-start gap-4">
              {/* Squared initials block — a printed candidate portrait stand-in. */}
              <div
                className={`flex size-16 shrink-0 items-center justify-center border-2 border-ink font-display text-2xl ${ink.solid} ${ink.onSolid}`}
              >
                {candidate.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-brand">
                    {String(i + 1).padStart(2, '0')} / {String(candidates.length).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-1 font-heading text-2xl leading-none font-bold text-ink uppercase">
                  {candidate.name}
                </h3>
                <p className="mt-1 font-mono text-[11px] tracking-wide text-ink/55 uppercase">
                  prez. {candidate.scoutName} · {candidate.troop}
                </p>
              </div>
            </div>

            <Pill className={`mt-5 px-3 py-1 ${ink.border} ${ink.text}`}>{candidate.role}</Pill>

            <p className="mt-4 text-ink/80">{candidate.bio}</p>

            <p className="mt-5 border-t-2 border-dashed border-ink/25 pt-4 font-mono text-[11px] leading-relaxed text-ink/60 uppercase">
              <span className="text-ink">Témy —</span> {candidate.focus}
            </p>
          </article>
        )
      })}
    </div>
  </Section>
)

export default Kandidati
