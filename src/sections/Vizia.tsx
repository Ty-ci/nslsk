import Eyebrow from '../components/Eyebrow.tsx'
import Section from '../components/Section.tsx'
import { visionStats } from '../content.ts'

// Rules stay visible on the ink band, so this cycle skips plain ink.
const rules = ['border-brand', 'border-cream', 'border-forest', 'border-brand']

const Vizia = () => (
  <Section className="band-ink text-cream">
    <Eyebrow className="text-brand">Vízia SLSK do roku 2030</Eyebrow>
    <blockquote className="mt-6 max-w-4xl font-heading text-4xl/tight font-bold uppercase md:text-6xl">
      10 000 nadšených mladých ľudí v Slovenskom skautingu
      <span className="text-brand"> pozitívne formuje spoločnosť</span> na Slovensku.
    </blockquote>

    <dl className="mt-16 grid gap-px border-2 border-cream/20 bg-cream/20 sm:grid-cols-2 lg:grid-cols-4">
      {visionStats.map((stat, i) => (
        <div key={stat.label} className="band-ink p-6">
          <div className={`border-t-4 pt-4 ${rules[i % rules.length]}`}>
            <dt className="font-display text-4xl text-cream md:text-5xl">{stat.value}</dt>
            <dd className="mt-2 font-mono text-[11px] leading-relaxed tracking-wide text-cream/60 uppercase">
              {stat.label}
            </dd>
          </div>
        </div>
      ))}
    </dl>
  </Section>
)

export default Vizia
