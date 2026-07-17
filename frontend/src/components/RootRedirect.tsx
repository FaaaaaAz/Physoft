import { Navigate } from 'react-router-dom'
// TEMPORARILY DISABLED - Authentication paused until production infrastructure is available.
// import { useAuth } from '../hooks/useAuth'
import { ROUTES } from '../constants'

/**
 * Resolves `/` to the right place based on auth state, synchronously.
 *
 * TEMPORARILY DISABLED - Authentication paused until production infrastructure is available.
 * Always redirects straight to Dashboard for now. To re-enable, uncomment
 * the useAuth import and restore the isAuthenticated-based branch below.
 */
function RootRedirect() {
  // TEMPORARILY DISABLED - Authentication paused until production infrastructure is available.
  // const { isAuthenticated } = useAuth()
  // return <Navigate to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN} replace />

  return <Navigate to={ROUTES.DASHBOARD} replace />
}

export default RootRedirect
