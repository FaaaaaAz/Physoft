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

// Load environment variables
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3000

// ============================================
// MIDDLEWARES
// ============================================

// CORS - MUST be before other middleware
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
}
app.use(cors(corsOptions))

// HTTP headers security (after CORS)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// JSON parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
app.use('/api/atletas', athleteRoutes)

// Analysis routes
app.use('/api/analisis', analysisRoutes)

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

app.listen(PORT, () => {
  console.log('========================================')
  console.log('   🚀 Physoft Backend API')
  console.log('========================================')
  console.log(`✓ Servidor corriendo en http://localhost:${PORT}`)
  console.log(`✓ Entorno: ${process.env.NODE_ENV || 'development'}`)
  console.log(`✓ Base de datos: ${process.env.DATABASE_URL}`)
  console.log('========================================')
})

export default app
