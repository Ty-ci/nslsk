import { phases, type PhaseState } from '@/app/(web)/onboarding/_data/phases'

const nodeStyles: Record<PhaseState, string> = {
  done: 'bg-navy text-white',
  current: 'bg-yellow text-navy ring-2 ring-navy ring-offset-2',
  upcoming: 'border-2 border-line bg-white text-muted',
}

const stateLabels: Record<PhaseState, string> = {
  done: 'za nami',
  current: 'práve teraz',
  upcoming: 'čaká nás',
}

// The onboarding timeline (DESIGN_SPECS.md §6.13): vertical on phones,
// horizontal from `md`. The connector after a node is yellow while the road
// up to it is travelled, grey beyond the current phase.
const PhaseStepper = ({ states }: { states: PhaseState[] }) => (
  <ol className="grid gap-0 md:grid-cols-6 md:gap-4">
    {phases.map((phase, index) => {
      const state = states[index] ?? 'upcoming'
      const isLast = index === phases.length - 1
      const travelled = state === 'done'

      return (
        <li
          key={phase.label}
          aria-current={state === 'current' ? 'step' : undefined}
          className="relative flex gap-4 pb-6 md:flex-col md:gap-3 md:pb-0"
        >
          {isLast ? null : (
            <span
              aria-hidden="true"
              className={`absolute top-8 bottom-0 left-[15px] w-[3px] md:top-[15px] md:-right-4 md:bottom-auto md:left-8 md:h-[3px] md:w-auto ${
                travelled ? 'bg-yellow' : 'bg-line'
              }`}
            />
          )}

          <span
            className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${nodeStyles[state]}`}
          >
            {state === 'done' ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="size-4"
              >
                <path d="m5 12 5 5 9-10" />
              </svg>
            ) : (
              index
            )}
          </span>

          <div>
            <p className="text-sm/5 font-semibold text-navy">{phase.label}</p>
            <p className="mt-0.5 text-[0.8125rem]/5 text-muted">{phase.when}</p>
            <p className="sr-only">Stav: {stateLabels[state]}</p>
          </div>
        </li>
      )
    })}
  </ol>
)

export default PhaseStepper
