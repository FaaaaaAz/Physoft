// ============================================
// ROUTES: Athlete - Presentation Layer
// ============================================
// Define HTTP routes for athlete operations
// ============================================

import { Router } from 'express'
import { AthleteController } from '../controllers/athleteController'
import { upload } from '../../infrastructure/uploadMiddleware'

const router = Router()

// Special routes (must come BEFORE routes with :id)
router.get('/statistics/summary', AthleteController.estadisticas) // GET /api/athletes/statistics/summary

// Athlete CRUD routes
router.get('/', AthleteController.getAll)           // GET /api/atletas (with optional filters)
router.get('/:id', AthleteController.getById)       // GET /api/atletas/:id
router.post('/', upload.single('photo'), AthleteController.create)  // POST /api/atletas (with optional photo)
router.put('/:id', AthleteController.update)        // PUT /api/atletas/:id
router.delete('/:id', AthleteController.delete)     // DELETE /api/atletas/:id

// Photo upload route
router.post('/:id/photo', upload.single('photo'), AthleteController.uploadPhoto)  // POST /api/atletas/:id/photo

// Comparison route
router.get('/:id/compare', AthleteController.comparar)  // GET /api/athletes/:id/compare

export default router
