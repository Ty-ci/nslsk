import Photo from '../components/Photo.tsx'
import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import { candidates } from '../content.ts'
import { inkAt, offsetCard } from '../theme.ts'

const Kandidati = () => (
  <Section>
    <SectionIntro
      index="01"
      eyebrow="Kandidáti"
      title="Štyria ľudia, jeden tím"
      lead="Ku každému z nás nájdete jeho témy a celý kandidačný formulár tak, ako ho videl snem — nič skrátené, nič preformulované."
    />

    <div className="mt-14 grid gap-8 sm:grid-cols-2">
      {candidates.map((candidate, i) => {
        const ink = inkAt(i)

        return (
          <article key={candidate.name} className={`flex flex-col bg-cream p-6 ${offsetCard}`}>
            <div className="flex items-start gap-5">
              <Photo
                photoId={candidate.photoId}
                name={candidate.name}
                initials={candidate.initials}
                ink={ink}
                className="w-28 shrink-0"
              />
              <div className="flex-1">
                <span className="font-mono text-xs font-bold text-brand">
                  {String(i + 1).padStart(2, '0')} / {String(candidates.length).padStart(2, '0')}
                </span>
                <h3 className="mt-1 font-display text-4xl leading-none text-ink uppercase">
                  {candidate.name}
                </h3>
                <a
                  href={candidate.formHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 border-b-2 border-ink/25 pb-0.5 font-mono text-[11px] font-bold tracking-wide text-ink/70 uppercase hover:border-brand hover:text-brand"
                >
                  Kandidačný formulár
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>

            <p className="mt-6 border-t-2 border-ink pt-4 font-mono text-[11px] font-bold tracking-[0.2em] text-ink/50 uppercase">
              Moje témy
            </p>

            <ul className="mt-4 flex flex-1 flex-col gap-4">
              {candidate.topics.map((topic) => (
                <li key={topic.title} className={`border-l-4 pl-4 ${ink.border}`}>
                  <h4 className="font-heading text-xl/tight font-bold text-ink uppercase">
                    {topic.title}
                  </h4>
                  <p className="mt-1 text-ink/80">{topic.summary}</p>
                  {topic.link && (
                    <a
                      href={topic.link.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider uppercase hover:underline ${ink.text}`}
                    >
                      Viac k téme
                      <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </article>
        )
      })}
    </div>
  </Section>
)

export default Kandidati
