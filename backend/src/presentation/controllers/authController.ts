// ============================================
// CONTROLLER: Auth - Presentation Layer
// ============================================
// Handles HTTP requests related to authentication
// ============================================

import { Request, Response } from 'express'
import { AuthService } from '../../application/services/authService'

export class AuthController {
  /**
   * POST /api/auth/login
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ success: false, error: 'Invalid email or password' })
      }

      const result = await AuthService.login(email, password)

      if (!result) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' })
      }

      return res.json({ success: true, data: result })
    } catch (error) {
      console.error('Error during login:', error)
      return res.status(500).json({ success: false, error: 'Error signing in' })
    }
  }

  /**
   * POST /api/auth/change-password
   * Protected — requires a valid JWT (req.user set by authenticate middleware)
   */
  static async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body

      if (!currentPassword || !newPassword || typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
        return res.status(400).json({ success: false, error: 'Current and new password are required' })
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ success: false, error: 'New password must be at least 8 characters' })
      }

      const result = await AuthService.changePassword(req.user!.id, currentPassword, newPassword)

      if (!result.success) {
        return res.status(400).json({ success: false, error: result.error })
      }

      return res.json({ success: true, message: 'Password updated successfully' })
    } catch (error) {
      console.error('Error changing password:', error)
      return res.status(500).json({ success: false, error: 'Error updating password' })
    }
  }
}
