import { nextMeeting } from '../content.ts'
import Button from './Button.tsx'
import Label from './Label.tsx'

// Full-bleed invitation directly under the hero — the first thing after the
// headline, because meeting people is the point of the whole site. Once dates
// land in `content.ts`, the copy switches from an offer to a concrete date.
const InviteBand = () => (
  <aside className="border-y-2 border-ink band-ink text-cream">
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-14 md:flex-row md:items-center md:justify-between md:p-16">
      <div className="max-w-xl">
        <Label className="text-brand">Stretnime sa</Label>
        <p className="mt-4 font-heading text-3xl font-bold uppercase md:text-4xl">
          {nextMeeting ? (
            <>
              Najbližšie sa vidíme {nextMeeting.date} o {nextMeeting.time} — {nextMeeting.form}.
            </>
          ) : (
            <>
              Radi by sme si to s vami vypočuli osobne.{' '}
              <span className="text-brand">Aj to, s čím nesúhlasíte.</span>
            </>
          )}
        </p>
      </div>

      <Button href="#stretnutia" variant="light" className="shrink-0 self-start md:self-auto">
        {nextMeeting ? 'Pripojiť sa' : 'Prihlásiť sa na stretnutie'}
      </Button>
    </div>
  </aside>
)

export default InviteBand
