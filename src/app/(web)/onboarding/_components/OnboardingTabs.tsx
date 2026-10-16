'use client'

import { useState } from 'react'

import Tabs from '@/app/(web)/_components/Tabs'
import type { PersonKey } from '@/app/(web)/_data/people'
import ChangelogPanel from '@/app/(web)/onboarding/_components/ChangelogPanel'
import Checklist from '@/app/(web)/onboarding/_components/Checklist'
import ChecklistGate from '@/app/(web)/onboarding/_components/ChecklistGate'
import ChecklistTable from '@/app/(web)/onboarding/_components/ChecklistTable'
import SheetLink from '@/app/(web)/onboarding/_components/SheetLink'
import useChecklist, { assigneeOrder, groupByPhase } from '@/app/(web)/onboarding/_lib/useChecklist'

type View = 'checklist' | 'zmeny' | 'data'

const views: View[] = ['checklist', 'zmeny', 'data']

// The checklist as a list, its history, and the whole checklist as one table,
// side by side as tabs. The list and the table share one loaded checklist, so
// a box ticked in one is ticked in the other. The history reloads every time
// its tab is opened, so it always includes the ticks made just before.
const OnboardingTabs = ({ initialPerson }: { initialPerson: PersonKey | null }) => {
  const [view, setView] = useState<View>('checklist')
  const [changelogOpenings, setChangelogOpenings] = useState(0)
  const checklist = useChecklist()

  const select = (key: string) => {
    const next = views.find((candidate) => candidate === key) ?? 'checklist'
    if (next === 'zmeny' && view !== 'zmeny') {
      setChangelogOpenings((count) => count + 1)
    }
    setView(next)
  }

  return (
    <Tabs
      label="Onboarding"
      selected={view}
      onSelect={select}
      tabs={[
        {
          key: 'checklist',
          label: 'Checklist',
          panel: (
            <ChecklistGate checklist={checklist}>
              {(data) => (
                <Checklist data={data} checklist={checklist} initialPerson={initialPerson} />
              )}
            </ChecklistGate>
          ),
        },
        {
          key: 'zmeny',
          label: 'História zmien',
          panel: <ChangelogPanel active={view === 'zmeny'} openings={changelogOpenings} />,
        },
        {
          key: 'data',
          label: 'Dáta',
          panel: (
            <ChecklistGate checklist={checklist}>
              {(data) => (
                <div className="flex flex-col gap-3">
                  <SheetLink href={data.sheetUrl} className="self-end">
                    Zdrojová tabuľka
                  </SheetLink>
                  <ChecklistTable
                    groups={groupByPhase(data.tasks)}
                    assignees={assigneeOrder}
                    readOnly={checklist.readOnly}
                    isBusy={checklist.isBusy}
                    onToggle={checklist.toggle}
                    errors={checklist.errors}
                  />
                </div>
              )}
            </ChecklistGate>
          ),
        },
      ]}
    />
  )
}

export default OnboardingTabs
