import { Navigate } from "react-router"
import { useSelector } from "react-redux"

const BackofficeIndex = () => {
  const { user } = useSelector((state) => state.auth)
  if (user?.roles?.includes("ADMIN") || user?.roles?.includes("GEOMETRA")) {
    return <Navigate to="/backoffice/lavori" replace />
  }
  if (user?.roles?.includes("HR")) {
    return <Navigate to="/backoffice/offerte-lavoro" replace />
  }
  return <Navigate to="/area-riservata" replace />
}

export default BackofficeIndex
