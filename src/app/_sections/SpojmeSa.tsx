'use client'

import AskButton from '@/app/_components/AskButton'
import Button from '@/app/_components/Button'
import Label from '@/app/_components/Label'
import Markdown from '@/app/_components/Markdown'
import Rule from '@/app/_components/Rule'
import Section from '@/app/_components/Section'
import Stamp from '@/app/_components/Stamp'
import Tbd from '@/app/_components/Tbd'
import { contact, qa } from '@/app/_data/content'
import { useSheetContent } from '@/app/_hooks/useSheetContent'
import { anchorHref, qaAnchor } from '@/app/_lib/navigation'
import type { SheetEvent, SheetQuestion } from '@/app/_lib/sheetContent'
import { inkAt, offsetStatic } from '@/app/_lib/theme'

const dateFormat = new Intl.DateTimeFormat('sk-SK', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
})

const formatDate = (isoDate: string) => dateFormat.format(new Date(`${isoDate}T00:00:00`))

/** „1 otázka / 2 otázky / 5 otázok" — the count printed in the running head. */
const questionCount = (count: number) => {
  if (count === 1) {
    return '1 otázka'
  }

  return count >= 2 && count <= 4 ? `${count} otázky` : `${count} otázok`
}

// One meeting slot, off the `eventy` sheet: the occasion as the headline, the
// two hard facts on printed form lines, then whatever the candidates wrote —
// Markdown, so a sign-up link can live inside the description.
const EventCard = ({ event }: { event: SheetEvent }) => (
  <li className={`flex flex-col bg-cream p-6 ${offsetStatic}`}>
    <h4 className="font-heading text-2xl/tight font-bold text-ink uppercase">
      {event.title || 'Stretnutie'}
    </h4>

    <dl className="mt-4 space-y-2 border-t-2 border-dashed border-ink/25 pt-4">
      {event.term && (
        <div className="flex items-baseline gap-3">
          <dt className="shrink-0 label text-ink/45">Termín</dt>
          <dd className="font-mono text-sm font-bold text-brand">{event.term}</dd>
        </div>
      )}
      {event.form && (
        <div className="flex items-baseline gap-3">
          <dt className="shrink-0 label text-ink/45">Forma</dt>
          <dd className="label text-ink/70">{event.form}</dd>
        </div>
      )}
    </dl>

    {event.description && (
      <Markdown size="sm" className="mt-4">
        {event.description}
      </Markdown>
    )}
  </li>
)

