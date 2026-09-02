import Markdown from '@/app/_components/Markdown'
import type { SheetEvent } from '@/app/_lib/sheetContent'
import { offsetStatic } from '@/app/_lib/theme'

// One meeting slot, off the `eventy` sheet: the occasion as the headline, the
// two hard facts on printed form lines, then whatever the candidates wrote —
// Markdown, so a sign-up link can live inside the description.
const EventCard = ({ event }: { event: SheetEvent }) => (
  <li className={`flex flex-col gap-2 bg-cream p-4 ${offsetStatic}`}>
    <dl className="space-y-1">
      {event.term && (
        <div className="flex items-baseline gap-3">
          <dt className="shrink-0 label text-ink/45">Termín:</dt>
          <dd className="font-mono text-sm font-bold text-brand">{event.term}</dd>
        </div>
      )}
      {event.form && (
        <div className="flex items-baseline gap-3">
          <dt className="shrink-0 label text-ink/45">Kde:</dt>
          <dd className="label text-ink/70">{event.form}</dd>
        </div>
      )}
    </dl>

    <h4 className="font-heading text-2xl/tight font-bold text-ink uppercase">
      {event.title || 'Stretnutie'}
    </h4>

    {event.description && (
      <Markdown size="sm" className="mt-2">
        {event.description}
      </Markdown>
    )}
  </li>
)

export default EventCard
