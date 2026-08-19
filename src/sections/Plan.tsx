import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import { milestones } from '../content.ts'

const Plan = () => (
  <Section className="band-ink text-cream">
    <SectionIntro
      index="04"
      eyebrow="Čo chceme dosiahnuť"
      title="Tri roky, štyri míľniky"
      lead="Aby sa nás dalo priebežne kontrolovať, rozpísali sme program do konkrétnych míľnikov — od prvých sto dní až po koniec funkčného obdobia."
      onDark
    />

    <ol className="mt-14 grid gap-px border-2 border-cream/20 bg-cream/20 md:grid-cols-2 lg:grid-cols-4">
      {milestones.map((milestone, i) => (
        <li key={milestone.horizon} className="flex flex-col band-ink p-6">
          <div className="border-t-4 border-brand pt-4">
            <span className="font-mono text-[10px] font-bold tracking-widest text-cream/40">
              {String(i + 1).padStart(2, '0')} / {String(milestones.length).padStart(2, '0')}
            </span>
            <h3 className="mt-2 font-display text-3xl leading-none text-cream uppercase">
              {milestone.horizon}
            </h3>
            {milestone.note && (
              <p className="mt-2 font-mono text-[11px] tracking-wide text-brand uppercase">
                {milestone.note}
              </p>
            )}
          </div>

          {milestone.body ? (
            <p className="mt-5 text-cream/80">{milestone.body}</p>
          ) : (
            // Same "unfilled form field" idea as `Tbd`, inverted for the ink band.
            <p className="mt-5 flex-1 border-2 border-dashed border-cream/25 p-4 font-mono text-[11px] leading-relaxed tracking-wide text-cream/45 uppercase">
              <span className="text-cream/70">Doplniť — </span>
              ciele pre tento míľnik
            </p>
          )}
        </li>
      ))}
    </ol>
  </Section>
)

export default Plan
