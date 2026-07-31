import { BrowserRouter, Routes, Route } from "react-router"
import PublicLayout from "./components/PublicLayout"
import Home from "./pages/Home"
import ChiSiamo from "./pages/ChiSiamo"
import Servizi from "./pages/Servizi"
import Contatti from "./pages/Contatti"
import NotFound from "./pages/NotFound"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/servizi" element={<Servizi />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
