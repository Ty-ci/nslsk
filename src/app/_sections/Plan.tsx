import Checkbox from '@/app/_components/Checkbox'
import Section from '@/app/_components/Section'
import SectionIntro from '@/app/_components/SectionIntro'
import Tbd from '@/app/_components/Tbd'
import { milestones } from '@/app/_data/content'

const Plan = () => (
  <Section className="border-t-2 border-ink band-ink text-cream">
    <SectionIntro
      label="Čo chceme dosiahnuť"
      title="Tri roky, štyri míľniky"
      note="0 / 4 splnené"
      lead="Aby sa nás dalo priebežne kontrolovať, rozpísali sme program do konkrétnych míľnikov — od prvých sto dní až po koniec funkčného obdobia."
      onDark
    />

    {/* A ballot-style checklist: one box per milestone, nothing marked yet
        because the term hasn't started. */}
    <ol className="mt-14 max-w-3xl">
      {milestones.map((milestone, i) => (
        <li
          key={milestone.horizon}
          className="flex gap-5 border-b-2 border-dashed border-cream/20 py-7 last:border-b-0"
        >
          <Checkbox className="mt-1.5 size-7 shrink-0 text-cream/45" />

          <div className="flex-1">
            <span className="label text-cream/40">
              {String(i + 1).padStart(2, '0')} / {String(milestones.length).padStart(2, '0')}
            </span>

            <div className="mt-2 flex flex-wrap items-baseline gap-x-4">
              <h3 className="font-display text-3xl leading-none text-cream uppercase">
                {milestone.horizon}
              </h3>
              {milestone.note && <span className="label text-brand">{milestone.note}</span>}
            </div>

            {milestone.body ? (
              <p className="mt-4 max-w-xl text-cream/80">{milestone.body}</p>
            ) : (
              <Tbd className="mt-4 max-w-sm" onDark>
                ciele pre tento míľnik
              </Tbd>
            )}
          </div>
        </li>
      ))}
    </ol>
  </Section>
)

export default Plan
