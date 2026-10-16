'use client'

import { useEffect, useState } from 'react'

import { people } from '@/app/(web)/_data/people'
import { phases } from '@/app/(web)/onboarding/_data/phases'
import type { AssigneeKey, LoadResult, OnboardingTask } from '@/app/(web)/onboarding/_lib/types'
import { getOnboarding, setTaskStatus } from '@/app/(web)/onboarding/actions'
import { editPasswordFor, passwordFor, useEditAccess } from '@/lib/access/client'

export const assigneeOrder: AssigneeKey[] = ['tim', ...people.map((person) => person.key)]

// Groups in the order of `phases`; a `Fáza` the timeline doesn't know (a typo
// in the sheet, a new phase) still shows, under „Ostatné", at the end.
export const groupByPhase = (tasks: OnboardingTask[]) => {
  const known = new Set<string>(phases.map((phase) => phase.label))
  const groups = phases.map((phase) => ({
    label: phase.label as string,
    when: phase.when as string,
    tasks: tasks.filter((task) => task.phase === phase.label),
  }))
  const other = tasks.filter((task) => !known.has(task.phase))

  return [...groups, { label: 'Ostatné', when: '', tasks: other }].filter(
    (group) => group.tasks.length > 0,
  )
}

/**
 * The checklist's data and ticks, shared by every view of it (list, table), so
 * a box ticked in one shows in the other. The sheet's data isn't rendered into
 * the page on the server: it only travels to a browser that sends the password
 * along, so it is fetched here once the access gate has let the page through.
 */
const useChecklist = () => {
  const [result, setResult] = useState<LoadResult | undefined>()
  const [busy, setBusy] = useState<ReadonlySet<string>>(new Set())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const edit = useEditAccess('/onboarding')

  useEffect(() => {
    let isActive = true
    void getOnboarding(passwordFor('/onboarding'))
      .catch(() => ({
        ok: false as const,
        error: 'Checklist sa nepodarilo načítať. Skús to znova.',
      }))
      .then((loaded) => {
        if (isActive) {
          setResult(loaded)
        }
      })

    return () => {
      isActive = false
    }
  }, [])

  // Mock data can't be saved anywhere; real data needs the edit password.
  const isMock = result?.ok === true && result.data.source !== 'sheet'
  const readOnly = isMock || edit.state !== 'open'

  const setCell = (taskId: string, assignee: AssigneeKey, done: boolean) =>
    setResult((current) =>
      current?.ok
        ? {
            ...current,
            data: {
              ...current.data,
              tasks: current.data.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, status: { ...task.status, [assignee]: done } }
                  : task,
              ),
            },
          }
        : current,
    )

  const markBusy = (key: string, on: boolean) =>
    setBusy((current) => {
      const next = new Set(current)
      if (on) {
        next.add(key)
      } else {
        next.delete(key)
      }

      return next
    })

  // Optimistic: the box flips at once and flips back, with a reason, if the
  // sheet refuses the write.
  const toggle = async (taskId: string, assignee: AssigneeKey, done: boolean) => {
    const key = `${taskId}:${assignee}`
    setCell(taskId, assignee, done)
    setErrors((current) =>
      Object.fromEntries(Object.entries(current).filter(([id]) => id !== taskId)),
    )
    markBusy(key, true)

    const outcome = await setTaskStatus(
      editPasswordFor('/onboarding'),
      taskId,
      assignee,
      done,
    ).catch(() => ({
      ok: false as const,
      error: 'Zmenu sa nepodarilo uložiť. Skús to znova.',
    }))

    if (!outcome.ok) {
      setCell(taskId, assignee, !done)
      setErrors((current) => ({ ...current, [taskId]: outcome.error }))
    }
    markBusy(key, false)
  }

  return {
    result,
    isMock,
    readOnly,
    edit,
    errors,
    isBusy: (taskId: string, assignee: AssigneeKey) => busy.has(`${taskId}:${assignee}`),
    toggle: (taskId: string, assignee: AssigneeKey, done: boolean) =>
      void toggle(taskId, assignee, done),
  }
}

export type ChecklistState = ReturnType<typeof useChecklist>

export default useChecklist
