import { Link } from 'react-router-dom'

const Home = () => (
  <div className="space-y-6">
    <h1 className="text-4xl font-bold tracking-tight">Welcome to nslsk</h1>
    <p className="text-lg text-slate-600">
      A static site built with Vite, React, TypeScript, Tailwind CSS, and React Router. Edit files
      under <code className="rounded-sm bg-slate-200 px-1.5 py-0.5 text-sm">src/</code> and the page
      updates instantly.
    </p>
    <Link
      to="/playground"
      className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
    >
      See an interactive example →
    </Link>
  </div>
)

export default Home
