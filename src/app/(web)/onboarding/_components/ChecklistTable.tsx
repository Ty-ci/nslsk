'use client'

import { Cell, Column, Row, Table, TableBody, TableHeader } from 'react-aria-components'

import Checkbox from '@/app/(web)/onboarding/_components/Checkbox'
import { DueDate, isOverdue, nicknameOf } from '@/app/(web)/onboarding/_components/TaskItem'
import type { AssigneeKey, OnboardingTask } from '@/app/(web)/onboarding/_lib/types'

type ChecklistTableProps = {
  groups: { label: string; when: string; tasks: OnboardingTask[] }[]
  /** Every assignee column, in sheet order. */
  assignees: AssigneeKey[]
  readOnly: boolean
  isBusy: (taskId: string, assignee: AssigneeKey) => boolean
  onToggle: (taskId: string, assignee: AssigneeKey, done: boolean) => void
  errors: Record<string, string>
}

// The title column stays put while the boxes scroll sideways on narrow screens.
const stickyCell = 'sticky left-0 z-10 bg-white'
const headCell = 'border-b border-line px-3 py-2 text-left text-xs font-semibold text-navy'
const bodyCell = 'border-b border-line px-3 py-2 align-top'

// The whole checklist at once: one row per task, one column per person, phases
// as divider rows. Same ticks as the list, just everybody side by side.
const ChecklistTable = ({
  groups,
  assignees,
  readOnly,
  isBusy,
  onToggle,
  errors,
}: ChecklistTableProps) => {
  const columnCount = 4 + assignees.length

  return (
    <div className="overflow-x-auto rounded-card border border-line bg-white">
      <Table aria-label="Checklist — všetky úlohy" className="w-full border-collapse text-sm">
        <TableHeader>
          <Column isRowHeader className={`${headCell} ${stickyCell} min-w-64`}>
            Úloha
          </Column>
          <Column className={`${headCell} min-w-40`}>Zodpovedný</Column>
          <Column className={headCell}>Termín</Column>
          <Column className={headCell}>Dôležitosť</Column>
          {assignees.map((key) => (
            <Column key={key} className={`${headCell} text-center whitespace-nowrap`}>
              {nicknameOf(key)}
            </Column>
          ))}
        </TableHeader>
        <TableBody>
          {groups.flatMap((group) => [
            <Row key={`phase-${group.label}`} id={`phase-${group.label}`}>
              <Cell colSpan={columnCount} className="border-b border-line bg-blue-tint px-3 py-2">
                <div className="sticky left-3 w-fit">
                  <span className="font-bold text-navy">{group.label}</span>
                  {group.when ? <span className="ml-3 text-muted">{group.when}</span> : null}
                </div>
              </Cell>
            </Row>,
            ...group.tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                assignees={assignees}
                readOnly={readOnly}
                isBusy={(assignee) => isBusy(task.id, assignee)}
                onToggle={(assignee, done) => onToggle(task.id, assignee, done)}
                error={errors[task.id]}
              />
            )),
          ])}
        </TableBody>
      </Table>
    </div>
  )
}

type TaskRowProps = Pick<ChecklistTableProps, 'assignees' | 'readOnly'> & {
  task: OnboardingTask
  isBusy: (assignee: AssigneeKey) => boolean
  onToggle: (assignee: AssigneeKey, done: boolean) => void
  error?: string
}

const TaskRow = ({ task, assignees, readOnly, isBusy, onToggle, error }: TaskRowProps) => {
  const done = Object.values(task.status).every(Boolean)

  return (
    <Row id={task.id}>
      <Cell className={`${bodyCell} ${stickyCell}`}>
        <span className={`font-semibold ${done ? 'text-muted' : 'text-ink'}`}>{task.title}</span>
        {error ? (
          <p role="alert" className="mt-1 font-semibold text-[#8a1c1c]">
            {error}
          </p>
        ) : null}
      </Cell>
      <Cell className={`${bodyCell} text-muted`}>{task.owner}</Cell>
      <Cell className={`${bodyCell} text-muted`}>
        {task.due ? <DueDate due={task.due} overdue={!done && isOverdue(task.due)} /> : null}
      </Cell>
      <Cell className={`${bodyCell} text-muted`}>{task.importance}</Cell>
      {assignees.map((key) => (
        <Cell key={key} className={`${bodyCell} text-center`}>
          {task.status[key] === undefined ? null : (
            <Checkbox
              aria-label={`${nicknameOf(key)}: ${task.title}`}
              checked={task.status[key]}
              disabled={readOnly}
              busy={isBusy(key)}
              onChange={(event) => onToggle(key, event.target.checked)}
            />
          )}
        </Cell>
      ))}
    </Row>
  )
}

export default ChecklistTable
