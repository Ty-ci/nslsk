'use client'

import EditUnlock from '@/app/(web)/_components/EditUnlock'
import SheetLink from '@/app/(web)/_components/SheetLink'
import Tag from '@/app/(web)/_components/Tag'
import { statusTones } from '@/app/(web)/vyzvy/_components/CallCard'
import { plural, statusLabel } from '@/app/(web)/vyzvy/_lib/calls'
import type { CallsData, SheetIssue } from '@/app/(web)/vyzvy/_lib/types'
import type { CallsState } from '@/app/(web)/vyzvy/_lib/useCalls'

const IssueList = ({
  title,
  issues,
  tone,
}: {
  title: string
  issues: SheetIssue[]
  tone: string
}) =>
  issues.length > 0 ? (
    <section aria-label={title} className={`rounded-card p-4 ${tone}`}>
      <h3 className="text-sm font-bold">
        {title} ({issues.length})
      </h3>
      <ul className="mt-2">
        {issues.map((issue, index) => (
          <li
            // A row can have several issues of one level; position keeps them apart.
            // eslint-disable-next-line react/no-array-index-key
            key={`${issue.row}-${index}`}
            className="grid grid-cols-[4.5rem_1fr] gap-x-3 border-t border-current/10 py-2 text-sm/6"
          >
            <span className="font-semibold tabular-nums">Riadok {issue.row}</span>
            <div className="min-w-0">
              <p className="font-semibold">{issue.title}</p>
              <p>{issue.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  ) : null

const headCell = 'border-b border-line px-3 py-2 text-left text-xs font-semibold text-navy'
const bodyCell = 'border-b border-line px-3 py-2 align-top'

// Every row as the site reads it, so the admin can check a date or a status
// against the sheet without opening the page in another window.
const ReadTable = ({ data }: { data: CallsData }) => (
  <div className="overflow-x-auto rounded-card border border-line bg-white">
    <table className="w-full border-collapse text-sm">
      <caption className="sr-only">Ako web číta tabuľku výziev</caption>
      <thead>
        <tr>
          <th scope="col" className={headCell}>
            Riadok
          </th>
          <th scope="col" className={`${headCell} min-w-56`}>
            Názov
          </th>
          <th scope="col" className={headCell}>
            ID
          </th>
          <th scope="col" className={headCell}>
            Typ
          </th>
          <th scope="col" className={headCell}>
            Proces
          </th>
          <th scope="col" className={headCell}>
            Zverejniť od
          </th>
          <th scope="col" className={headCell}>
            Uzávierka
          </th>
          <th scope="col" className={headCell}>
            Na webe
          </th>
        </tr>
      </thead>
      <tbody>
        {[...data.calls]
          .sort((a, b) => a.row - b.row)
          .map((call) => (
            <tr key={call.id}>
              <td className={`${bodyCell} text-muted tabular-nums`}>{call.row}</td>
              <th scope="row" className={`${bodyCell} text-left font-semibold text-ink`}>
                {call.title}
              </th>
              <td className={`${bodyCell} font-mono text-xs text-muted`}>{call.id}</td>
              <td className={`${bodyCell} text-muted`}>{call.type}</td>
              <td className={`${bodyCell} text-muted`}>{call.process}</td>
              <td className={`${bodyCell} whitespace-nowrap text-muted tabular-nums`}>
                {call.publishFrom?.label}
              </td>
              <td className={`${bodyCell} whitespace-nowrap text-muted tabular-nums`}>
                {call.deadline?.label ?? call.deadlineText ?? 'priebežne'}
              </td>
              <td className={bodyCell}>
                <Tag tone={statusTones[call.status]} className="whitespace-nowrap">
                  {statusLabel(call)}
                </Tag>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
)

type CallsAdminProps = {
  calls: CallsState
  data: CallsData
}

// For whoever keeps the `vyzvy` tab: what the site couldn't read and why, and
// every row as the site understands it. Behind the edit password — the issues
// only travel to a browser that has it.
const CallsAdmin = ({ calls, data }: CallsAdminProps) => {
  if (!data.isEditor) {
    return calls.editState === 'checking' ? (
      <p role="status" className="py-12 text-center text-sm text-muted">
        Overujem prístup…
      </p>
    ) : (
      <EditUnlock onUnlock={calls.unlock}>
        Dáta sú pre tých, čo výzvy spravujú: kontrola tabuľky a náhľad konceptov.
      </EditUnlock>
    )
  }

  const errors = data.issues.filter((issue) => issue.level === 'error')
  const warnings = data.issues.filter((issue) => issue.level === 'warning')

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-card border border-line bg-white px-4 py-3">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2 className="font-semibold text-navy">Kontrola tabuľky</h2>
          <div className="ml-auto flex items-baseline gap-4">
            <SheetLink href={data.sheetUrl}>Hárok vyzvy</SheetLink>
            <button
              type="button"
              onClick={calls.reload}
              disabled={calls.isLoading}
              className="cursor-pointer rounded-leaf text-sm font-semibold text-navy underline decoration-line decoration-2 underline-offset-4 focus-ring hover:decoration-yellow disabled:cursor-wait disabled:text-muted"
            >
              {calls.isLoading ? 'Načítavam…' : 'Načítať znova'}
            </button>
          </div>
        </div>
        <p className="text-[0.8125rem]/5 text-muted">
          Po úprave tabuľky klikni na „Načítať znova“. Web číta tabuľku vždy čerstvú, nič sa nemusí
          nasadzovať.
        </p>
      </div>

      {data.issues.length === 0 ? (
        <p className="rounded-card bg-green/10 p-4 text-sm/6 font-semibold text-green">
          Všetko v poriadku: web prečítal {data.calls.length}{' '}
          {plural(data.calls.length, ['výzvu', 'výzvy', 'výziev'])} bez problémov.
        </p>
      ) : (
        <>
          <IssueList title="Chyby" issues={errors} tone="bg-[#fde8e8] text-[#8a1c1c]" />
          <IssueList title="Upozornenia" issues={warnings} tone="bg-yellow-tint text-navy" />
        </>
      )}

      {data.calls.length > 0 ? <ReadTable data={data} /> : null}
    </div>
  )
}

export default CallsAdmin
