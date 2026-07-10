import Button from '../components/Button.tsx'
import Eyebrow from '../components/Eyebrow.tsx'
import Section from '../components/Section.tsx'
import { candidates } from '../content.ts'
import { offsetStatic } from '../theme.ts'

const Hero = () => (
  <Section className="relative overflow-hidden" py="py-20 md:py-28">
    <div className="grid items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
      {/* ── Poster column ─────────────────────────────────────────────── */}
      <div>
        <Eyebrow>Kandidatúra do Náčelníctva SLSK</Eyebrow>

        <h1 className="mt-6 font-display text-7xl leading-[0.85] tracking-tight uppercase md:text-8xl">
          <span className="block text-ink">Pripravení</span>
          {/* Misregistered second pass — the red plate shifted off the black. */}
          <span className="relative mt-1 inline-block">
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-1.5 text-brand"
            >
              viesť
            </span>
            <span className="relative text-ink">viesť</span>
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-lg text-ink/75">
          Štyria kandidáti. Jeden spoločný program pre Slovenský skauting na roky 2026 – 2030 —
          postavený na Stratégii 2030 a na skúsenostiach z klubovní, táborov a oblastí.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="#kandidati" variant="primary">
            Spoznaj kandidátov
          </Button>
          <Button href="#program" variant="outline">
            Náš program
          </Button>
        </div>
      </div>

      {/* ── Ballot column — the campaign framed as a real voting slip. ──── */}
      <div className="relative">
        {/* Rotated approval stamp overlapping the ballot. */}
        <div
          aria-hidden="true"
          className="absolute -top-6 -right-3 z-10 rotate-12 border-2 border-brand px-3 py-1.5 text-center font-mono text-xs font-bold tracking-widest text-brand uppercase"
        >
          Voľby
          <br />
          <span className="text-lg">2026</span>
        </div>

        <div className={`bg-cream p-6 ${offsetStatic}`}>
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <span className="font-mono text-xs font-bold tracking-widest uppercase">
              Volebný lístok
            </span>
            <span className="font-mono text-[10px] text-ink/50">RP · príl. 01</span>
          </div>

          <p className="mt-3 font-mono text-[11px] leading-relaxed text-ink/60 uppercase">
            Označ najviac 6 kandidátov
          </p>

          <ul className="mt-4 space-y-3">
            {candidates.map((candidate) => (
              <li key={candidate.name} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-5 shrink-0 items-center justify-center border-2 border-ink text-brand"
                >
                  ✕
                </span>
                <span className="flex-1">
                  <span className="font-heading text-lg leading-none font-bold text-ink">
                    {candidate.name}
                  </span>
                  <span className="ml-2 font-mono text-[10px] text-ink/50 uppercase">
                    {candidate.scoutName}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t-2 border-dashed border-ink/30 pt-3 font-mono text-[10px] text-ink/50 uppercase">
            Ilustračný lístok — mená sú vymyslené
          </p>
        </div>
      </div>
    </div>
  </Section>
)

export default Hero
