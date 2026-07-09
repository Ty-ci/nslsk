import Button from '../components/Button.tsx'
import Section from '../components/Section.tsx'

const Kontakt = () => (
  <Section className="bg-navy text-white">
    <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-xl">
        <h2 className="font-display text-4xl/tight tracking-tight uppercase md:text-6xl">
          Podporte našu kandidatúru
        </h2>
        <p className="mt-5 text-lg text-white/80">
          Máš otázku k programu alebo nám chceš pomôcť s kampaňou? Ozvi sa — a povedz o nás
          delegátom vo svojej oblasti.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <Button href="mailto:pripraveni.viest@skauting.sk" variant="light">
          pripraveni.viest@skauting.sk
        </Button>
        <Button href="tel:+421900000000" variant="lightOutline">
          +421 900 000 000
        </Button>
      </div>
    </div>

    <div className="mt-16 flex flex-col gap-2 border-t border-white/15 pt-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
      <p>© 2026 Pripravení viesť · Kandidáti do Náčelníctva SLSK</p>
      <p>Ilustračná kampaň — mená a údaje sú vymyslené.</p>
    </div>
  </Section>
)

export default Kontakt
