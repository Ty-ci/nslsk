import Avatar from '@/app/(web)/_components/Avatar'
import Button from '@/app/(web)/_components/Button'
import Eyebrow from '@/app/(web)/_components/Eyebrow'
import Lily from '@/app/(web)/_components/Lily'
import LinkCard from '@/app/(web)/_components/LinkCard'
import Section from '@/app/(web)/_components/Section'
import Tag from '@/app/(web)/_components/Tag'
import { people } from '@/app/(web)/_data/people'

const destinations = [
  {
    href: '/onboarding',
    title: 'Onboarding',
    text: 'Checklist pre nové Náčelníctvo.',
  },
  // {
  //   href: '/archiv/kandidatka2026',
  //   title: 'Archív: Kandidatúra 2026',
  //   text: 'Pôvodný web kandidatúry „Spolu do toho!“ — program, témy a otázky zo snemu 2026.',
  // },
] as const

const upcoming = [
  // { title: 'Harmonogram', text: 'Ročný cyklus zasadnutí N-SLSK, Malý snem, rozpočet.' },
  // {
  //   title: 'Dokumenty',
  //   text: 'Stanovy, Organizačný poriadok, smernice a šablóny na jednom mieste.',
  // },
  // { title: 'Kontakty', text: 'Kto je kto v Náčelníctve, na Ústredí a v radách.' },
] as const

const Home = () => (
  <>
    <Section py="py-16 md:py-24 lg:py-32" labelledBy="hero-title">
      <div className="grid items-center gap-12 md:grid-cols-[1fr_auto]">
        <div className="max-w-2xl">
          <Eyebrow>Interný infoweb</Eyebrow>
          <h1
            id="hero-title"
            className="mt-5 text-display font-extrabold max-md:text-[2.5rem]/[1.1]"
          >
            Náčelníctvo Slovenského skautingu 2026–2029
          </h1>
          <p className="mt-6 max-w-[65ch] text-lead text-pretty">
            Webová stránka pre Náčelníctvo a podporné tímy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/onboarding" variant="accent" arrow>
              Začať onboarding
            </Button>
          </div>
        </div>

        {/* The lily on a yellow disc, turning slowly — the one place on the site
            that moves on its own (DESIGN_SPECS.md §7). */}
        <div className="mx-auto flex size-56 items-center justify-center rounded-full bg-yellow perspective-midrange sm:size-72 lg:size-80">
          <Lily title="Skautská ľalia" className="w-1/2 text-navy" />
        </div>
      </div>
    </Section>

    <Section tone="surface" labelledBy="destinations-title">
      <h2 id="destinations-title" className="text-h2 font-bold max-md:text-[1.75rem]">
        Kam ďalej
      </h2>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map(({ href, title, text }) => (
          <li key={href} className="flex">
            <LinkCard href={href} title={title}>
              {text}
            </LinkCard>
          </li>
        ))}

        {upcoming.map(({ title, text }) => (
          <li key={title} className="flex flex-col rounded-card bg-white/60 p-6 text-muted md:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-h4 font-semibold text-muted">{title}</h3>
              <Tag tone="warn">Pripravujeme</Tag>
            </div>
            <p className="mt-2 text-sm/6">{text}</p>
          </li>
        ))}
      </ul>
    </Section>

    <Section labelledBy="people-title">
      <Eyebrow variant="quiet">2026–2029</Eyebrow>
      <h2 id="people-title" className="mt-4 text-h2 font-bold max-md:text-[1.75rem]">
        Kto je v Náčelníctve
      </h2>

      <ul className="mt-8 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {people.map(({ key, nickname, area }) => (
          <li key={key} className="flex items-center gap-3 border-b border-line py-3">
            <Avatar name={nickname} />
            <div>
              <p className="font-semibold text-navy">{nickname}</p>
              <p className="text-sm text-muted">{area}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  </>
)

export default Home
