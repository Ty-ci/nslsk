import FormLink from '@/app/_components/FormLink'
import Section from '@/app/_components/Section'
import SectionIntro from '@/app/_components/SectionIntro'
import { candidates } from '@/app/_data/content'
import { offsetStatic } from '@/app/_lib/theme'

// Every candidate's own topic docs, flattened — the program is the sum of them
// until the joint document is finished.
const topicLinks = candidates.flatMap((candidate) =>
  candidate.topics.flatMap((topic) =>
    topic.link ? [{ candidate: candidate.name, title: topic.title, href: topic.link.href }] : [],
  ),
)

const Program = () => (
  <Section className="border-t-2 border-ink">
    <div className="flex flex-col gap-6 lg:gap-8">
      <SectionIntro
        title={<>Náš program</>}
        lead="Program za jednotlivé oblasti, s ktorým do Náčelníctva prichádzame, si môžete pozrieť nižšie."
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className={`self-start bg-cream-light p-6 ${offsetStatic}`}>
          <div className="flex items-center justify-between gap-4 border-b-2 border-ink pb-3">
            <h3 className="font-heading text-2xl leading-none font-bold text-ink uppercase">
              Programové témy
            </h3>
          </div>

          <ul className="mt-2 divide-y-2 divide-dashed divide-ink/10">
            {topicLinks.map((topic) => (
              <li key={topic.href}>
                <a
                  href={topic.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-baseline justify-between gap-3 py-3.5 text-brand-dark hover:text-brand"
                >
                  <span className="font-heading text-lg leading-none font-bold uppercase">
                    {topic.title} ↗
                  </span>
                  <span className="shrink-0 label text-ink/50 group-hover:text-brand/70">
                    {topic.candidate}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ul className="flex flex-col gap-3">
          {candidates.map((candidate) => (
            <li key={candidate.name}>
              <FormLink href={candidate.formHref} name={candidate.name} className="w-full!" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Section>
)

export default Program
