import { useState } from 'react'

import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import { type MetricColor, metrics } from '../content.ts'

const barBg: Record<MetricColor, string> = {
  brand: 'bg-brand',
  forest: 'bg-forest',
  ink: 'bg-ink',
}

const textColor: Record<MetricColor, string> = {
  brand: 'text-brand',
  forest: 'text-forest',
  ink: 'text-ink',
}

// Slovak thousands grouping; percentages keep their unit inline.
const format = (value: number, unit: string) =>
  unit === '%' ? `${value} %` : value.toLocaleString('sk-SK')

const Data = () => {
  const [metricId, setMetricId] = useState(metrics[0].id)
  const metric = metrics.find((m) => m.id === metricId) ?? metrics[0]

  // The focused year drives the headline readout; default to the latest.
  const [active, setActive] = useState(metric.points.length - 1)

  const selectMetric = (id: string, points: number) => {
    setMetricId(id)
    setActive(points - 1)
  }

  const values = metric.points.map((p) => p.value)
  // Scale to the target when there is one, so the bars visibly reach for it;
  // otherwise give the tallest bar a little headroom.
  const scaleMax = metric.target ?? Math.max(...values) * 1.12

  const point = metric.points[active]
  const prev = active > 0 ? metric.points[active - 1] : null
  const delta = prev ? point.value - prev.value : null

  return (
    <Section className="border-t-2 border-ink">
      <SectionIntro
        index="03"
        eyebrow="Rozhodujeme podľa dát"
        title="Rozhodnutia staviame na dobrej práci s dátami"
        lead="Nechceme sľubovať naslepo. Sledujeme, ako sa organizácii darí, a podľa toho volíme priority. Prepni si metriku a poklikaj po rokoch."
      />

      {/* Metric toggle — one series shown at a time. */}
      <div className="mt-10 flex flex-wrap gap-3">
        {metrics.map((m) => {
          const on = m.id === metric.id

          return (
            <button
              key={m.id}
              type="button"
              aria-pressed={on}
              onClick={() => selectMetric(m.id, m.points.length)}
              className={`border-2 border-ink px-4 py-2 font-mono text-xs font-bold tracking-wider uppercase transition-colors ${
                on ? 'bg-ink text-cream' : 'bg-cream text-ink hover:bg-ink/5'
              }`}
            >
              {m.tab}
            </button>
          )
        })}
      </div>

      <div className="mt-6 grid gap-8 border-2 border-ink bg-cream p-6 shadow-[6px_6px_0_0_var(--color-ink)] md:grid-cols-[minmax(0,17rem)_1fr] md:p-8">
        {/* Headline readout for the focused year. */}
        <div className="flex flex-col md:border-r-2 md:border-dashed md:border-ink/30 md:pr-8">
          <span className="font-mono text-xs font-bold tracking-wider text-ink/60 uppercase">
            {metric.label}
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`font-display text-6xl leading-none ${textColor[metric.color]}`}>
              {format(point.value, metric.unit)}
            </span>
            {metric.unit !== '%' && (
              <span className="font-mono text-xs text-ink/60 uppercase">{metric.unit}</span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-ink">rok {point.year}</span>
            {delta !== null && (
              <span
                className={`font-mono text-xs font-bold ${delta >= 0 ? 'text-forest' : 'text-brand'}`}
              >
                {delta >= 0 ? '▲' : '▼'} {format(Math.abs(delta), metric.unit)} r/r
              </span>
            )}
          </div>
          {metric.target && (
            <p className="mt-4 border-2 border-dashed border-ink/30 p-3 font-mono text-[11px] leading-relaxed text-ink/70 uppercase">
              Cieľ — {format(metric.target, metric.unit)}
            </p>
          )}
          <p className="mt-5 text-sm text-ink/80">{metric.insight}</p>
        </div>

        {/* Column chart. */}
        <div>
          <div className="relative flex h-64 items-end gap-1.5 md:h-72">
            {metric.target && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-dashed border-ink/50"
                style={{ bottom: `${(metric.target / scaleMax) * 100}%` }}
              >
                <span className="absolute -top-4 right-0 bg-cream px-1 font-mono text-[10px] font-bold tracking-wider text-ink/60 uppercase">
                  Cieľ {format(metric.target, metric.unit)}
                </span>
              </div>
            )}

            {metric.points.map((p, i) => {
              const on = i === active

              return (
                <button
                  key={p.year}
                  type="button"
                  aria-pressed={on}
                  aria-label={`Rok ${p.year}: ${format(p.value, metric.unit)} ${metric.unit === '%' ? '' : metric.unit}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group flex h-full flex-1 cursor-pointer flex-col justify-end gap-1 focus:outline-none"
                >
                  <span
                    className={`text-center font-mono text-[11px] font-bold transition-opacity ${
                      on ? `opacity-100 ${textColor[metric.color]}` : 'opacity-0'
                    }`}
                  >
                    {format(p.value, metric.unit)}
                  </span>
                  <span
                    className={`w-full border-2 border-ink transition-[height,opacity] duration-200 ${barBg[metric.color]} ${
                      on ? 'opacity-100' : 'opacity-55 group-hover:opacity-80'
                    }`}
                    style={{ height: `${(p.value / scaleMax) * 100}%` }}
                  />
                </button>
              )
            })}
          </div>

          {/* Year axis. */}
          <div className="mt-3 flex gap-1.5 border-t-2 border-ink pt-2">
            {metric.points.map((p, i) => (
              <span
                key={p.year}
                className={`flex-1 text-center font-mono text-[11px] tracking-wide uppercase ${
                  i === active ? 'font-bold text-ink' : 'text-ink/50'
                }`}
              >
                {p.year.slice(2)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 font-mono text-[10px] tracking-wider text-ink/50 uppercase">
        <span aria-hidden="true" className="inline-block size-2 bg-ink/40" />
        Ilustračné dáta — hodnoty sú vymyslené
      </p>
    </Section>
  )
}

export default Data
