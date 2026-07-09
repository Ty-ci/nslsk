import { sections } from '../App.tsx'
import { useActiveSection } from '../hooks/useActiveSection.ts'

const Header = () => {
  const sectionIds = sections.map((section) => section.id)
  const activeId = useActiveSection(sectionIds)

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <a href={`#${sectionIds[0]}`} className="text-lg font-semibold tracking-tight">
          nslsk
        </a>
        <ul className="flex gap-1">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeId === section.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
