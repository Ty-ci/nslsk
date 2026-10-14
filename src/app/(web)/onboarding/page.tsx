import type { Metadata } from 'next'

import Eyebrow from '@/app/(web)/_components/Eyebrow'
import Section from '@/app/(web)/_components/Section'
import { isPersonKey } from '@/app/(web)/_data/people'
import OnboardingTabs from '@/app/(web)/onboarding/_components/OnboardingTabs'
import PhaseStepper from '@/app/(web)/onboarding/_components/PhaseStepper'
import { phaseStates } from '@/app/(web)/onboarding/_data/phases'

export const metadata: Metadata = { title: 'Onboarding' }

// The stepper is dated by today, and `?kto=` picks the person: rendered per
// request. The checklist and its history come from the sheet, loaded in the
// browser after unlocking (`OnboardingTabs`).
export const dynamic = 'force-dynamic'

type OnboardingPageProps = {
  searchParams: Promise<{ kto?: string | string[] }>
}

const OnboardingPage = async ({ searchParams }: OnboardingPageProps) => {
  const { kto } = await searchParams
  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <Section py="pt-12 pb-14 md:pt-16 md:pb-20" labelledBy="onboarding-title">
        <Eyebrow>Onboarding N-SLSK 2026</Eyebrow>
        <h1 id="onboarding-title" className="mt-5 text-h1 font-bold max-md:text-[2.125rem]/[1.15]">
          Checklist nového Náčelníctva
        </h1>
        <p className="mt-5 max-w-[65ch] text-lead text-pretty">
          Vyber si, koho checklist chceš vidieť, a odškrtni, čo je hotové.
        </p>

        <div className="mt-12">
          <h2 className="sr-only">Fázy onboardingu</h2>
          <PhaseStepper states={phaseStates(today)} />
        </div>
      </Section>

      <Section tone="surface" py="pt-6 pb-12 md:pt-8 md:pb-16">
        <OnboardingTabs initialPerson={isPersonKey(kto) ? kto : null} />
      </Section>
    </>
  )
}

export default OnboardingPage
