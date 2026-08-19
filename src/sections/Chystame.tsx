import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import Tbd from '../components/Tbd.tsx'
import { offsetStatic } from '../theme.ts'

// The two "extra" blocks from the content brief. Both are still empty, so they
// share one section rather than each getting its own hollow band.
const upcoming = [
  {
    title: 'Podporný tím',
    lead: 'Odborný kruh okolo Náčelníctva — ľudia, ktorí nám pomáhajú spracovávať témy a prinášať kontext.',
    missing: 'úvodný text a zloženie podporného tímu',
  },
  {
    title: 'Otázky a aktuality',
    lead: 'Otázky, ktoré dostávame, aj priebežné novinky ku kandidatúre. Pýtajte sa — odpovede zverejníme tu.',
    missing: 'úvodný text a napojenie tabuľky s otázkami a aktualitami',
  },
]

const Chystame = () => (
  <Section className="border-t-2 border-ink band-sand">
    <SectionIntro
      index="06"
      eyebrow="Chystáme"
      title="Ešte na tom pracujeme"
      lead="Nechceme čakať s webom, kým bude všetko hotové. Tieto dve časti dopĺňame priebežne."
    />

    <div className="mt-14 grid gap-8 md:grid-cols-2">
      {upcoming.map((item) => (
        <article key={item.title} className={`bg-cream p-8 ${offsetStatic}`}>
          <h3 className="font-heading text-3xl leading-none font-bold text-ink uppercase">
            {item.title}
          </h3>
          <p className="mt-4 text-ink/80">{item.lead}</p>
          <Tbd className="mt-6">{item.missing}</Tbd>
        </article>
      ))}
    </div>
  </Section>
)

export default Chystame
