import { useActiveSection } from '../hooks/useActiveSection.ts'

const links = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'playground', label: 'Playground' },
]

const sectionIds = links.map((link) => link.id)

const Header = () => {
  const activeId = useActiveSection(sectionIds)

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <a href="#home" className="text-lg font-semibold tracking-tight">
          nslsk
        </a>
        <ul className="flex gap-1">
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeId === link.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
