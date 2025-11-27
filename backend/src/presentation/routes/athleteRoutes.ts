// ============================================
// ROUTES: Athlete - Presentation Layer
// ============================================
// Define HTTP routes for athlete operations
// ============================================

import { Router } from 'express'
import { AthleteController } from '../controllers/athleteController'
import { upload } from '../../middleware/upload'

const router = Router()

// Special routes (must come BEFORE routes with :id)
router.get('/statistics/summary', AthleteController.estadisticas) // GET /api/athletes/statistics/summary

// Athlete CRUD routes
router.get('/', AthleteController.getAll)           // GET /api/athletes (with optional filters)
router.get('/:id', AthleteController.getById)       // GET /api/athletes/:id
router.post('/', AthleteController.create)          // POST /api/athletes
router.put('/:id', AthleteController.update)        // PUT /api/athletes/:id
router.delete('/:id', AthleteController.delete)     // DELETE /api/athletes/:id

// Photo upload route
router.post('/:id/photo', upload.single('photo'), AthleteController.uploadPhoto)  // POST /api/athletes/:id/photo

// Comparison route
router.get('/:id/compare', AthleteController.comparar)  // GET /api/athletes/:id/compare

export default router
