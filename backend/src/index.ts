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
import path from 'path'
import athleteRoutes from './presentation/routes/athleteRoutes'
import analysisRoutes from './presentation/routes/analysisRoutes'

// Load environment variables
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3000

// ============================================
// MIDDLEWARES
// ============================================

// HTTP headers security
app.use(helmet())

// CORS - allow requests from frontend
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
}
app.use(cors(corsOptions))

// JSON parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// HTTP request logger
app.use(morgan('dev'))

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

// ============================================
// ROUTES
// ============================================

// Test route (health check)
app.get('/api/ping', (req: Request, res: Response) => {
  res.json({
    message: 'Pong! Backend working correctly',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

// Athlete routes
app.use('/api/athletes', athleteRoutes)

// Analysis routes
app.use('/api/analyses', analysisRoutes)

// 404 route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
  })
})

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
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
