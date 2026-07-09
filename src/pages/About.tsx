const About = () => (
  <div className="space-y-4">
    <h1 className="text-3xl font-bold tracking-tight">About</h1>
    <p className="text-slate-600">
      This is a content page — mostly static text. Pages like this live in{' '}
      <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">src/pages/</code> and are
      wired up as routes in{' '}
      <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">src/App.tsx</code>.
    </p>
    <p className="text-slate-600">
      Add a new page by creating a component here and registering a{' '}
      <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">&lt;Route&gt;</code> for it.
    </p>
  </div>
)

export default About
