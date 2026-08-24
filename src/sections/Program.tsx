import Button from '../components/Button.tsx'
import FormLink from '../components/FormLink.tsx'
import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
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
    <div className="grid gap-14 md:grid-cols-[1fr_0.9fr] md:gap-20">
      <div>
        <SectionIntro
          label="Hlavný program"
          title={
            <>
              Celý program
              <br />
              na jednom mieste
            </>
          }
          lead="Spoločné témy vyššie sú výber. Ak vás zaujíma, ako presne to chceme urobiť — s odôvodnením, postupom a rizikami — prečítajte si kompletný dokument."
        />

        <div className="mt-9">
          {programDocHref ? (
            <Button href={programDocHref} target="_blank" rel="noreferrer" variant="sun">
              Kompletný program
            </Button>
          ) : (
            <Tbd className="max-w-sm">odkaz na dokument s kompletným programom</Tbd>
          )}
        </div>
      </div>

      {/* Index of the individual topic documents — the working parts of the
          program, readable already today. */}
      <div className={`self-start bg-cream p-6 ${offsetStatic}`}>
        <div className="flex items-center justify-between gap-4 border-b-2 border-ink pb-3">
          <h3 className="font-heading text-2xl leading-none font-bold text-ink uppercase">
            Podkladové dokumenty
          </h3>
          <span className="shrink-0 label text-ink/45">{topicLinks.length} ks</span>
        </div>

        <ul className="mt-2 divide-y-2 divide-dashed divide-ink/20">
          {topicLinks.map((topic) => (
            <li key={topic.href}>
              <a
                href={topic.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-baseline gap-3 py-3.5 transition-colors hover:text-brand"
              >
                <span className="font-heading text-lg leading-none font-bold uppercase">
                  {topic.title}
                </span>
                <span aria-hidden="true" className="leader text-ink" />
                <span className="shrink-0 label text-ink/45 group-hover:text-brand/70">
                  {topic.candidate}
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

    {/* All four candidacy forms in one place — the primary source documents,
        so they get their own strip rather than living only next to a photo. */}
    <div className="mt-20 border-t-2 border-ink pt-8">
      <div className="flex items-baseline gap-4">
        <span className="label text-brand">Kandidačné formuláre</span>
        <span aria-hidden="true" className="leader text-ink" />
        <span className="shrink-0 label text-ink/40">Prílohy 01 – 04</span>
      </div>

      <p className="mt-4 max-w-xl text-lg text-ink/75">
        Úplné znenie toho, čo sme podali na snem — motivácia, skúsenosti aj plány, každý za seba.
      </p>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {candidates.map((candidate) => (
          <li key={candidate.name}>
            <FormLink
              href={candidate.formHref}
              name={candidate.name}
              subtitle={candidate.name}
              className="h-full"
            />
          </li>
        ))}
      </ul>
    </div>
  </Section>
)

export default Program
