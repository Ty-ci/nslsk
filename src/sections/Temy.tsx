import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import { sharedTopics } from '../content.ts'
import { inkAt } from '../theme.ts'

const Temy = () => (
  <Section className="border-t-2 border-ink band-sand">
    <SectionIntro
      label="Spoločné témy"
      title="Za čím si stojíme ako tím"
      note={`${sharedTopics.length} bodov`}
      lead="Osem vecí, na ktorých sme sa dohodli všetci štyria. Nie sú to samostatné projekty — je to spôsob, akým chceme v Náčelníctve pracovať."
    />

    {/* A numbered register across two columns: the entry number set large in
        spot ink, a heavy rule above each, running text below. */}
    <ol className="mt-14 grid gap-x-16 md:grid-cols-2">
      {sharedTopics.map((topic, i) => {
        const ink = inkAt(i)

        return (
          <li
            key={topic.title}
            className="border-t-2 border-ink py-8 first:border-t-0 first:pt-0 md:nth-2:border-t-0 md:nth-2:pt-0"
          >
            <div className="flex items-baseline gap-4">
              <span className={`shrink-0 font-display text-3xl leading-[0.8] ${ink.text}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-2xl leading-none font-bold text-ink uppercase">
                {topic.title}
              </h3>
            </div>

            <p className="mt-4 max-w-xl pl-12 text-ink/80">{topic.body}</p>

            {topic.link && (
              <a
                href={topic.link.href}
                target="_blank"
                rel="noreferrer"
                className={`mt-3 ml-12 inline-block label hover:underline ${ink.text}`}
              >
                {topic.link.label} ↗
              </a>
            )}
          </li>
        )
      })}
    </ol>
  </Section>
)

export default Temy
