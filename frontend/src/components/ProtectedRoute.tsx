import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants'

/**
 * Layout route gating every authenticated page. Reactive on every
 * navigation (reads live context state, not a one-time mount check), so a
 * logout followed by the browser Back button redirects again immediately
 * instead of briefly rendering the protected page.
 */
function ProtectedRoute() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
