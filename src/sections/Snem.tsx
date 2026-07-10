import Pill from '../components/Pill.tsx'
import Section from '../components/Section.tsx'
import SectionIntro from '../components/SectionIntro.tsx'
import { offsetStatic } from '../theme.ts'

const voteFacts = [
  'Náčelníctvo tvorí náčelník alebo náčelníčka a šesť členov N-SLSK.',
  'Voľby do orgánov SLSK sú tajné — vykonávajú sa odovzdaním volebných lístkov.',
  'Na lístku pre člena N-SLSK možno označiť najviac šesť kandidátov.',
  'Členmi sa stáva šesť kandidátov s najvyšším počtom hlasov.',
  'Snem je uznášaniaschopný pri účasti viac než polovice delegátov.',
]

const Snem = () => (
  <Section className="border-t-2 border-ink">
    <div className="grid gap-12 md:grid-cols-2">
      <div>
        <SectionIntro
          index="04"
          eyebrow="Snem a voľby"
          title="O Náčelníctve rozhoduje snem"
          lead="Náčelníctvo volia delegáti Skautského snemu — najvyššieho orgánu Slovenského skautingu. Priebeh volieb upravuje Rokovací poriadok snemu."
        />
        <p className="mt-5 text-ink/75">
          Ak si delegát alebo delegátka snemu, tvoj hlas rozhoduje o smerovaní organizácie na ďalšie
          roky. Príď, pýtaj sa a rozhodni sa podľa programu, nie podľa mena.
        </p>
        <Pill className="mt-8 border-ink bg-ink px-5 py-2.5 text-base text-cream">
          <span aria-hidden="true">🗓</span> XX. skautský snem · jeseň 2026
        </Pill>
      </div>

      <div className={`bg-cream p-8 ${offsetStatic}`}>
        <div className="flex items-center justify-between border-b-2 border-ink pb-3">
          <h3 className="font-heading text-2xl font-bold text-ink uppercase">Ako prebieha voľba</h3>
          <span className="font-mono text-[10px] text-ink/50">§ RP</span>
        </div>
        <ul className="mt-6 space-y-4">
          {voteFacts.map((fact, i) => (
            <li key={fact} className="flex gap-3 text-ink/85">
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center border-2 border-ink font-mono text-xs font-bold text-brand"
              >
                {i + 1}
              </span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </Section>
)

export default Snem
