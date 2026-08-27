import Section from '@/app/_components/Section'
import SectionIntro from '@/app/_components/SectionIntro'
import { sharedTopics } from '@/app/_data/content'
import { inkAt } from '@/app/_lib/theme'

const Temy = () => (
  <Section className="border-t-2 border-ink band-sand">
    <SectionIntro
      title="Naše spoločné princípy"
      lead="Osem vecí, na ktorých sme sa dohodli všetci štyria. Nie sú to samostatné projekty, je to spôsob, akým chceme v Náčelníctve pracovať."
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
            <div className="flex flex-col items-baseline gap-4 lg:flex-row">
              <span className={`shrink-0 font-display text-3xl leading-[0.8] ${ink.text}`}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-heading text-2xl leading-none font-bold text-ink uppercase">
                {topic.title}
              </h3>
            </div>

            <p className="mt-4 max-w-xl text-ink/80 lg:pl-12">{topic.body}</p>

            {topic.link && (
              <a
                href={topic.link.href}
                target="_blank"
                rel="noreferrer"
                className={`mt-3 inline-block label hover:underline lg:ml-12 ${ink.text}`}
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
