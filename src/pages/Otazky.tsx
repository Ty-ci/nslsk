import { Link } from 'react-router-dom'

import Button from '../components/Button.tsx'
import Label from '../components/Label.tsx'
import Markdown from '../components/Markdown.tsx'
import Rule from '../components/Rule.tsx'
import Section from '../components/Section.tsx'
import Stamp from '../components/Stamp.tsx'
import { qa } from '../content.ts'
import { useDocumentTitle } from '../hooks/useDocumentTitle.ts'
import { useSheetContent } from '../hooks/useSheetContent.ts'
import { sectionPath } from '../navigation.ts'
import type { SheetQuestion } from '../sheetContent.ts'
import { inkAt, offsetStatic } from '../theme.ts'

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

// One entry off the sheet: the question as a headline, who asked and when in
// mono caps, then the answer as running text. Unanswered but published
// questions stay visible — with the answer slot stamped, not hidden.
const QuestionEntry = ({ question, index }: { question: SheetQuestion; index: number }) => {
  const ink = inkAt(index)

  return (
    <li className="border-t-2 border-ink py-9 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-4">
        <span className={`shrink-0 font-display text-3xl leading-[0.8] ${ink.text}`}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="font-heading text-2xl/tight font-bold text-ink uppercase md:text-3xl">
          {question.question}
        </h2>
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

// The Q&A page: a subpage rather than a section of the one-pager, because it
// grows over time and is the thing people will link to on its own.
const Otazky = () => {
  const { content, isLoading, hasFailed } = useSheetContent()
  const { questions } = content

  useDocumentTitle('Otázky a odpovede')

  return (
    <>
      <Section py="py-14 md:py-20">
        <Link
          to={sectionPath('uvod')}
          className="inline-block border-b-2 border-ink/20 pb-0.5 label text-ink/55 hover:border-brand hover:text-brand"
        >
          ← Späť na program
        </Link>

        <div className="mt-10 max-w-3xl">
          <Label className="text-brand">Otázky a odpovede</Label>
          <h1 className="mt-6 font-display text-6xl leading-[0.9] tracking-tight text-ink uppercase md:text-8xl">
            Pýtajte sa
          </h1>
          <Rule className="mt-6 h-2 w-72 bg-brand" />
          <p className="mt-8 text-xl text-ink/75">{qa.intro}</p>
        </div>

        {/* The form is the whole point of the page — it gets a panel, not a
            footnote link. */}
        <div className={`mt-12 max-w-2xl bg-cream p-6 md:p-8 ${offsetStatic}`}>
          <h2 className="font-heading text-2xl leading-none font-bold text-ink uppercase">
            Máte otázku pre nás?
          </h2>
          <p className="mt-4 text-ink/75">{qa.formNote}</p>
          <Button
            href={qa.formHref}
            target="_blank"
            rel="noreferrer"
            variant="sun"
            className="mt-6"
          >
            Napísať otázku
          </Button>
        </div>
      </Section>

      <Section className="border-t-2 border-ink band-sand" py="py-16 md:py-24">
        <div className="border-t-2 border-ink pt-5">
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

      {/* Closing invitation, so the page ends where it started: with the form. */}
      <Section className="border-t-2 border-ink band-ink text-cream" py="py-14 md:py-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-xl font-heading text-3xl font-bold uppercase md:text-4xl">
            Nenašli ste svoju otázku? <span className="text-brand">Napíšte nám ju.</span>
          </p>
          <Button
            href={qa.formHref}
            target="_blank"
            rel="noreferrer"
            variant="light"
            className="shrink-0 self-start md:self-auto"
          >
            Napísať otázku
          </Button>
        </div>
      </Section>
    </>
  )
}

export default Otazky
