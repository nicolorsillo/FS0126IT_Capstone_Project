import { BrowserRouter, Routes, Route } from "react-router"
import PublicLayout from "./components/PublicLayout"
import Home from "./pages/Home"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
