import FormLink from '@/app/_components/FormLink'
import Photo from '@/app/_components/Photo'
import Section from '@/app/_components/Section'
import SectionIntro from '@/app/_components/SectionIntro'
import { candidates } from '@/app/_data/content'
import { inkAt } from '@/app/_lib/theme'

const TILTS = [-1.8, 1.5, -1.3, 2]

const Kandidati = () => (
  <Section>
    <SectionIntro
      label="Kandidáti"
      title="O nás"
      // lead="Ku každému z nás nájdete jeho témy — a celý kandidačný formulár tak, ako ho videl snem. Nič skrátené, nič preformulované."
    />

    {/* One numbered entry per candidate: portrait pasted into the margin, the
        record running beside it, a heavy rule between entries. */}
    <div className="mt-14">
      {candidates.map((candidate, i) => {
        const ink = inkAt(i)

        return (
          <article
            key={candidate.name}
            className="grid gap-8 border-t-2 border-ink py-12 first:border-t-0 first:pt-0 sm:grid-cols-[10rem_1fr] sm:gap-12 md:grid-cols-[12rem_1fr]"
          >
            <Photo
              photoId={candidate.photoId}
              name={candidate.name}
              initials={candidate.initials}
              ink={ink}
              tilt={TILTS[i % TILTS.length]}
            />

            <div>
              <h3 className="mt-2 font-display text-5xl leading-none text-ink uppercase md:text-6xl">
                {candidate.name}
              </h3>

              <dl className="mt-6 space-y-6">
                {candidate.topics.map((topic) => (
                  <div key={topic.title} className={`border-l-4 pl-4 ${ink.border}`}>
                    <dt className="font-heading text-2xl leading-none font-bold text-ink uppercase">
                      {topic.title}
                    </dt>
                    <dd className="mt-2 max-w-xl text-ink/80">
                      {topic.summary}
                      {topic.link && (
                        <a
                          href={topic.link.href}
                          target="_blank"
                          rel="noreferrer"
                          className={`ml-2 label whitespace-nowrap hover:underline ${ink.text}`}
                        >
                          viac ↗
                        </a>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <FormLink href={candidate.formHref} name={candidate.name} className="mt-8" />
            </div>
          </article>
        )
      })}
    </div>
  </Section>
)

export default Kandidati
