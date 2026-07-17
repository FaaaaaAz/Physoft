// ============================================
// ROUTES: Auth - Presentation Layer
// ============================================
// Define HTTP routes for authentication
// ============================================

import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import { authenticate } from '../../middleware/authenticate'
import { loginRateLimiter } from '../../middleware/loginRateLimiter'

const router = Router()

router.post('/login', loginRateLimiter, AuthController.login)               // POST /api/auth/login
router.post('/change-password', authenticate, AuthController.changePassword) // POST /api/auth/change-password

export default router
