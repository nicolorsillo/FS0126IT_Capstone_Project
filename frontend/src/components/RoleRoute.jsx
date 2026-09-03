import { Link, Navigate, useLocation } from "react-router"
import { useSelector } from "react-redux"

const RoleRoute = ({ roles, children }) => {
  const { user, initializing } = useSelector((state) => state.auth)
  const location = useLocation()

  if (initializing) return null

  if (!user) {
    return <Navigate to="/accedi" replace state={{ from: location.pathname }} />
  }

  const allowed = roles.some((role) => user.roles?.includes(role))

  if (!allowed) {
    return (
      <div className="bo-denied">
        <p className="smalltitle justify-content-center">Accesso negato</p>
        <h1 className="h3 mb-2">Non hai i permessi per questa sezione.</h1>
        <p className="text-steel mb-3">
          Il tuo profilo ({user.roles?.join(", ") || "nessun ruolo"}) non è
          abilitato a questa area del backoffice.
        </p>
        <Link to="/area-riservata" className="btn btn-outline-dark">
          Torna alla tua area riservata
        </Link>
      </div>
    )
  }

  return children
}

export default RoleRoute
