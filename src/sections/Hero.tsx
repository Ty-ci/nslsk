import Button from '../components/Button.tsx'
import Field from '../components/Field.tsx'
import Label from '../components/Label.tsx'
import Photo from '../components/Photo.tsx'
import Section from '../components/Section.tsx'
import Stamp from '../components/Stamp.tsx'
import { candidates } from '../content.ts'
import { inkAt, offsetStatic } from '../theme.ts'

// Alternating tilts so the four portraits look pasted up by hand, not laid out.
const TILTS = [-2.2, 1.6, 1.9, -1.4]

const Hero = () => (
  <Section py="pt-14 pb-20 md:pt-16 md:pb-24">
    <div className="grid items-start gap-14 md:grid-cols-[1fr_0.8fr] md:gap-16">
      {/* The ballot itself: the poster's title block, filled in like a form. */}
      <div className={`relative bg-cream px-7 py-8 md:px-9 md:py-10 ${offsetStatic}`}>
        {/* Approval stamp struck across the corner of the ballot. */}
        <div className="absolute -top-5 -right-4 z-10">
          <Stamp className="rotate-12 border-brand text-brand">
            Snem
            <br />
            <span className="text-lg">2026</span>
          </Stamp>
        </div>

        <Label className="text-brand">
          Kandidatúra do
          <br />
          Náčelníctva SLSK
        </Label>

        <h1 className="mt-7 font-display text-6xl leading-[0.85] tracking-tight uppercase md:text-7xl">
          <span className="block text-ink">Spolu</span>
          {/* Misregistered second pass — the red plate shifted off the black. */}
          <span className="relative mt-1 inline-block">
            <span aria-hidden="true" className="absolute inset-0 translate-1.5 text-brand">
              do toho
            </span>
            <span className="relative text-ink">do toho</span>
          </span>
        </h1>

        <p className="mt-8 max-w-md text-lg text-ink/75">
          Štyria kandidáti do Náčelníctva Slovenského skautingu a jeden spoločný program. Každý z
          nás prináša svoju tému — za program si stojíme celý, ako tím.
        </p>

        <dl className="mt-9 space-y-3 border-t-2 border-dashed border-ink/30 pt-6">
          <Field name="Kandidujú">{candidates.map((c) => c.name).join(' · ')}</Field>
          <Field name="Do orgánu">Náčelníctvo SLSK</Field>
          <Field name="Obdobie">2026 – 2029</Field>
          <Field name="Rozhoduje">Skautský snem</Field>
        </dl>

        <div className="mt-9 flex flex-wrap gap-4">
          <Button href="#kandidati" variant="sun">
            Spoznajte nás
          </Button>
          <Button href="#temy" variant="sketch">
            Spoločné témy
          </Button>
        </div>
      </div>

      {/* Four portraits pasted onto the facing sheet, captioned like plates. */}
      <ul className="grid grid-cols-2 gap-x-8 gap-y-9 sm:gap-x-10 md:mt-4">
        {candidates.map((candidate, i) => (
          <li key={candidate.name}>
            <a href="#kandidati" className="group block">
              <Photo
                photoId={candidate.photoId}
                name={candidate.name}
                initials={candidate.initials}
                ink={inkAt(i)}
                tilt={TILTS[i % TILTS.length]}
              />
              <span className="mt-4 flex items-baseline gap-2 border-t-2 border-ink pt-2">
                <span className="label text-brand">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-heading text-xl leading-none font-bold text-ink uppercase transition-colors group-hover:text-brand">
                  {candidate.name}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </Section>
)

export default Hero
