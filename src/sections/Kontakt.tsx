import Button from '../components/Button.tsx'
import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import Tbd from '../components/Tbd.tsx'
import { contact, meetings } from '../content.ts'
import { offsetStatic } from '../theme.ts'

const Kontakt = () => (
  <Section className="border-t-2 border-ink">
    <SectionIntro
      index="05"
      eyebrow="Stretnutia"
      title="Radi vás stretneme 🏕️"
      lead={contact.intro.replaceAll('*', '')}
    />

    <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
      {/* The three questions we actually want answered — the point of meeting. */}
      <div>
        <ul className="flex flex-col gap-5">
          {contact.questions.map((question, i) => (
            <li key={question} className="flex gap-4">
              <span
                aria-hidden="true"
                className="mt-1 flex size-7 shrink-0 items-center justify-center border-2 border-ink font-mono text-xs font-bold text-brand"
              >
                {i + 1}
              </span>
              <p className="font-heading text-2xl/tight font-bold text-ink uppercase">
                {question}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          {contact.email || contact.formHref ? (
            <div className="flex flex-wrap gap-4">
              {contact.formHref && (
                <Button href={contact.formHref} target="_blank" rel="noreferrer" variant="primary">
                  Prihlásiť sa
                </Button>
              )}
              {contact.email && (
                <Button href={`mailto:${contact.email}`} variant="outline">
                  {contact.email}
                </Button>
              )}
            </div>
          ) : (
            <Tbd>e-mail alebo odkaz na prihlasovací dotazník</Tbd>
          )}
        </div>
      </div>

      {/* Meeting slots. The table fills up over time, so an empty state is a
          normal state here, not an error. */}
      <div className={`self-start bg-cream p-6 ${offsetStatic}`}>
        <div className="flex items-center justify-between border-b-2 border-ink pb-3">
          <h3 className="font-heading text-2xl font-bold text-ink uppercase">Termíny</h3>
          <span className="font-mono text-[10px] text-ink/50">
            {meetings.length > 0 ? `${meetings.length} ks` : 'pripravujeme'}
          </span>
        </div>

        {meetings.length > 0 ? (
          <ul className="mt-4 divide-y-2 divide-dashed divide-ink/20">
            {meetings.map((meeting) => (
              <li
                key={`${meeting.date}-${meeting.time}`}
                className="flex items-baseline justify-between gap-4 py-4"
              >
                <span>
                  <span className="font-display text-2xl leading-none text-ink">
                    {meeting.date}
                  </span>
                  <span className="ml-2 font-mono text-xs text-brand">{meeting.time}</span>
                  <span className="mt-1 block font-mono text-[11px] tracking-wide text-ink/60 uppercase">
                    {meeting.form}
                  </span>
                </span>
                {meeting.href && (
                  <a
                    href={meeting.href}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 border-b-2 border-ink/25 pb-0.5 font-mono text-[10px] font-bold tracking-wider text-ink/70 uppercase hover:border-brand hover:text-brand"
                  >
                    Pripojiť ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <Tbd className="mt-4">
            termíny stretnutí vo forme dátum + čas + forma (online call / miesto)
          </Tbd>
        )}

        <p className="mt-5 border-t-2 border-dashed border-ink/30 pt-3 font-mono text-[10px] leading-relaxed text-ink/55 uppercase">
          Ďalšie termíny budeme priebežne dopĺňať.
        </p>
      </div>
    </div>
  </Section>
)

export default Kontakt
