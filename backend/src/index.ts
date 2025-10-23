// ============================================
// SERVIDOR PRINCIPAL - Physoft Backend
// ============================================
// Express + TypeScript + Prisma
// Servidor API REST para análisis deportivo
// ============================================

import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import atletaRoutes from './presentation/routes/atletaRoutes'

// Cargar variables de entorno
dotenv.config()

const app: Application = express()
const PORT = process.env.PORT || 3000

// ============================================
// MIDDLEWARES
// ============================================

// Seguridad HTTP headers
app.use(helmet())

// CORS - permitir peticiones desde el frontend
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
}
app.use(cors(corsOptions))

// Parser de JSON
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logger de peticiones HTTP
app.use(morgan('dev'))

// ============================================
// RUTAS
// ============================================

// Ruta de prueba (health check)
app.get('/api/ping', (req: Request, res: Response) => {
  res.json({
    message: 'Pong! Backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
})

// Rutas de atletas
app.use('/api/atletas', atletaRoutes)

// Ruta 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.path,
  })
})

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

app.use((err: Error, req: Request, res: Response, next: any) => {
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
