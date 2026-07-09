import { Route, Routes } from 'react-router-dom'

import Layout from './components/Layout.tsx'
import About from './pages/About.tsx'
import Home from './pages/Home.tsx'
import Playground from './pages/Playground.tsx'

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      <Route path="playground" element={<Playground />} />
    </Route>
  </Routes>
)

export default App
