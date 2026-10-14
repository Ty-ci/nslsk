'use client'

import { useState } from 'react'

import Tabs from '@/app/(web)/_components/Tabs'
import type { PersonKey } from '@/app/(web)/_data/people'
import ChangelogPanel from '@/app/(web)/onboarding/_components/ChangelogPanel'
import ChecklistLoader from '@/app/(web)/onboarding/_components/ChecklistLoader'

type View = 'checklist' | 'zmeny'

// Checklist and its history, side by side as tabs. The history reloads every
// time its tab is opened, so it always includes the ticks made just before.
const OnboardingTabs = ({ initialPerson }: { initialPerson: PersonKey | null }) => {
  const [view, setView] = useState<View>('checklist')
  const [changelogOpenings, setChangelogOpenings] = useState(0)

  const select = (key: string) => {
    const next = key === 'zmeny' ? 'zmeny' : 'checklist'
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
          panel: <ChecklistLoader initialPerson={initialPerson} />,
        },
        {
          key: 'zmeny',
          label: 'História zmien',
          panel: <ChangelogPanel active={view === 'zmeny'} openings={changelogOpenings} />,
        },
      ]}
    />
  )
}

export default OnboardingTabs
