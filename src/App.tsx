import { Navigate, Route, Routes } from 'react-router-dom'

import Footer from './components/Footer.tsx'
import Header from './components/Header.tsx'
import { qaPath } from './navigation.ts'
import Home from './pages/Home.tsx'
import Otazky from './pages/Otazky.tsx'

// The site is a one-pager plus one real subpage (the Q&A), so the shell is the
// same everywhere: sticky header, routed body, colophon. Section order and the
// nav live in `navigation.ts`.
const App = () => (
  <div className="min-h-screen">
    <Header />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={qaPath} element={<Otazky />} />
        {/* Anything else — an old link, a typo — lands on the one-pager. */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </main>
    <Footer />
  </div>
)

export default App
