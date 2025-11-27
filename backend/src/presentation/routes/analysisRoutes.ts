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
 * GET /api/analyses/statistics/summary
 * Get general statistics about analyses
 */
router.get('/statistics/summary', analysisController.getStatistics)

/**
 * GET /api/analyses/athlete/:athleteId
 * Get all analyses for a specific athlete
 */
router.get('/athlete/:athleteId', analysisController.getByAthleteId)

// ============================================
// CRUD ROUTES - Analyses
// ============================================

/**
 * GET /api/analyses
 * Get all analyses with optional filters
 * Query params: athleteId, analysisType, dateFrom, dateTo
 */
router.get('/', analysisController.getAll)

/**
 * GET /api/analyses/:id
 * Get a specific analysis by ID
 */
router.get('/:id', analysisController.getById)

/**
 * POST /api/analyses
 * Create a new analysis
 * Body: { athleteId, analysisType, dataJson, overallStatus?, weakPoint1?, weakPoint2?, weakPoint3?, improvementMargin? }
 */
router.post('/', analysisController.create)

/**
 * PUT /api/analyses/:id
 * Update an existing analysis
 * Body: fields to update (partial)
 */
router.put('/:id', analysisController.update)

/**
 * DELETE /api/analyses/:id
 * Delete an analysis
 */
router.delete('/:id', analysisController.remove)

export default router
