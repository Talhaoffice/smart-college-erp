import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { roleHomePath } from '../../lib/utils.js'
import LoadingScreen from '../ui/LoadingScreen.jsx'

function ProtectedRoute({ role }) {
  const { ready, user } = useAuth()

  if (!ready) {
    return <LoadingScreen label="Loading your dashboard" />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={roleHomePath(user.role)} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
