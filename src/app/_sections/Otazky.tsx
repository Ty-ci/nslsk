'use client'

import { useRef, useState } from 'react'

import AskButton from '@/app/_components/AskButton'
import Pagination from '@/app/_components/Pagination'
import QuestionEntry from '@/app/_components/QuestionEntry'
import Rule from '@/app/_components/Rule'
import Section from '@/app/_components/Section'
import { qa } from '@/app/_data/content'
import { useSheetContent } from '@/app/_hooks/useSheetContent'
import { qaAnchor } from '@/app/_lib/navigation'
import { offsetStatic } from '@/app/_lib/theme'

// Long lists get paged rather than printed in full: ten exchanges is about as
// much as one run of scrolling can carry.
const perPage = 10

// The written half of the conversation started in „Radi vás stretneme"
// (`_sections/SpojmeSa.tsx`): the form, and every answer we have already given.
// It keeps an anchor of its own, because it used to be a page and links to it
// are already out there.
//
// Two bands: the Q&A itself, and the closing nudge that sends anyone still
// holding a question back to the form.
const Otazky = () => {
  const { content, isLoading, hasFailed } = useSheetContent()
  const { questions } = content
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLOListElement>(null)

  // The sheet loads after the first render, so the page number is clamped on
  // read rather than reset in an effect: whatever is in state, we never slice
  // past the end of the list.
  const pageCount = Math.max(1, Math.ceil(questions.length / perPage))
  const currentPage = Math.min(page, pageCount)
  const firstOnPage = (currentPage - 1) * perPage
  const visibleQuestions = questions.slice(firstOnPage, firstOnPage + perPage)

  // Paging keeps the reader where the list starts, not where the last answer of
  // the previous page happened to end.
  const goToPage = (next: number) => {
    setPage(next)
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Section
        id={qaAnchor}
        className="scroll-mt-20 border-t-2 border-ink bg-cream"
        py="py-16 md:py-24"
      >
        <div className="max-w-3xl">
          <h3 className="mt-6 font-display text-5xl leading-[0.9] tracking-tight text-ink uppercase md:text-7xl">
            Pýtajte sa
          </h3>
          <Rule className="mt-6 h-2 w-56 bg-brand" />
          <p className="mt-8 text-xl text-ink/75">{qa.intro}</p>
        </div>

        {/* The form is the whole point of this half — it gets a panel, not a
            footnote link. */}
        <div className={`mt-12 max-w-2xl bg-cream-light p-6 md:p-8 ${offsetStatic}`}>
          <h4 className="font-heading text-2xl leading-none font-bold text-ink uppercase">
            Máte otázky?
          </h4>
          <p className="mt-4 text-ink/75">{qa.formNote}</p>
          <AskButton variant="sun" className="mt-6" />
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
            <p className="mt-3 text-ink/75">Žiadnu otázku sme ešte nezverejnili. Buďte prví!</p>
          </div>
        )}

        {questions.length > 0 && (
          <>
            <ol ref={listRef} className="mt-12 scroll-mt-24">
              {visibleQuestions.map((question) => (
                <QuestionEntry key={question.id} question={question} />
              ))}
            </ol>

            <Pagination
              page={currentPage}
              pageCount={pageCount}
              onPageChange={goToPage}
              className="mt-10 border-t-2 border-dashed border-ink/20 pt-8"
            />
          </>
        )}
      </Section>

      {/* Closing invitation, so the conversation ends where it started: talk to us. */}
      <Section className="border-t-2 border-ink bg-ink/90 text-cream" py="py-14 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p className="max-w-xl font-heading text-3xl font-bold uppercase md:text-4xl">
              Ostala v tebe otázka?
            </p>
            <p className="max-w-xl font-heading text-3xl font-bold text-brand uppercase md:text-4xl">
              Napíš nám ju
            </p>
          </div>
          <AskButton variant="sketch" className="shrink-0 self-start md:self-auto" />
        </div>
      </Section>
    </>
  )
}

export default Otazky
