import Pill from '../components/Pill.tsx'
import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import { accentAt } from '../theme.ts'

const voteFacts = [
  'Náčelníctvo tvorí náčelník alebo náčelníčka a šesť členov N-SLSK.',
  'Voľby do orgánov SLSK sú tajné — vykonávajú sa odovzdaním volebných lístkov.',
  'Na lístku pre člena N-SLSK možno označiť najviac šesť kandidátov.',
  'Členmi sa stáva šesť kandidátov s najvyšším počtom hlasov.',
  'Snem je uznášaniaschopný pri účasti viac než polovice delegátov.',
]

const Snem = () => (
  <Section className="bg-sand">
    <div className="grid gap-12 md:grid-cols-2">
      <div>
        <SectionIntro
          eyebrow="Snem a voľby"
          title="O Náčelníctve rozhoduje snem"
          lead="Náčelníctvo volia delegáti Skautského snemu — najvyššieho orgánu Slovenského skautingu. Priebeh volieb upravuje Rokovací poriadok snemu."
        />
        <p className="mt-4 text-navy/70">
          Ak si delegát alebo delegátka snemu, tvoj hlas rozhoduje o smerovaní organizácie na ďalšie
          roky. Príď, pýtaj sa a rozhodni sa podľa programu, nie podľa mena.
        </p>
        <Pill className="mt-8 bg-navy px-5 py-2.5 text-white">
          <span aria-hidden="true">🗓</span> XX. skautský snem · jeseň 2026
        </Pill>
      </div>

      <div className="rounded-3xl border border-navy/10 bg-white p-8 shadow-sm">
        <h3 className="font-heading text-2xl font-bold text-navy">Ako prebieha voľba</h3>
        <ul className="mt-6 space-y-4">
          {voteFacts.map((fact, i) => {
            const accent = accentAt(i)

            return (
              <li key={fact} className="flex gap-3 text-navy/80">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${accent.soft} ${accent.text}`}
                >
                  ✓
                </span>
                <span>{fact}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  </Section>
)

export default Snem
