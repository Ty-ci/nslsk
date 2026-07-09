import Pill from '../components/Pill.tsx'
import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import { candidates } from '../content.ts'
import { accentAt } from '../theme.ts'

const Kandidati = () => (
  <Section className="bg-cream">
    <SectionIntro
      eyebrow="Kandidáti"
      title="Štyria ľudia, jeden tím"
      lead="Kandidujeme spoločne — jedna na náčelníčku a traja na členov Náčelníctva SLSK. Každý z nás prináša svoju tému, ale program si stojíme za celý."
    />

    <div className="mt-12 grid gap-6 sm:grid-cols-2">
      {candidates.map((candidate, i) => {
        const accent = accentAt(i)

        return (
          <article
            key={candidate.name}
            className="group flex flex-col rounded-3xl border border-navy/10 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex size-16 shrink-0 rotate-3 items-center justify-center rounded-2xl font-heading text-xl font-bold text-white transition-transform duration-200 group-hover:rotate-0 ${accent.solid}`}
              >
                {candidate.initials}
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-navy">{candidate.name}</h3>
                <p className="text-sm text-navy/60">
                  prez. {candidate.scoutName} · {candidate.troop}
                </p>
              </div>
            </div>

            <Pill className={`mt-5 px-3 py-1 text-sm ${accent.soft} ${accent.text}`}>
              {candidate.role}
            </Pill>

            <p className="mt-4 text-navy/80">{candidate.bio}</p>

            <p className="mt-4 border-t border-navy/10 pt-4 text-sm text-navy/60">
              <span className="font-semibold text-navy/80">Preferované témy:</span>{' '}
              {candidate.focus}
            </p>
          </article>
        )
      })}
    </div>
  </Section>
)

export default Kandidati
