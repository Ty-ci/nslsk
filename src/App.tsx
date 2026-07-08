import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import About from "./pages/About.tsx";
import Playground from "./pages/Playground.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="playground" element={<Playground />} />
      </Route>
    </Routes>
  );
}
