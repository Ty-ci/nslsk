'use client'

import { useState } from 'react'

import Avatar from '@/app/(web)/_components/Avatar'
import ProgressBar from '@/app/(web)/_components/ProgressBar'
import SheetLink from '@/app/(web)/_components/SheetLink'
import { people, type PersonKey } from '@/app/(web)/_data/people'
import TaskItem from '@/app/(web)/onboarding/_components/TaskItem'
import type { AssigneeKey, OnboardingData, OnboardingTask } from '@/app/(web)/onboarding/_lib/types'
import {
  assigneeOrder,
  type ChecklistState,
  groupByPhase,
} from '@/app/(web)/onboarding/_lib/useChecklist'

/** The boxes a task shows in the current view: its team box, or its people's. */
const visibleAssignees = (task: OnboardingTask, selected: PersonKey | null): AssigneeKey[] =>
  assigneeOrder.filter(
    (key) =>
      task.status[key] !== undefined && (selected === null || key === 'tim' || key === selected),
  )

/** A task is done in the current view once every box it shows is ticked. */
const isDone = (task: OnboardingTask, selected: PersonKey | null) =>
  visibleAssignees(task, selected).every((key) => task.status[key] === true)

/** Done / total over the cells of one assignee — or of everyone, for `null`. */
const progressOf = (tasks: OnboardingTask[], who: AssigneeKey | null) =>
  tasks.reduce(
    (count, task) => {
      const values = who === null ? Object.values(task.status) : [task.status[who]]
      values.forEach((value) => {
        if (value !== undefined) {
          count.total += 1
          count.done += value ? 1 : 0
        }
      })

      return count
    },
    { done: 0, total: 0 },
  )

type ChecklistProps = {
  data: OnboardingData
  checklist: ChecklistState
  initialPerson: PersonKey | null
}

// The checklist as a list, one person (or the whole team) at a time.
const Checklist = ({ data, checklist, initialPerson }: ChecklistProps) => {
  const { tasks } = data
  const { readOnly, isBusy, toggle, errors } = checklist
  const [selected, setSelected] = useState<PersonKey | null>(initialPerson)

  const select = (key: PersonKey | null) => {
    setSelected(key)
    // Shareable without a server round trip: `?kto=zved` opens Zved's view.
    window.history.replaceState(null, '', key ? `?kto=${key}` : window.location.pathname)
  }

  const visibleTasks = tasks.filter((task) => visibleAssignees(task, selected).length > 0)
  const everyone = progressOf(tasks, null)
  const person = people.find((candidate) => candidate.key === selected)
  const progress = person ? progressOf(tasks, person.key) : everyone

  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:items-start">
      <aside className="lg:sticky lg:top-32">
        <h2 id="filter-title" className="eyebrow text-navy">
          Koho checklist
        </h2>
        <ul
          aria-labelledby="filter-title"
          className="mt-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-1"
        >
          {[
            { key: null, name: 'Celé náčelníctvo', area: 'všetky úlohy', progress: everyone },
            ...people.map((member) => ({
              key: member.key,
              name: member.nickname,
              area: member.area,
              progress: progressOf(tasks, member.key),
            })),
          ].map(({ key, name, area, progress: count }) => {
            const active = selected === key

            return (
              <li key={key ?? 'all'}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => select(key)}
                  className={`flex w-full items-center gap-2 rounded-leaf border px-2.5 py-1.5 text-left text-sm focus-ring transition-colors duration-200 ${
                    active
                      ? 'border-navy bg-navy text-white'
                      : 'border-line bg-white text-navy hover:border-navy'
                  }`}
                >
                  {key === null ? (
                    <span
                      aria-hidden="true"
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-yellow text-xs font-bold text-navy"
                    >
                      N
                    </span>
                  ) : (
                    <Avatar name={name} className="size-7! text-xs!" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold">{name}</span>
                    <span
                      className={`block truncate text-xs max-lg:hidden ${active ? 'text-white/80' : 'text-muted'}`}
                    >
                      {area}
                    </span>
                  </span>
                  <span className="text-xs font-semibold tabular-nums">
                    {count.done}/{count.total}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <SheetLink href={data.sheetUrl} className="mt-3">
          Zdrojová tabuľka
        </SheetLink>
      </aside>

      <div>
        <div className="mb-4 rounded-card border border-line bg-white px-4 py-3">
          <h2 className="font-semibold text-navy">
            {person ? `${person.nickname} — ${person.area}` : 'Celé náčelníctvo'}
          </h2>
          <ProgressBar
            className="mt-2"
            done={progress.done}
            total={progress.total}
            label={`Splnené úlohy: ${person ? person.nickname : 'celé náčelníctvo'}`}
          />
          {person ? (
            <p className="mt-2 text-[0.8125rem] text-muted">
              Spoločné úlohy tímu sú v zozname tiež, do tohto čísla sa však nerátajú.
            </p>
          ) : null}
        </div>

        {groupByPhase(visibleTasks).map((group) => {
          const doneCount = group.tasks.filter((task) => isDone(task, selected)).length

          return (
            <details
              key={group.label}
              className="group/phase mb-3 rounded-card border border-line bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center gap-3 rounded-card px-4 py-3 focus-ring [&::-webkit-details-marker]:hidden">
                <h3 className="text-lg font-bold text-navy">{group.label}</h3>
                {group.when ? (
                  <span className="text-sm text-muted max-sm:hidden">{group.when}</span>
                ) : null}
                <span
                  className={`ml-auto text-sm font-semibold tabular-nums ${
                    doneCount === group.tasks.length ? 'text-green' : 'text-muted'
                  }`}
                >
                  {doneCount}/{group.tasks.length}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="size-4 shrink-0 text-navy transition-transform duration-200 group-open/phase:rotate-180"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <ul className="border-t border-line px-4">
                {group.tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    assignees={visibleAssignees(task, selected)}
                    readOnly={readOnly}
                    isBusy={(assignee) => isBusy(task.id, assignee)}
                    onToggle={(assignee, done) => toggle(task.id, assignee, done)}
                    error={errors[task.id]}
                  />
                ))}
              </ul>
            </details>
          )
        })}
      </div>
    </div>
  )
}

export default Checklist
