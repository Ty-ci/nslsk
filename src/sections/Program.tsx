import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import { priorities } from '../content.ts'
import { accentAt } from '../theme.ts'

const Program = () => (
  <Section className="bg-white">
    <SectionIntro
      eyebrow="Náš program"
      title="Štyri priority Stratégie 2030"
      lead="Nevymýšľame nový smer — chceme dôsledne napĺňať víziu, ktorú si organizácia schválila. Ku každej priorite prinášame konkrétny cieľ, za ktorý sa vieme zaručiť."
    />

    <div className="mt-12 grid gap-6 md:grid-cols-2">
      {priorities.map((priority, i) => {
        const accent = accentAt(i)

        return (
          <article
            key={priority.number}
            className="group rounded-3xl bg-cream p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <span className={`font-display text-6xl opacity-40 ${accent.text}`}>
              {priority.number}
            </span>
            <h3 className="mt-2 font-heading text-2xl font-bold text-navy">{priority.title}</h3>
            <p className="mt-3 text-navy/80">{priority.summary}</p>
            <p className="mt-5 flex gap-2 rounded-2xl bg-white p-4 text-sm text-navy/80">
              <span aria-hidden="true" className={`font-bold ${accent.text}`}>
                →
              </span>
              <span>
                <span className="font-semibold text-navy">Náš cieľ:</span> {priority.goal}
              </span>
            </p>
          </article>
        )
      })}
    </div>
  </Section>
)

export default Program
