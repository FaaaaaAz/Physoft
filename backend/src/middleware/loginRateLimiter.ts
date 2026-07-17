// ============================================
// MIDDLEWARE: Login Rate Limiter
// ============================================
// Blunts brute-force attempts against POST /api/auth/login.
// ============================================

import rateLimit from 'express-rate-limit'

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many login attempts. Please try again later.' }
})
