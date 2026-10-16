import type { Metadata } from 'next'

import Eyebrow from '@/app/(web)/_components/Eyebrow'
import Section from '@/app/(web)/_components/Section'
import CallsTabs from '@/app/(web)/vyzvy/_components/CallsTabs'

export const metadata: Metadata = { title: 'Otvorené výzvy' }

// `?typ=`, `?proces=` and `?uzavrete=1` reopen a shared filtered view:
// rendered per request. The calls themselves come from the sheet, loaded in
// the browser after unlocking (`CallsTabs`).
export const dynamic = 'force-dynamic'

type Param = string | string[] | undefined

type CallsPageProps = {
  searchParams: Promise<{ typ?: Param; proces?: Param; uzavrete?: Param }>
}

const single = (value: Param): string | null => (typeof value === 'string' && value ? value : null)

const CallsPage = async ({ searchParams }: CallsPageProps) => {
  const { typ, proces, uzavrete } = await searchParams

  return (
    <>
      <Section py="pt-12 pb-10 md:pt-16 md:pb-14" labelledBy="calls-title">
        <Eyebrow>Výzvy N-SLSK</Eyebrow>
        <h1 id="calls-title" className="mt-5 text-h1 font-bold max-md:text-[2.125rem]/[1.15]">
          Otvorené výzvy
        </h1>
        <p className="mt-5 max-w-[65ch] text-lead text-pretty">
          Hľadáme dobrovoľníkov aj členov poradných zborov. Všetky výzvy sú tu na jednom mieste, s
          termínmi a s procesom, do ktorého patria. Celé znenie nájdeš vždy v dokumente výzvy.
        </p>
      </Section>

      <Section tone="surface" py="pt-6 pb-12 md:pt-8 md:pb-16">
        <CallsTabs
          initialFilters={{
            type: single(typ),
            process: single(proces),
            showClosed: single(uzavrete) === '1',
          }}
        />
      </Section>
    </>
  )
}

export default CallsPage
