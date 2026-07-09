const About = () => (
  <div className="space-y-4">
    <h1 className="text-3xl font-bold tracking-tight">About</h1>
    <p className="text-slate-600">
      This is a content section — mostly static text. Each section is a plain component in{' '}
      <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">src/sections/</code>, rendered
      inside a standard shell.
    </p>
    <p className="text-slate-600">
      All navigation lives in one place:{' '}
      <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">src/navigation.ts</code>. To
      add a section, write its component and add a single{' '}
      <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">
        {'{ id, label, Component }'}
      </code>{' '}
      entry there — the menu, the section shell, and the scroll-spy all update automatically.
    </p>
  </div>
)

export default About
