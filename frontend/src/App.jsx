import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router"
import { Provider, useDispatch } from "react-redux"
import store from "./redux/store"
import { bootstrapAuthAction } from "./redux/actions/auth"
import PublicLayout from "./components/PublicLayout"
import Home from "./pages/Home"
import ChiSiamo from "./pages/ChiSiamo"
import Servizi from "./pages/Servizi"
import Contatti from "./pages/Contatti"
import Login from "./pages/auth/Login"
import Registrati from "./pages/auth/Registrati"
import NotFound from "./pages/NotFound"

const AppRoutes = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(bootstrapAuthAction())
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/servizi" element={<Servizi />} />
          <Route path="/contatti" element={<Contatti />} />
          <Route path="/accedi" element={<Login />} />
          <Route path="/registrati" element={<Registrati />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  )
}

export default App
