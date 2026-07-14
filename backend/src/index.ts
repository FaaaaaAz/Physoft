// ============================================
// SERVIDOR PRINCIPAL - Physoft Backend
// ============================================
// Express + TypeScript + Prisma
// Servidor API REST para análisis deportivo
// ============================================

import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import athleteRoutes from './presentation/routes/athleteRoutes'
import analysisRoutes from './presentation/routes/analysisRoutes'
import claudeRoutes from './presentation/routes/claudeRoutes'

// Load environment variables
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3000

// ============================================
// MIDDLEWARES
// ============================================

// CORS - MUST be before other middleware
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:4173', 'file://'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
}
app.use(cors(corsOptions))

// Health check endpoint (for Electron)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is running' })
})

// HTTP headers security (after CORS)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// JSON parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

// HTTP request logger
app.use(morgan('dev'))

// Serve static files (for uploaded images) - AFTER CORS
app.use('/uploads', express.static('public/uploads'))

// ============================================
// ROUTES
// ============================================

// Health check endpoint
app.get('/api/ping', (_req: Request, res: Response) => {
  res.json({ message: 'pong', timestamp: new Date().toISOString() })
})

// Athlete routes
app.use('/api/athletes', athleteRoutes)

// Analysis routes
app.use('/api/analyses', analysisRoutes)

// Claude (AI Textual Analysis) routes
app.use('/api/claude', claudeRoutes)

// 404 route
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: _req.path,
  })
})

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// ============================================
// INICIAR SERVIDOR
// ============================================

// Solo iniciar el servidor si no está en modo serverless (Vercel)
if (process.env.VERCEL !== '1') {
  const databaseUrl = process.env.DATABASE_URL
  const safeDatabaseUrl = databaseUrl
    ? databaseUrl.replace(/(postgresql:\/\/[^:]+:)[^@]+@/, '$1****@')
    : 'not configured'

  app.listen(PORT, () => {
    console.log('========================================')
    console.log('   🚀 Physoft Backend API')
    console.log('========================================')
    console.log(`✓ Servidor corriendo en http://localhost:${PORT}`)
    console.log(`✓ Entorno: ${process.env.NODE_ENV || 'development'}`)
    console.log(`✓ Base de datos: ${safeDatabaseUrl}`)
    console.log('========================================')
  })
}

// Export para Vercel Serverless
export default app
