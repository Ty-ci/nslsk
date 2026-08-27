import Button from '@/app/_components/Button'
import Field from '@/app/_components/Field'
import Photo from '@/app/_components/Photo'
import Section from '@/app/_components/Section'
import { candidates } from '@/app/_data/content'
import { anchorHref } from '@/app/_lib/navigation'
import { inkAt, offsetStatic } from '@/app/_lib/theme'

// Alternating tilts so the four portraits look pasted up by hand, not laid out.
const TILTS = [-2.2, 1.6, 1.9, -1.4]

const HeroPhotos = () => {}

const Hero = () => (
  <Section py="pt-14 pb-20 md:pt-16 md:pb-24">
    <div className="flex flex-col justify-between gap-14 md:gap-16 lg:flex-row lg:*:max-w-[45%]">
      {/* The ballot itself: the poster's title block, filled in like a form. */}
      <div className={`relative bg-cream px-7 py-8 md:px-9 md:py-10 ${offsetStatic}`}>
        <h1 className="mt-7 font-display text-6xl leading-[0.85] tracking-tight uppercase md:text-7xl">
          <span className="block text-ink">Spolu</span>
          {/* Misregistered second pass — the red plate shifted off the black. */}
          <span className="relative mt-1 inline-block">
            <span aria-hidden="true" className="absolute inset-0 translate-1 text-brand">
              do toho
            </span>
            <span className="relative text-ink">do toho</span>
          </span>
        </h1>

        <p className="mt-8 max-w-md text-lg text-ink/75">
          Kandidujeme do Náčelníctva SLSK na obdobie 2026 – 2029 na tieto funkcie:
        </p>

        <dl className="space-y-3 pt-6">
          {/* <Field name="Kandidujú">{candidates.map((c) => c.name).join(' · ')}</Field>
          <Field name="Do orgánu">Náčelníctvo SLSK</Field>
          <Field name="Obdobie">2026 – 2029</Field>
          <Field name="Rozhoduje">Skautský snem</Field> */}
          {candidates.map((candidate) => (
            <Field
              key={`${candidate.name}-position`}
              name={`${candidate.fullName} - ${candidate.name}`}
            >
              {candidate.position}
            </Field>
          ))}
        </dl>

        <div className="mt-9 flex flex-wrap gap-4">
          <Button variant="sun" href={anchorHref('otazky')} className="font-bold tracking-wider">
            Pýtajte sa
          </Button>

          <Button href={anchorHref('spojme-sa')} variant="sun" className="font-bold tracking-wider">
            Stretnime sa
          </Button>
        </div>
      </div>

      {/* Four portraits pasted onto the facing sheet, captioned like plates. */}
      <ul className="grid grid-cols-4 gap-x-8 gap-y-9 sm:gap-x-10 md:mt-4 md:grid-cols-2">
        {candidates.map((candidate, i) => (
          <li key={candidate.name}>
            <Photo
              photoId={candidate.photoId}
              name={candidate.name}
              initials={candidate.initials}
              ink={inkAt(i)}
              tilt={TILTS[i % TILTS.length]}
            />
            <span className="mt-4 flex items-baseline gap-2 border-t-2 border-ink pt-2">
              <span className="font-heading text-xl leading-none font-bold text-ink uppercase transition-colors">
                {candidate.name}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  </Section>
)

export default Hero
