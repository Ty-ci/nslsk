'use client'

import AskButton from '@/app/_components/AskButton'
import Button from '@/app/_components/Button'
import EventCard from '@/app/_components/EventCard'
import Section from '@/app/_components/Section'
import Tbd from '@/app/_components/Tbd'
import { contact } from '@/app/_data/content'
import { useSheetContent } from '@/app/_hooks/useSheetContent'
import { anchorHref, qaAnchor } from '@/app/_lib/navigation'
import { offsetStatic } from '@/app/_lib/theme'

// The spoken half of the conversation: come and meet us, here are the dates.
// The written half — the form and every answer we have already given — is the
// band right underneath (`_sections/Otazky.tsx`); both read off the same sheet,
// so they belong on the same page rather than in a section and a subpage.
//
// The loudest band on the page: a thick bar of spot ink across the full width,
// the biggest headline, the most air. Everything else leads here.
const SpojmeSa = () => {
  const { content, isLoading, hasFailed } = useSheetContent()
  const { events } = content

  return (
    <Section className="border-t-2 border-ink bg-sand" py="py-24 md:py-36">
      <div className="max-w-3xl">
        <h2 className="mt-6 font-display text-6xl/[120%] tracking-tight text-ink uppercase md:text-8xl">
          Radi vás stretneme 🏕️
        </h2>
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
                  className="mt-1 flex size-8 shrink-0 items-center justify-center border-2 border-ink bg-cream-light font-mono text-sm font-bold text-brand"
                >
                  {i + 1}
                </span>
                <p className="font-heading text-3xl/tight font-bold text-ink uppercase">
                  {question}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Can't make any of the dates? The written channel does the same job —
            and it is right below, not on another page. */}
        <div className={`self-start bg-cream p-6 ${offsetStatic}`}>
          <h3 className="font-heading text-2xl leading-none font-bold text-ink uppercase">
            Nestíhate stretnutie?
          </h3>
          <p className="mt-4 text-ink/75">
            Napíšte nám otázku cez dotazník. Odpovedáme na všetky a odpovede zverejňujeme nižšie na
            tejto stránke, aby ich mal každý po ruke.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            <AskButton variant="sun" size="sm" />
            <Button variant="sketch" size="sm" href={anchorHref(qaAnchor)}>
              Zverejnené otázky
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-20 border-t-2 border-ink pt-5">
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
          <ul className="mt-8 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </ul>
        )}
      </div>
    </Section>
  )
}

export default SpojmeSa
