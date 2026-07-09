import Eyebrow from '../components/Eyebrow.tsx'
import Section from '../components/Section.tsx'
import { visionStats } from '../content.ts'
import { accentAt } from '../theme.ts'

const Vizia = () => (
  <Section className="bg-navy text-white">
    <Eyebrow className="text-white/60">Vízia SLSK do roku 2030</Eyebrow>
    <blockquote className="mt-6 max-w-4xl font-heading text-3xl/tight font-bold md:text-5xl">
      10 000 nadšených mladých ľudí v Slovenskom skautingu pozitívne formuje spoločnosť na
      Slovensku.
    </blockquote>

    <dl className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {visionStats.map((stat, i) => (
        <div key={stat.label} className={`border-t-4 pt-4 ${accentAt(i).border}`}>
          <dt className="font-display text-4xl text-white md:text-5xl">{stat.value}</dt>
          <dd className="mt-2 text-sm text-white/70">{stat.label}</dd>
        </div>
      ))}
    </dl>
  </Section>
)

export default Vizia
