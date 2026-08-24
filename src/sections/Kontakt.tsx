import Button from '../components/Button.tsx'
import Label from '../components/Label.tsx'
import Rule from '../components/Rule.tsx'
import Section from '../components/Section.tsx'
import Tbd from '../components/Tbd.tsx'
import { contact, meetings } from '../content.ts'
import { offsetStatic } from '../theme.ts'

// The loudest section on the page: a thick bar of spot ink across the full
// width, the biggest headline, the most air. Everything else on the site leads
// here.
const Kontakt = () => (
  <Section className="border-t-4 border-brand" py="py-24 md:py-36">
    <div className="max-w-3xl">
      <Label className="text-brand">Stretnime sa</Label>
      <h2 className="mt-6 font-display text-6xl leading-[0.9] tracking-tight text-ink uppercase md:text-8xl">
        Radi vás stretneme 🏕️
      </h2>
      <Rule className="mt-6 h-2 w-72 bg-brand" />
      <p className="mt-8 max-w-2xl text-xl text-ink/75">{contact.intro.replaceAll('*', '')}</p>
    </div>

    <div className="mt-16 grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:gap-20">
      {/* The three questions we actually want answered — the point of meeting. */}
      <div>
        <ol className="space-y-6">
          {contact.questions.map((question, i) => (
            <li key={question} className="flex gap-4">
              <span
                aria-hidden="true"
                className="mt-1 flex size-8 shrink-0 items-center justify-center border-2 border-ink font-mono text-sm font-bold text-brand"
              >
                {i + 1}
              </span>
              <p className="font-heading text-3xl/tight font-bold text-ink uppercase">{question}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12">
          {contact.email || contact.formHref ? (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {contact.formHref && (
                <Button href={contact.formHref} target="_blank" rel="noreferrer" variant="sun">
                  Prihlásiť sa
                </Button>
              )}
              {contact.email && (
                <Button href={`mailto:${contact.email}`} variant="quiet">
                  {contact.email}
                </Button>
              )}
            </div>
          ) : (
            <Tbd className="max-w-sm">e-mail alebo odkaz na prihlasovací dotazník</Tbd>
          )}
        </div>
      </div>

      {/* Meeting slots, on a boxed and offset slip. The list fills up over time,
          so an empty state is a normal state here, not an error. */}
      <div className={`self-start bg-cream p-6 ${offsetStatic}`}>
        <div className="flex items-center justify-between gap-4 border-b-2 border-ink pb-3">
          <h3 className="font-heading text-2xl leading-none font-bold text-ink uppercase">
            Termíny
          </h3>
          <span className="shrink-0 label text-ink/45">
            {meetings.length > 0 ? `${meetings.length} ks` : 'pripravujeme'}
          </span>
        </div>

        {meetings.length > 0 ? (
          <ul className="mt-2 divide-y-2 divide-dashed divide-ink/20">
            {meetings.map((meeting) => (
              <li
                key={`${meeting.date}-${meeting.time}`}
                className="flex items-baseline justify-between gap-4 py-4"
              >
                <span>
                  <span className="font-display text-2xl leading-none text-ink">
                    {meeting.date}
                  </span>
                  <span className="ml-2 font-mono text-xs font-bold text-brand">
                    {meeting.time}
                  </span>
                  <span className="mt-1.5 block label text-ink/55">{meeting.form}</span>
                </span>
                {meeting.href && (
                  <a
                    href={meeting.href}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 border-b-2 border-ink/25 pb-0.5 label text-ink/70 hover:border-brand hover:text-brand"
                  >
                    Pripojiť ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <Tbd className="mt-4">termíny vo forme dátum + čas + forma (online / miesto)</Tbd>
        )}

        <p className="mt-5 border-t-2 border-dashed border-ink/30 pt-3 font-mono text-[10px] leading-relaxed text-ink/55 uppercase">
          Ďalšie termíny budeme priebežne dopĺňať. Ak vám žiadny nevyhovuje, napíšte nám a nájdeme
          iný.
        </p>
      </div>
    </div>
  </Section>
)

export default Kontakt
