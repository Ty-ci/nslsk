import Button from '../components/Button.tsx'
import Eyebrow from '../components/Eyebrow.tsx'
import Section from '../components/Section.tsx'

const Kontakt = () => (
  <Section className="band-ink text-cream">
    <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-xl">
        <Eyebrow className="text-brand">Ozvi sa</Eyebrow>
        <h2 className="mt-5 font-display text-5xl leading-[0.9] tracking-tight uppercase md:text-7xl">
          Podporte našu
          <br />
          kandidatúru
        </h2>
        <p className="mt-6 text-lg text-cream/80">
          Máš otázku k programu alebo nám chceš pomôcť s kampaňou? Ozvi sa — a povedz o nás
          delegátom vo svojej oblasti.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Button href="mailto:pripraveni.viest@skauting.sk" variant="light">
          pripraveni.viest@skauting.sk
        </Button>
        <Button href="tel:+421900000000" variant="lightOutline">
          +421 900 000 000
        </Button>
      </div>
    </div>

    <div className="mt-16 flex flex-col gap-2 border-t-2 border-cream/20 pt-8 font-mono text-[11px] tracking-wide text-cream/50 uppercase sm:flex-row sm:items-center sm:justify-between">
      <p>© 2026 Pripravení viesť · Kandidáti do N-SLSK</p>
      <p>Ilustračná kampaň — mená a údaje sú vymyslené</p>
    </div>
  </Section>
)

export default Kontakt
