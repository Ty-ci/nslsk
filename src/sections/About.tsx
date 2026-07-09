const About = () => (
  <section
    id="about"
    className="mx-auto max-w-3xl scroll-mt-20 border-t border-slate-200 px-6 py-24"
  >
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">About</h1>
      <p className="text-slate-600">
        This is a content section — mostly static text. Each section lives in{' '}
        <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">src/sections/</code> and is
        placed on the page in{' '}
        <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">src/App.tsx</code>.
      </p>
      <p className="text-slate-600">
        Add a section by creating a component with a unique{' '}
        <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">id</code>, rendering it in{' '}
        <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">App.tsx</code>, and adding a
        matching entry to the nav in{' '}
        <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">Header.tsx</code>.
      </p>
    </div>
  </section>
)

export default About
