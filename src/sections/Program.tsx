import Button from '../components/Button.tsx'
import Eyebrow from '../components/Eyebrow.tsx'
import Section from '../components/Section.tsx'
import Tbd from '../components/Tbd.tsx'
import { candidates, programDocHref } from '../content.ts'
import { offsetStatic } from '../theme.ts'

// Every candidate's own topic docs, flattened — the program is the sum of them
// until the joint document is finished.
const topicLinks = candidates.flatMap((candidate) =>
  candidate.topics.flatMap((topic) =>
    topic.link ? [{ candidate: candidate.name, title: topic.title, href: topic.link.href }] : [],
  ),
)

const Program = () => (
  <Section className="border-t-2 border-ink">
    <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
      <div>
        <div className="border-t-2 border-ink pt-5">
          <div className="flex items-baseline gap-4">
            <span className="font-mono text-sm font-bold text-ink/40">03 /</span>
            <Eyebrow>Hlavný program</Eyebrow>
          </div>
          <h2 className="mt-4 font-heading text-5xl font-bold tracking-tight text-ink uppercase md:text-6xl">
            Celý program
            <br />
            na jednom mieste
          </h2>
          <p className="mt-5 text-lg text-ink/75">
            Spoločné témy vyššie sú výber. Ak vás zaujíma, ako presne to chceme urobiť — s
            odôvodnením, postupom a rizikami — prečítajte si kompletný dokument.
          </p>
        </div>

        <div className="mt-8">
          {programDocHref ? (
            <Button href={programDocHref} target="_blank" rel="noreferrer" variant="primary">
              Kompletný program
            </Button>
          ) : (
            <Tbd>odkaz na dokument s kompletným programom</Tbd>
          )}
        </div>
      </div>

      {/* Index of the individual topic documents — the working parts of the
          program, readable already today. */}
      <div className={`self-start bg-cream p-6 ${offsetStatic}`}>
        <div className="flex items-center justify-between border-b-2 border-ink pb-3">
          <h3 className="font-heading text-2xl font-bold text-ink uppercase">
            Podkladové dokumenty
          </h3>
          <span className="font-mono text-[10px] text-ink/50">{topicLinks.length} ks</span>
        </div>

        <ul className="mt-4 divide-y-2 divide-dashed divide-ink/20">
          {topicLinks.map((topic) => (
            <li key={topic.href}>
              <a
                href={topic.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-baseline justify-between gap-4 py-3 hover:text-brand"
              >
                <span>
                  <span className="font-heading text-lg leading-none font-bold uppercase">
                    {topic.title}
                  </span>
                  <span className="ml-2 font-mono text-[10px] text-ink/50 uppercase group-hover:text-brand/70">
                    {topic.candidate}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 font-mono text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Section>
)

export default Program
