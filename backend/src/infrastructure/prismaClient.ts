// ============================================
// PRISMA CLIENT - Infraestructura
// ============================================
// Cliente único de Prisma para toda la aplicación
// Evita múltiples instancias en desarrollo (hot-reload)
// ============================================

import { PrismaClient } from '@prisma/client'

// Prevenir múltiples instancias en desarrollo
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
