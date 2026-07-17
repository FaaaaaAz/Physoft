// ============================================
// MIDDLEWARE: Authenticate
// ============================================
// Verifies the Bearer JWT on protected routes and attaches req.user.
// Stateless — validates the token's signature and expiration only,
// no database lookup per request.
// ============================================

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayload } from '../application/services/authService'

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }

  const token = authHeader.slice('Bearer '.length)

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET is not configured')
    }

    const payload = jwt.verify(token, secret) as JwtPayload
    req.user = { id: payload.id, email: payload.email, role: payload.role }
    return next()
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Unauthorized' })
  }
}
