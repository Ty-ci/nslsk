import Button from '../components/Button.tsx'
import Eyebrow from '../components/Eyebrow.tsx'
import Section from '../components/Section.tsx'
import { candidates } from '../content.ts'
import { offsetStatic } from '../theme.ts'

const Hero = () => (
  <Section className="relative overflow-hidden" py="pt-16 pb-20 md:pt-24 md:pb-28">
    <div className="grid items-center gap-14 md:grid-cols-[1.1fr_0.9fr]">
      {/* ── Poster column ─────────────────────────────────────────────── */}
      <div>
        <Eyebrow>Kandidatúra do Náčelníctva SLSK · 2026</Eyebrow>

        <h1 className="mt-6 font-display text-7xl leading-[0.85] tracking-tight uppercase md:text-8xl">
          <span className="block text-ink">Spolu</span>
          {/* Misregistered second pass — the red plate shifted off the black. */}
          <span className="relative mt-1 inline-block">
            <span aria-hidden="true" className="absolute inset-0 translate-1.5 text-brand">
              do toho
            </span>
            <span className="relative text-ink">do toho</span>
          </span>
        </h1>

        <p className="mt-8 max-w-xl text-lg text-ink/75">
          Štyria kandidáti do Náčelníctva Slovenského skautingu a jeden spoločný program. Každý z
          nás prináša svoju tému — za program si stojíme celý, ako tím.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="#kandidati" variant="primary">
            Spoznajte nás
          </Button>
          <Button href="#temy" variant="outline">
            Spoločné témy
          </Button>
        </div>
      </div>

      {/* ── Ballot column — the candidacy framed as a real voting slip. ─── */}
      <div className="relative">
        {/* Rotated approval stamp overlapping the ballot. */}
        <div
          aria-hidden="true"
          className="absolute -top-6 -right-3 z-10 rotate-12 border-2 border-brand bg-cream px-3 py-1.5 text-center font-mono text-xs font-bold tracking-widest text-brand uppercase"
        >
          Snem
          <br />
          <span className="text-lg">2026</span>
        </div>

        <div className={`bg-cream p-6 ${offsetStatic}`}>
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <span className="font-mono text-xs font-bold tracking-widest uppercase">
              Naša kandidátka
            </span>
            <span className="font-mono text-[10px] text-ink/50">N-SLSK</span>
          </div>

          <ul className="mt-4 space-y-3">
            {candidates.map((candidate) => (
              <li key={candidate.name} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-5 shrink-0 items-center justify-center border-2 border-ink text-brand"
                >
                  ✕
                </span>
                <a
                  href="#kandidati"
                  className="flex-1 font-heading text-xl leading-none font-bold text-ink uppercase hover:text-brand"
                >
                  {candidate.name}
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t-2 border-dashed border-ink/30 pt-3 font-mono text-[10px] leading-relaxed text-ink/55 uppercase">
            Kandidujeme spoločne, s programom, ktorý si vieme obhájiť pred snemom aj pred zbormi.
          </p>
        </div>
      </div>
    </div>
  </Section>
)

export default Hero