// One entry off the `otazky` sheet: the question as a headline, who asked and
// when in mono caps, then the answer as running text. Unanswered but published
// questions stay visible — with the answer slot stamped, not hidden.
const QuestionEntry = ({ question, index }: { question: SheetQuestion; index: number }) => {
  const ink = inkAt(index)

  return (
    <li className="border-t-2 border-ink py-9 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-4">
        <span className={`shrink-0 font-display text-3xl leading-[0.8] ${ink.text}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <h4 className="font-heading text-2xl/tight font-bold text-ink uppercase md:text-3xl">
          {question.question}
        </h4>
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 pl-12 label text-ink/45">
        {question.name && <span>{question.name}</span>}
        {question.name && question.date && <span aria-hidden="true">·</span>}
        {question.date && <span>{formatDate(question.date)}</span>}
      </p>

      <div className="mt-5 max-w-3xl pl-12">
        {question.answer === '' ? (
          <Stamp className="border-ink/35 text-ink/45">Odpoveď pripravujeme</Stamp>
        ) : (
          <Markdown>{question.answer}</Markdown>
        )}
      </div>
    </li>
  )
}

// The one section where the visitor talks back, in the two ways we offer: in
// person at a meeting, or in writing through the form — with every answer we've
// already given printed underneath. Both channels read off the same sheet, so
// they belong on the same page rather than in a section and a subpage.
//
// Three bands under one anchor: the invitation to meet, the Q&A (its own
// `#otazky` anchor, so it stays deep-linkable), and the closing nudge.
const SpojmeSa = () => {
  const { content, isLoading, hasFailed } = useSheetContent()
  const { events, questions } = content

  return (
    <>
      {/* The loudest band on the page: a thick bar of spot ink across the full
          width, the biggest headline, the most air. Everything else leads here. */}
      <Section className="border-t-4 border-brand" py="py-24 md:py-36">
        <div className="max-w-3xl">
          <Label className="text-brand">Spojme sa</Label>
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
                  <p className="font-heading text-3xl/tight font-bold text-ink uppercase">
                    {question}
                  </p>
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

          {/* Can't make any of the dates? The written channel does the same job —
              and it is right below, not on another page. */}
          <div className={`self-start bg-cream p-6 ${offsetStatic}`}>
            <h3 className="font-heading text-2xl leading-none font-bold text-ink uppercase">
              Nestíhate stretnutie?
            </h3>
            <p className="mt-4 text-ink/75">
              Napíšte nám otázku cez dotazník. Odpovedáme na všetky a odpovede zverejňujeme nižšie
              na tejto stránke, aby ich mal každý po ruke.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <AskButton variant="sketch" size="sm" />
              <a
                href={anchorHref(qaAnchor)}
                className="border-b-2 border-ink/25 pb-0.5 label text-ink/70 hover:border-brand hover:text-brand"
              >
                Zverejnené otázky
              </a>
            </div>
          </div>
        </div>

        {/* Meeting slots come from the sheet, so the list fills up without a
            redeploy. Empty is a normal state here, not an error. */}
        <div className="mt-20 border-t-2 border-ink pt-5">
          <div className="flex items-baseline gap-4">
            <Label className="text-brand">Termíny</Label>
            <span aria-hidden="true" className="leader text-ink" />
            <span className="shrink-0 label text-ink/40">
              {isLoading
                ? 'načítavame'
                : events.length > 0
                  ? `${events.length} ks`
                  : 'pripravujeme'}
            </span>
          </div>

          {isLoading && (
            <p className="mt-8 animate-pulse label text-ink/45">Načítavame termíny z tabuľky…</p>
          )}

          {!isLoading && hasFailed && (
            <p className="mt-8 max-w-2xl border-2 border-dashed border-brand/60 bg-brand/5 p-5 font-mono text-[11px] leading-relaxed tracking-wide text-ink/70 uppercase">
              Termíny sa teraz nepodarilo načítať. Skúste stránku obnoviť o chvíľu.
            </p>
          )}

          {!isLoading && !hasFailed && events.length === 0 && (
            <Tbd className="mt-8 max-w-2xl">
              termíny dopĺňajte do listu {'„eventy“'} v tabuľke k dotazníku — názov, forma, termín,
              popis
            </Tbd>
          )}

          {events.length > 0 && (
            <>
              <ul className="mt-8 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </ul>

              <p className="mt-8 max-w-2xl border-t-2 border-dashed border-ink/30 pt-3 font-mono text-[10px] leading-relaxed text-ink/55 uppercase">
                Ďalšie termíny budeme priebežne dopĺňať. Ak vám žiadny nevyhovuje, napíšte nám a
                nájdeme iný.
              </p>
            </>
          )}
        </div>
      </Section>

      {/* The written half of the same conversation. Its own anchor, because it
          used to be a page of its own and links to it are already out there. */}
      <Section
        id={qaAnchor}
        className="scroll-mt-20 border-t-2 border-ink band-sand"
        py="py-16 md:py-24"
      >
        <div className="max-w-3xl">
          <Label className="text-brand">Otázky a odpovede</Label>
          <h3 className="mt-6 font-display text-5xl leading-[0.9] tracking-tight text-ink uppercase md:text-7xl">
            Pýtajte sa
          </h3>
          <Rule className="mt-6 h-2 w-56 bg-brand" />
          <p className="mt-8 text-xl text-ink/75">{qa.intro}</p>
        </div>

        {/* The form is the whole point of this half — it gets a panel, not a
            footnote link. */}
        <div className={`mt-12 max-w-2xl bg-cream p-6 md:p-8 ${offsetStatic}`}>
          <h4 className="font-heading text-2xl leading-none font-bold text-ink uppercase">
            Máte otázku pre nás?
          </h4>
          <p className="mt-4 text-ink/75">{qa.formNote}</p>
          <AskButton variant="sun" className="mt-6" />
        </div>

        <div className="mt-20 border-t-2 border-ink pt-5">
          <div className="flex items-baseline gap-4">
            <Label className="text-brand">Zverejnené otázky</Label>
            <span aria-hidden="true" className="leader text-ink" />
            <span className="shrink-0 label text-ink/40">
              {isLoading ? 'načítavame' : questionCount(questions.length)}
            </span>
          </div>
        </div>

        {isLoading && (
          <p className="mt-10 animate-pulse label text-ink/45">Načítavame otázky z tabuľky…</p>
        )}

        {!isLoading && hasFailed && (
          <div className="mt-10 max-w-2xl border-2 border-dashed border-brand/60 bg-brand/5 p-6">
            <p className="label text-brand">Otázky sa nepodarilo načítať</p>
            <p className="mt-3 text-ink/75">
              Skúste to prosím o chvíľu znova. Ak to nepomôže, napíšte nám priamo cez{' '}
              <a
                href={qa.formHref}
                target="_blank"
                rel="noreferrer"
                className="text-ink underline decoration-brand decoration-2 underline-offset-4 hover:text-brand"
              >
                dotazník
              </a>
              .
            </p>
          </div>
        )}

        {!isLoading && !hasFailed && questions.length === 0 && (
          <div className="mt-10 max-w-2xl border-2 border-dashed border-ink/35 bg-ink/3 p-6">
            <p className="label text-ink/55">Zatiaľ tu nič nie je</p>
            <p className="mt-3 text-ink/75">
              Žiadnu otázku sme ešte nezverejnili. Buďte prví — na každú otázku odpovedáme a odpoveď
              pridáme sem.
            </p>
          </div>
        )}

        {questions.length > 0 && (
          <ol className="mt-12">
            {questions.map((question, index) => (
              <QuestionEntry key={question.id} question={question} index={index} />
            ))}
          </ol>
        )}
      </Section>

      {/* Closing invitation, so the section ends where it started: talk to us. */}
      <Section className="border-t-2 border-ink bg-ink/90 text-cream" py="py-14 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="max-w-xl font-heading text-3xl font-bold uppercase md:text-4xl">
              Ostala v tebe otázka?
            </p>
            <p className="max-w-xl font-heading text-3xl font-bold text-brand uppercase md:text-4xl">
              Napíš nám ju!
            </p>
          </div>
          <AskButton variant="light" className="shrink-0 self-start md:self-auto" />
        </div>
      </Section>
    </>
  )
}

export default SpojmeSa
