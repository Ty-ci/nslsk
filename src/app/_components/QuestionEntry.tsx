import Markdown from '@/app/_components/Markdown'
import Stamp from '@/app/_components/Stamp'
import type { SheetQuestion } from '@/app/_lib/sheetContent'

const dateFormat = new Intl.DateTimeFormat('sk-SK', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
})

const formatDate = (isoDate: string) => dateFormat.format(new Date(`${isoDate}T00:00:00`))

// One entry off the `otazky` sheet, printed as a two-turn exchange: the question
// spoken from the left, our answer coming back from the right. The bubbles are
// still printed matter — 2px rules, flat fills, nothing rounded — so the tails
// are hard right-angled triangles (an outer ink one with a slightly smaller fill
// one on top, which is what draws the 2px outline around them).
//
// Unanswered but published questions stay visible: the reply is a stamp where
// the bubble would be, rather than nothing at all.
const QuestionEntry = ({ question }: { question: SheetQuestion }) => {
  return (
    <li className="flex flex-col gap-8 border-t-2 border-dashed border-ink/20 py-8 first:border-t-0 first:pt-0">
      <div className="relative max-w-xl self-start border-2 border-ink bg-cream-light px-5 py-4">
        <p className="flex flex-wrap items-baseline gap-x-2 label text-ink/80">
          {question.name && <span>{question.name}</span>}
          {question.name && question.date && <span aria-hidden="true">·</span>}
          {question.date && <span>{formatDate(question.date)}</span>}
        </p>
        <h4 className="mt-2 font-heading text-xl/tight font-medium text-ink">
          {question.question}
        </h4>

        {/* Tail, bottom left — the asker speaking from the floor. */}
        <span
          aria-hidden="true"
          className="absolute top-full left-8 size-0 border-t-18 border-r-18 border-t-ink border-r-transparent"
        />
        <span
          aria-hidden="true"
          className="absolute top-full left-8.5 -mt-0.5 size-0 border-t-15 border-r-15 border-t-cream-light border-r-transparent"
        />
      </div>

      {question.answer === '' ? (
        <Stamp className="w-fit rotate-2 border-ink/35 text-ink/45 max-lg:self-end lg:ml-4">
          Odpoveď pripravujeme
        </Stamp>
      ) : (
        <div className="relative w-fit border-2 border-ink bg-sand/70 px-5 py-4 max-lg:self-end lg:ml-4">
          <Markdown>{question.answer}</Markdown>

          {/* Tail, top right — the answer coming back from our side. */}
          <span
            aria-hidden="true"
            className="absolute right-8 bottom-full size-0 border-b-18 border-l-18 border-b-ink border-l-transparent"
          />
          <span
            aria-hidden="true"
            className="absolute right-8.5 bottom-full -mb-0.5 size-0 border-b-15 border-l-15 border-b-sand border-l-transparent"
          />
        </div>
      )}
    </li>
  )
}

export default QuestionEntry
