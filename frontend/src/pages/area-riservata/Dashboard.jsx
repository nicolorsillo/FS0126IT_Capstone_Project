import { NavLink, Outlet } from "react-router"
import { Container } from "react-bootstrap"
import { useSelector } from "react-redux"

const ROLE_LABEL = {
  CLIENTE: "Cliente",
  CANDIDATO: "Candidato",
  USER: "Utente",
  HR: "Risorse umane",
  ADMIN: "Amministratore",
  GEOMETRA: "Geometra",
}

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth)
  const isCliente = user?.roles?.includes("CLIENTE")
  const isCandidato = user?.roles?.includes("CANDIDATO")

  return (
    <>
      <div className="dash-header">
        <Container className="oc-container">
          <p className="dash-header__role">
            {user?.roles?.map((r) => ROLE_LABEL[r] ?? r).join(" · ")}
          </p>
          <h1 className="h2 mb-0">
            Ciao, {user?.name} {user?.surname}
          </h1>
        </Container>
      </div>
      <Container className="oc-container section section--tight">
        <nav className="dash-tabs">
          {isCliente && (
            <NavLink to="/area-riservata/opere">Le mie opere</NavLink>
          )}
          {isCandidato && (
            <NavLink to="/area-riservata/candidature">Candidature</NavLink>
          )}
          {isCandidato && (
            <NavLink to="/area-riservata/colloqui">Colloqui</NavLink>
          )}
          <NavLink to="/area-riservata/profilo">Profilo</NavLink>
        </nav>
        <Outlet />
      </Container>
    </>
  )
}

export default Dashboard
