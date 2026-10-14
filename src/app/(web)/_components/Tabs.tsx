'use client'

import { type KeyboardEvent, type ReactNode, useId, useRef } from 'react'

type Tab = { key: string; label: ReactNode; panel: ReactNode }

type TabsProps = {
  /** Names the tab list for screen readers. */
  label: string
  tabs: Tab[]
  selected: string
  onSelect: (key: string) => void
}

// Underlined tabs (DESIGN_SPECS.md §6.16), keyed like the header menu: the
// active one gets the yellow bar. Follows the WAI-ARIA tabs pattern — arrow
// keys move between tabs, only the active tab is in the tab order. Every panel
// stays mounted (just hidden), so a tab keeps its state while you're away.
const Tabs = ({ label, tabs, selected, onSelect }: TabsProps) => {
  const baseId = useId()
  const refs = useRef(new Map<string, HTMLButtonElement>())

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = tabs.findIndex((tab) => tab.key === selected)
    const moves: Partial<Record<string, number>> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1,
    }
    const target = moves[event.key]
    if (target === undefined) {
      return
    }

    event.preventDefault()
    const next = tabs[(target + tabs.length) % tabs.length]
    onSelect(next.key)
    refs.current.get(next.key)?.focus()
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        className="flex gap-1 border-b border-line"
      >
        {tabs.map((tab) => {
          const active = tab.key === selected

          return (
            <button
              key={tab.key}
              ref={(node) => {
                if (node) {
                  refs.current.set(tab.key, node)
                } else {
                  refs.current.delete(tab.key)
                }
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.key}`}
              aria-selected={active}
              aria-controls={`${baseId}-panel-${tab.key}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelect(tab.key)}
              onKeyDown={onKeyDown}
              className={`-mb-px shrink-0 rounded-t-xl border-b-[3px] px-4 py-3 text-[0.9375rem] font-semibold whitespace-nowrap text-navy focus-ring transition-colors duration-200 ${
                active ? 'border-yellow' : 'border-transparent hover:bg-white/70'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.key}
          role="tabpanel"
          id={`${baseId}-panel-${tab.key}`}
          aria-labelledby={`${baseId}-tab-${tab.key}`}
          hidden={tab.key !== selected}
          className="pt-8"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  )
}

export default Tabs
