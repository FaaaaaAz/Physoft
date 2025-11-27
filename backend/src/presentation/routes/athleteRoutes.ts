// ============================================
// ROUTES: Athlete - Presentation Layer
// ============================================
// Define HTTP routes for athlete operations
// ============================================

import { Router } from 'express'
import { AthleteController } from '../controllers/athleteController'

const router = Router()

// Special routes (must come BEFORE routes with :id)
router.get('/estadisticas/resumen', AthleteController.estadisticas) // GET /api/atletas/estadisticas/resumen

// Athlete CRUD routes
router.get('/', AthleteController.getAll)           // GET /api/atletas (with optional filters)
router.get('/:id', AthleteController.getById)       // GET /api/atletas/:id
router.post('/', AthleteController.create)          // POST /api/atletas
router.put('/:id', AthleteController.update)        // PUT /api/atletas/:id
router.delete('/:id', AthleteController.delete)     // DELETE /api/atletas/:id

// Comparison route
router.get('/:id/comparar', AthleteController.comparar)  // GET /api/atletas/:id/comparar

export default router
