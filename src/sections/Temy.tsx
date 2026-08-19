import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import { sharedTopics } from '../content.ts'
import { inkAt, offsetCard } from '../theme.ts'

const Temy = () => (
  <Section className="border-t-2 border-ink band-sand">
    <SectionIntro
      index="02"
      eyebrow="Spoločné témy"
      title="Za čím si stojíme ako tím"
      lead="Osem vecí, na ktorých sme sa dohodli všetci štyria. Nie sú to samostatné projekty — je to spôsob, akým chceme v Náčelníctve pracovať."
    />

    <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sharedTopics.map((topic, i) => {
        const ink = inkAt(i)

        return (
          <article key={topic.title} className={`flex flex-col bg-cream p-6 ${offsetCard}`}>
            <div className="flex items-start justify-between gap-3 border-b-2 border-ink pb-3">
              <h3 className="font-heading text-2xl leading-none font-bold text-ink uppercase">
                {topic.title}
              </h3>
              <span className={`font-display text-3xl leading-[0.8] ${ink.text}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>

            <p className="mt-4 flex-1 text-ink/80">{topic.body}</p>

            {topic.link && (
              <a
                href={topic.link.href}
                target="_blank"
                rel="noreferrer"
                className={`mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider uppercase hover:underline ${ink.text}`}
              >
                {topic.link.label}
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </article>
        )
      })}
    </div>
  </Section>
)

export default Temy
