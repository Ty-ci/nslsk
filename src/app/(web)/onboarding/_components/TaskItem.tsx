'use client'

import { type ReactNode, useId, useState } from 'react'

import { people } from '@/app/(web)/_data/people'
import Checkbox from '@/app/(web)/onboarding/_components/Checkbox'
import type { AssigneeKey, OnboardingTask } from '@/app/(web)/onboarding/_lib/types'

type TaskItemProps = {
  task: OnboardingTask
  /** The assignees whose boxes this row shows, in sheet order. */
  assignees: AssigneeKey[]
  readOnly: boolean
  isBusy: (assignee: AssigneeKey) => boolean
  onToggle: (assignee: AssigneeKey, done: boolean) => void
  error?: string
}

export const nicknameOf = (key: AssigneeKey): string =>
  key === 'tim' ? 'Tím' : (people.find((person) => person.key === key)?.nickname ?? key)

/** `do 25. 10. 2026` → that day, or `undefined` for a deadline in words. */
const parseDue = (due: string): Date | undefined => {
  const match = /(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})/.exec(due)

  return match ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])) : undefined
}

// The year is noise while it's this one: `do 25. 10. 2026` reads `do 25. 10.`
const shortDue = (due: string): string => {
  const year = String(new Date().getFullYear())

  return due.endsWith(year) ? due.slice(0, -year.length).trimEnd() : due
}

export const isOverdue = (due: string): boolean => {
  const date = parseDue(due)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return date !== undefined && date < today
}

// The only part of a row allowed to raise its voice: a deadline that has passed
// on a task still open.
export const DueDate = ({ due, overdue }: { due: string; overdue: boolean }) => (
  <span
    className={`whitespace-nowrap tabular-nums ${overdue ? 'font-semibold text-[#8a1c1c]' : ''}`}
  >
    {shortDue(due)}
    {overdue ? <span className="sr-only"> (po termíne)</span> : null}
  </span>
)

const TeamMark = () => (
  <span className="inline-flex items-center gap-1">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-3.5"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
    spoločná úloha
  </span>
)

