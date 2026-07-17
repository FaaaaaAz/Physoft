// ============================================
// UTILS: Token Storage
// ============================================
// Persists the JWT in localStorage (survives full browser close/reopen)
// and provides a client-side expiry check so route guards can decide
// synchronously, with no network round-trip, whether a token is usable.
// ============================================

const TOKEN_KEY = 'physoft_auth_token'

export interface DecodedToken {
  id: string
  email: string
  role: string
  iat: number
  exp: number
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

// JWTs use base64url (`-`/`_`, no padding), which the native atob() doesn't
// accept directly — convert to standard base64 first.
function base64UrlDecode(value: string): string {
  let base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) base64 += '='
  return atob(base64)
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const payloadSegment = token.split('.')[1]
    if (!payloadSegment) return null
    return JSON.parse(base64UrlDecode(payloadSegment))
  } catch {
    return null
  }
}

/**
 * Fails closed: any decode error or missing `exp` is treated as expired,
 * never as valid.
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || typeof decoded.exp !== 'number') return true
  return Date.now() >= decoded.exp * 1000
}
