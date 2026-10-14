import Button from '@/app/(web)/_components/Button'
import Lily from '@/app/(web)/_components/Lily'
import Section from '@/app/(web)/_components/Section'

const NotFound = () => (
  <Section py="py-24 md:py-32">
    <div className="flex flex-col items-center text-center">
      <Lily className="size-16 text-navy" />
      <p className="mt-6 eyebrow text-muted">Chyba 404</p>
      <h1 className="mt-2 text-h1 font-bold max-md:text-[2.125rem]">Táto stránka tu nie je</h1>
      <p className="mt-4 max-w-[50ch] text-lead">
        Možno sa presunula — pôvodný web kandidatúry nájdeš v archíve.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">Na úvod</Button>
        <Button href="/archiv/kandidatka2026" variant="outline">
          Archív kandidatúry
        </Button>
      </div>
    </div>
  </Section>
)

export default NotFound
