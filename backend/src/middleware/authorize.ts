// ============================================
// MIDDLEWARE: Authorize
// ============================================
// Role-based access gate, layered on top of authenticate(). Only ADMIN
// exists today, so no route wires this in yet — kept ready for when a
// second role is introduced.
// ============================================

import { Request, Response, NextFunction } from 'express'
import { UserRole } from '@prisma/client'

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Forbidden' })
    }

    return next()
  }
}
