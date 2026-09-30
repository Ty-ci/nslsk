import Markdown from '@/app/_components/Markdown'
import type { SheetEvent } from '@/app/_lib/sheetContent'
import { offsetStatic } from '@/app/_lib/theme'

/** Today as `YYYY-MM-DD` in the visitor's own time zone. */
const todayIso = () => {
  const now = new Date()

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

// One meeting slot, off the `eventy` sheet: the occasion as the headline, the
// two hard facts on printed form lines, then whatever the candidates wrote —
// Markdown, so a sign-up link can live inside the description.
//
// Once its day is over the card stays on the list, faded, with its links
// printed as plain text: nobody should sign up for a meeting that has happened.
const EventCard = ({ event }: { event: SheetEvent }) => {
  const isPast = event.date !== undefined && event.date < todayIso()

  return (
    <li className={`flex flex-col gap-2 bg-cream p-4 ${offsetStatic} ${isPast ? 'opacity-50' : ''}`}>
      <dl className="space-y-1">
        {event.term && (
          <div className="flex items-baseline gap-3">
            <dd className="font-mono text-sm font-bold text-brand">{event.term}</dd>
          </div>
        )}
        {event.form && (
          <div className="flex items-baseline gap-3">
            <dd className="label text-ink/70">{event.form}</dd>
          </div>
        )}
      </dl>

      <h4 className="font-heading text-2xl/tight font-bold text-ink uppercase">
        {event.title || 'Stretnutie'}
      </h4>

      {event.description && (
        <Markdown size="sm" linksDisabled={isPast} className="mt-2">
          {event.description}
        </Markdown>
      )}
    </li>
  )
}

export default EventCard
