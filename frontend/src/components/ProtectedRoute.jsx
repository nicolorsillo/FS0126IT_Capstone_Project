import { Navigate, useLocation } from "react-router"
import { useSelector } from "react-redux"

const ProtectedRoute = ({ children }) => {
  const { user, initializing } = useSelector((state) => state.auth)
  const location = useLocation()

  if (initializing) return null

  if (!user) {
    return <Navigate to="/accedi" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedRoute
