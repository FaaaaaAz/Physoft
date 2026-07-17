import { Outlet } from 'react-router-dom'
// TEMPORARILY DISABLED - Authentication paused until production infrastructure is available.
// import { Navigate } from 'react-router-dom'
// import { useAuth } from '../hooks/useAuth'
// import { ROUTES } from '../constants'

/**
 * Layout route gating every authenticated page. Reactive on every
 * navigation (reads live context state, not a one-time mount check), so a
 * logout followed by the browser Back button redirects again immediately
 * instead of briefly rendering the protected page.
 *
 * TEMPORARILY DISABLED - Authentication paused until production infrastructure is available.
 * The auth check below is commented out so every route is reachable
 * without logging in. To re-enable, uncomment the imports above and the
 * block below.
 */
function ProtectedRoute() {
  // TEMPORARILY DISABLED - Authentication paused until production infrastructure is available.
  // const { isAuthenticated } = useAuth()
  //
  // if (!isAuthenticated) {
  //   return <Navigate to={ROUTES.LOGIN} replace />
  // }

  return <Outlet />
}

export default ProtectedRoute