const DetailsToggle = ({
  open,
  controls,
  onToggle,
}: {
  open: boolean
  controls: string
  onToggle: () => void
}) => (
  <button
    type="button"
    aria-expanded={open}
    aria-controls={controls}
    onClick={onToggle}
    className="inline-flex cursor-pointer items-center gap-0.5 rounded-leaf underline decoration-line decoration-1 underline-offset-2 focus-ring transition-colors hover:text-navy hover:decoration-navy"
  >
    Podrobnosti
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`size-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>
)

/** Secondary facts as one muted line, `·`-separated. */
const MetaLine = ({ items }: { items: { key: string; node: ReactNode }[] }) =>
  items.length > 0 ? (
    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[0.8125rem]/5 text-muted">
      {items.map(({ key, node }, index) => (
        <span key={key} className="inline-flex items-center gap-2">
          {index > 0 ? <span aria-hidden="true">·</span> : null}
          {node}
        </span>
      ))}
    </div>
  ) : null

type PersonBoxesProps = Pick<
  TaskItemProps,
  'task' | 'assignees' | 'readOnly' | 'isBusy' | 'onToggle'
> & { titleId: string }

// Everyone's view of a per-person task: a quiet row of named boxes, no chips —
// the ticks themselves are what should stand out.
const PersonBoxes = ({
  task,
  assignees,
  readOnly,
  isBusy,
  onToggle,
  titleId,
}: PersonBoxesProps) => (
  <fieldset className="mt-1.5">
    <legend className="sr-only">Kto má úlohu hotovú: {task.title}</legend>
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {assignees.map((key) => (
        <label
          key={key}
          htmlFor={`${titleId}-${key}`}
          className="flex min-h-8 cursor-pointer items-center gap-1.5 text-sm text-muted transition-colors duration-150 hover:text-navy has-checked:text-navy has-disabled:cursor-not-allowed"
        >
          <Checkbox
            id={`${titleId}-${key}`}
            checked={task.status[key] === true}
            disabled={readOnly}
            busy={isBusy(key)}
            onChange={(event) => onToggle(key, event.target.checked)}
          />
          {nicknameOf(key)}
        </label>
      ))}
    </div>
  </fieldset>
)

const DoneMark = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label="Hotovo"
    className="mt-1 size-4 shrink-0 text-green"
  >
    <path d="m5 12 5 5 9-10" />
  </svg>
)

const Details = ({ id, hidden, task }: { id: string; hidden: boolean; task: OnboardingTask }) => (
  <div id={id} hidden={hidden} className="mt-1.5 max-w-[65ch] text-sm/6 text-pretty">
    {task.description ? <p>{task.description}</p> : null}
    {task.source ? <p className="mt-1 text-xs text-neutral-400">Zdroj: {task.source}</p> : null}
  </div>
)

// One task, read in a fixed order: status and title on the first line, the
// deadline aligned on the right so a phase's dates scan as one column, and
// who/what-kind as a single quiet line underneath.
const TaskItem = (props: TaskItemProps) => {
  const { task, assignees, readOnly, isBusy, onToggle, error } = props
  const [showDetails, setShowDetails] = useState(false)
  const detailsId = useId()
  const single = assignees.length === 1 ? assignees[0] : undefined
  const doneCount = assignees.filter((key) => task.status[key] === true).length
  const done = assignees.length > 0 && doneCount === assignees.length
  const overdue = !done && task.due !== '' && isOverdue(task.due)
  const titleId = `task-${task.id}`
  const hasDetails = Boolean(task.description || task.source)

  const meta = [
    { key: 'owner', node: task.owner || null },
    { key: 'team', node: task.status.tim === undefined ? null : <TeamMark /> },
    { key: 'importance', node: task.importance ? `${task.importance} dôležitosť` : null },
    // On phones the deadline joins this line instead of its own column.
    {
      key: 'due',
      node: task.due ? (
        <span className="sm:hidden">
          <DueDate due={task.due} overdue={overdue} />
        </span>
      ) : null,
    },
    {
      key: 'details',
      node: hasDetails ? (
        <DetailsToggle
          open={showDetails}
          controls={detailsId}
          onToggle={() => setShowDetails((open) => !open)}
        />
      ) : null,
    },
  ].filter((item) => item.node !== null)

  return (
    <li className="border-b border-line py-3 last:border-b-0">
      <div className="flex gap-3">
        {single ? (
          <label
            htmlFor={`${titleId}-${single}`}
            className="-m-2.5 flex size-11 shrink-0 cursor-pointer items-center justify-center has-disabled:cursor-not-allowed"
          >
            <Checkbox
              id={`${titleId}-${single}`}
              aria-labelledby={titleId}
              checked={task.status[single] === true}
              disabled={readOnly}
              busy={isBusy(single)}
              onChange={(event) => onToggle(single, event.target.checked)}
            />
          </label>
        ) : (
          // As wide as the checkbox cell, so every title in a phase starts on one line.
          <span
            aria-hidden="true"
            className="w-6 shrink-0 pt-0.5 text-center text-xs/5 font-semibold text-muted tabular-nums"
          >
            {doneCount}/{assignees.length}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-4">
            <p className="flex min-w-0 flex-1 items-start gap-1.5">
              <span id={titleId} className={`font-semibold ${done ? 'text-muted' : 'text-ink'}`}>
                {task.title}
              </span>
              {done ? <DoneMark /> : null}
            </p>
            {task.due ? (
              <span className="pt-0.5 text-sm text-muted max-sm:hidden">
                <DueDate due={task.due} overdue={overdue} />
              </span>
            ) : null}
          </div>

          <MetaLine items={meta} />

          {hasDetails ? <Details id={detailsId} hidden={!showDetails} task={task} /> : null}

          {single ? null : <PersonBoxes {...props} titleId={titleId} />}

          {error ? (
            <p role="alert" className="mt-2 text-sm font-semibold text-[#8a1c1c]">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  )
}

export default TaskItem
