import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router"
import { Provider, useDispatch } from "react-redux"
import store from "./redux/store"
import { bootstrapAuthAction } from "./redux/actions/auth"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicLayout from "./components/PublicLayout"

import Home from "./pages/Home"
import ChiSiamo from "./pages/ChiSiamo"
import Servizi from "./pages/Servizi"
import Contatti from "./pages/Contatti"
import JobOffers from "./pages/lavora/JobOffers"
import JobOfferDetail from "./pages/lavora/JobOfferDetail"
import Login from "./pages/auth/Login"
import Registrati from "./pages/auth/Registrati"
import Dashboard from "./pages/area-riservata/Dashboard"
import DashboardIndex from "./pages/area-riservata/DashboardIndex"
import LeMieOpere from "./pages/area-riservata/cliente/LeMieOpere"
import OperaDettaglio from "./pages/area-riservata/cliente/OperaDettaglio"
import LeMieCandidature from "./pages/area-riservata/candidato/LeMieCandidature"
import ColloquiDisponibili from "./pages/area-riservata/candidato/ColloquiDisponibili"
import Profilo from "./pages/area-riservata/Profilo"
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
          <Route path="/lavora-con-noi" element={<JobOffers />} />
          <Route
            path="/lavora-con-noi/:jobOfferId"
            element={<JobOfferDetail />}
          />
          <Route path="/accedi" element={<Login />} />
          <Route path="/registrati" element={<Registrati />} />

          <Route
            path="/area-riservata"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardIndex />} />
            <Route path="opere" element={<LeMieOpere />} />
            <Route path="opere/:workId" element={<OperaDettaglio />} />
            <Route path="candidature" element={<LeMieCandidature />} />
            <Route path="colloqui" element={<ColloquiDisponibili />} />
            <Route path="profilo" element={<Profilo />} />
          </Route>

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
