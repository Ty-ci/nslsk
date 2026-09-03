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
      title="Kandidáti"
      // lead="Ku každému z nás nájdete jeho témy — a celý kandidačný formulár tak, ako ho videl snem. Nič skrátené, nič preformulované."
    />

    {/* One numbered entry per candidate: portrait pasted into the margin, the
        record running beside it, a heavy rule between entries. */}
    <div className="mt-20 flex flex-col gap-20">
      {candidates.map((candidate, i) => {
        const ink = inkAt(i)

        return (
          <article key={candidate.name} className="flex flex-col lg:gap-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
              <Photo
                photoId={candidate.photoId}
                name={candidate.name}
                initials={candidate.initials}
                ink={ink}
                tilt={TILTS[i % TILTS.length]}
                className="w-[250px]"
              />
              <div className="flex flex-col gap-4 lg:gap-6">
                <h3 className="font-display text-6xl leading-none text-ink uppercase">
                  {candidate.name}
                </h3>
                {candidate.aboutMe ? (
                  <p className="border-2 border-ink bg-cream-light p-4 whitespace-pre-line text-ink shadow-[4px_4px_0_0_var(--color-ink)]">
                    {candidate.aboutMe}
                  </p>
                ) : null}
              </div>
            </div>

            <div>
              <dl className="mt-6 space-y-3">
                {candidate.topics.map((topic) => (
                  <div key={topic.title} className={`border-l-4 pl-4 ${ink.border}`}>
                    <dt className="font-heading text-2xl leading-none font-bold text-ink uppercase">
                      {topic.title}
                    </dt>
                    <dd className="mt-1 max-w-xl text-ink/80">
                      {topic.summary}
                      {topic.link && (
                        <a
                          href={topic.link.href}
                          target="_blank"
                          rel="noreferrer"
                          className={`ml-2 label whitespace-nowrap hover:underline ${ink.text}`}
                        >
                          čítaj viac
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
