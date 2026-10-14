// The onboarding timeline, after the phased process in the Skautské huby
// onboarding proposal (10/2026). A task's `Fáza` cell in the sheet names one of
// these labels; the order here is the order on the page. `until` is the last
// day of the phase and drives the stepper: past phases read as done, the first
// one not yet over as current.

export const phases = [
  { label: 'Na sneme', when: '10. – 11. 10. 2026', until: '2026-10-11' },
  { label: 'Pred prvým stretnutím', when: 'do 6. 11. 2026', until: '2026-11-05' },
  { label: 'Prvé stretnutie a Vstupný kurz', when: '6. – 8. 11. 2026', until: '2026-11-08' },
  { label: 'Do 3 mesiacov', when: 'do 11. 1. 2027', until: '2027-01-11' },
  { label: 'Prvých 100 dní', when: 'do Malého snemu, 2/2027', until: '2027-02-28' },
  { label: 'Reflexia', when: 'po 100 dňoch a raz ročne', until: '2027-12-31' },
] as const

export type PhaseState = 'done' | 'current' | 'upcoming'

/** Each phase's state relative to `today` (an ISO date). */
export const phaseStates = (today: string): PhaseState[] => {
  const currentIndex = phases.findIndex((phase) => phase.until >= today)

  return phases.map((_, index) => {
    if (currentIndex === -1 || index < currentIndex) {
      return 'done'
    }

    return index === currentIndex ? 'current' : 'upcoming'
  })
}
