import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import { priorities } from '../content.ts'
import { inkAt, offsetCard } from '../theme.ts'

const Program = () => (
  <Section className="border-t-2 border-ink">
    <SectionIntro
      index="02"
      eyebrow="Náš program"
      title="Štyri priority Stratégie 2030"
      lead="Nevymýšľame nový smer — chceme dôsledne napĺňať víziu, ktorú si organizácia schválila. Ku každej priorite prinášame konkrétny cieľ, za ktorý sa vieme zaručiť."
    />

    <div className="mt-14 grid gap-8 md:grid-cols-2">
      {priorities.map((priority, i) => {
        const ink = inkAt(i)

        return (
          <article key={priority.number} className={`bg-cream p-8 ${offsetCard}`}>
            <div className="flex items-start justify-between gap-4 border-b-2 border-ink pb-4">
              <h3 className="max-w-[16ch] font-heading text-3xl leading-none font-bold text-ink uppercase">
                {priority.title}
              </h3>
              <span className={`font-display text-6xl leading-[0.8] ${ink.text}`}>
                {priority.number}
              </span>
            </div>

            <p className="mt-4 text-ink/80">{priority.summary}</p>

            <div className={`mt-6 flex gap-3 border-2 p-4 ${ink.border}`}>
              <span aria-hidden="true" className={`font-display text-xl leading-none ${ink.text}`}>
                →
              </span>
              <p className="text-sm text-ink/85">
                <span className="font-mono text-[11px] font-bold tracking-wider text-ink uppercase">
                  Náš cieľ —{' '}
                </span>
                {priority.goal}
              </p>
            </div>
          </article>
        )
      })}
    </div>
  </Section>
)

export default Program
