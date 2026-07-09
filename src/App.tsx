import Header from './components/Header.tsx'
import About from './sections/About.tsx'
import Hero from './sections/Hero.tsx'
import Playground from './sections/Playground.tsx'

const App = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <Header />
    <main>
      <Hero />
      <About />
      <Playground />
    </main>
  </div>
)

export default App
