import { Navigate } from "react-router"
import { useSelector } from "react-redux"

const DashboardIndex = () => {
  const { user } = useSelector((state) => state.auth)
  if (user?.roles?.includes("CLIENTE"))
    return <Navigate to="/area-riservata/opere" replace />
  if (user?.roles?.includes("CANDIDATO"))
    return <Navigate to="/area-riservata/candidature" replace />
  if (user?.roles?.some((role) => ["ADMIN", "GEOMETRA", "HR"].includes(role))) {
    return <Navigate to="/backoffice" replace />
  }
  return <Navigate to="/area-riservata/profilo" replace />
}

export default DashboardIndex
