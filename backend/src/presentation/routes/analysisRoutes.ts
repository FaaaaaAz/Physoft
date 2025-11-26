// ============================================
// ROUTES: Analyses
// ============================================
// REST endpoints for CRUD operations on musculoskeletal analyses
// ============================================

import { Router } from 'express'
import * as analysisController from '../controllers/analysisController'

const router = Router()

// ============================================
// SPECIAL ROUTES (must come BEFORE :id)
// ============================================

/**
 * GET /api/analisis/estadisticas/resumen
 * Get general statistics about analyses
 */
router.get('/estadisticas/resumen', analysisController.getStatistics)

/**
 * GET /api/analisis/atleta/:athleteId
 * Get all analyses for a specific athlete
 */
router.get('/atleta/:athleteId', analysisController.getByAthleteId)

// ============================================
// CRUD ROUTES - Analyses
// ============================================

/**
 * GET /api/analisis
 * Get all analyses with optional filters
 * Query params: athleteId, analysisType, dateFrom, dateTo
 */
router.get('/', analysisController.getAll)

/**
 * GET /api/analisis/:id
 * Get a specific analysis by ID
 */
router.get('/:id', analysisController.getById)

/**
 * POST /api/analisis
 * Create a new analysis
 * Body: { athleteId, analysisType, dataJson, overallStatus?, weakPoint1?, weakPoint2?, weakPoint3?, improvementMargin? }
 */
router.post('/', analysisController.create)

/**
 * PUT /api/analisis/:id
 * Update an existing analysis
 * Body: fields to update (partial)
 */
router.put('/:id', analysisController.update)

/**
 * DELETE /api/analisis/:id
 * Delete an analysis
 */
router.delete('/:id', analysisController.remove)

export default router
