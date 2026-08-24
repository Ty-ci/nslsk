'use client'

import Link from 'next/link'

import Button from '@/app/_components/Button'
import Label from '@/app/_components/Label'
import Markdown from '@/app/_components/Markdown'
import Rule from '@/app/_components/Rule'
import Section from '@/app/_components/Section'
import Tbd from '@/app/_components/Tbd'
import { contact, qa } from '@/app/_data/content'
import { useSheetContent } from '@/app/_hooks/useSheetContent'
import { qaPath } from '@/app/_lib/navigation'
import type { SheetEvent } from '@/app/_lib/sheetContent'
import { offsetStatic } from '@/app/_lib/theme'

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

// The loudest section on the page: a thick bar of spot ink across the full
// width, the biggest headline, the most air. Everything else on the site leads
// here.
const Kontakt = () => {
  const { content, isLoading, hasFailed } = useSheetContent()
  const { events } = content

  return (
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

        {/* Can't make any of the dates? The written channel does the same job. */}
        <div className={`self-start bg-cream p-6 ${offsetStatic}`}>
          <h3 className="font-heading text-2xl leading-none font-bold text-ink uppercase">
            Nestíhate stretnutie?
          </h3>
          <p className="mt-4 text-ink/75">
            Napíšte nám otázku cez dotazník. Odpovedáme na všetky a odpovede zverejňujeme na stránke
            s otázkami, aby ich mal každý po ruke.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href={qa.formHref} target="_blank" rel="noreferrer" variant="sketch" size="sm">
              Napísať otázku
            </Button>
            <Link
              href={qaPath}
              className="border-b-2 border-ink/25 pb-0.5 label text-ink/70 hover:border-brand hover:text-brand"
            >
              Otázky a odpovede
            </Link>
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
            {isLoading ? 'načítavame' : events.length > 0 ? `${events.length} ks` : 'pripravujeme'}
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
  )
}

export default Kontakt
