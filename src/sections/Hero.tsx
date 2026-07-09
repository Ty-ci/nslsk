const Hero = () => (
  <section id="home" className="mx-auto max-w-3xl scroll-mt-20 px-6 py-24">
    <div className="space-y-6">
      <h1 className="text-4xl font-bold tracking-tight">Welcome to nslsk</h1>
      <p className="text-lg text-slate-600">
        A static single-page site built with Vite, React, TypeScript, and Tailwind CSS. The menu
        links jump to sections of this page. Edit files under{' '}
        <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">src/</code> and the page
        updates instantly.
      </p>
      <a
        href="#playground"
        className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
      >
        See an interactive example →
      </a>
    </div>
  </section>
)

export default Hero
