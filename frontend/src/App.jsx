import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { Provider, useDispatch } from "react-redux"
import store from "./redux/store"
import { bootstrapAuthAction } from "./redux/actions/auth"
import ProtectedRoute from "./components/ProtectedRoute"
import RoleRoute from "./components/RoleRoute"
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

import BackofficeLayout from "./pages/backoffice/BackofficeLayout"
import BackofficeIndex from "./pages/backoffice/BackofficeIndex"
import Lavori from "./pages/backoffice/Lavori"
import LavoroDettaglio from "./pages/backoffice/LavoroDettaglio"
import Preventivi from "./pages/backoffice/Preventivi"
import Fatture from "./pages/backoffice/Fatture"
import Elaborati from "./pages/backoffice/Elaborati"
import OfferteLavoro from "./pages/backoffice/OfferteLavoro"
import OffertaCandidature from "./pages/backoffice/OffertaCandidature"
import OffertaForm from "./pages/backoffice/OffertaForm"
import Candidature from "./pages/backoffice/Candidature"
import SlotColloqui from "./pages/backoffice/SlotColloqui"
import Utenti from "./pages/backoffice/Utenti"
import Ruoli from "./pages/backoffice/Ruoli"

const STAFF_ROLES = ["ADMIN", "GEOMETRA", "HR"]

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

        <Route
          path="/backoffice"
          element={
            <RoleRoute roles={STAFF_ROLES}>
              <BackofficeLayout />
            </RoleRoute>
          }
        >
          <Route index element={<BackofficeIndex />} />
          <Route
            path="lavori"
            element={
              <RoleRoute roles={["ADMIN", "GEOMETRA"]}>
                <Lavori />
              </RoleRoute>
            }
          />
          <Route
            path="lavori/:workId"
            element={
              <RoleRoute roles={["ADMIN", "GEOMETRA"]}>
                <LavoroDettaglio />
              </RoleRoute>
            }
          />
          <Route
            path="preventivi"
            element={
              <RoleRoute roles={["ADMIN", "GEOMETRA"]}>
                <Preventivi />
              </RoleRoute>
            }
          />
          <Route
            path="fatture"
            element={
              <RoleRoute roles={["ADMIN", "GEOMETRA"]}>
                <Fatture />
              </RoleRoute>
            }
          />
          <Route
            path="elaborati"
            element={
              <RoleRoute roles={["ADMIN", "GEOMETRA"]}>
                <Elaborati />
              </RoleRoute>
            }
          />
          <Route
            path="offerte-lavoro"
            element={
              <RoleRoute roles={["HR", "ADMIN"]}>
                <OfferteLavoro />
              </RoleRoute>
            }
          />
          <Route
            path="offerte-lavoro/nuova"
            element={
              <RoleRoute roles={["HR", "ADMIN"]}>
                <OffertaForm />
              </RoleRoute>
            }
          />
          <Route
            path="offerte-lavoro/:jobOfferId"
            element={
              <RoleRoute roles={["HR", "ADMIN"]}>
                <OffertaForm />
              </RoleRoute>
            }
          />
          <Route
            path="offerte-lavoro/:jobOfferId/candidature"
            element={
              <RoleRoute roles={["HR", "ADMIN"]}>
                <OffertaCandidature />
              </RoleRoute>
            }
          />
          <Route
            path="candidature"
            element={
              <RoleRoute roles={["HR", "ADMIN"]}>
                <Candidature />
              </RoleRoute>
            }
          />
          <Route
            path="slot-colloqui"
            element={
              <RoleRoute roles={["HR", "ADMIN"]}>
                <SlotColloqui />
              </RoleRoute>
            }
          />
          <Route
            path="utenti"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <Utenti />
              </RoleRoute>
            }
          />
          <Route
            path="ruoli"
            element={
              <RoleRoute roles={["ADMIN"]}>
                <Ruoli />
              </RoleRoute>
            }
          />
          <Route path="*" element={<Navigate to="/backoffice" replace />} />
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
