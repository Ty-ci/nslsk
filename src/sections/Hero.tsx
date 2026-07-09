import Button from '../components/Button.tsx'
import Eyebrow from '../components/Eyebrow.tsx'
import Section from '../components/Section.tsx'

const Hero = () => (
  <Section className="relative overflow-hidden bg-cream" py="py-24 md:py-32">
    {/* Playful, soft accent blobs floating behind the headline. */}
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-16 -right-16 size-72 rounded-full bg-gold/20 blur-2xl" />
      <div className="absolute -bottom-24 left-1/4 size-80 rounded-full bg-forest/15 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 size-40 rounded-full bg-brand/10 blur-2xl" />
    </div>

    <div className="relative">
      <Eyebrow>Kandidatúra do Náčelníctva Slovenského skautingu</Eyebrow>
      <h1 className="mt-5 font-display text-6xl leading-[0.95] tracking-tight text-navy uppercase md:text-8xl">
        Pripravení{' '}
        <span className="relative inline-block">
          viesť
          <span
            aria-hidden="true"
            className="absolute -bottom-2 left-0 h-3 w-full -rotate-1 rounded-full bg-brand/30"
          />
        </span>
      </h1>
      <p className="mt-8 max-w-2xl text-lg text-navy/70 md:text-xl">
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
  </Section>
)

export default Hero
