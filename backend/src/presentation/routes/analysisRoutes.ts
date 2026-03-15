// ============================================
// ROUTES: Analysis
// ============================================
// HTTP routes for analysis operations
// ============================================

import { Router } from 'express'
import { AnalysisController } from '../controllers/analysisController'
import { upload, uploadMemory } from '../../middleware/upload'

const router = Router()

// ============================================
// ANALYSIS ROUTES
// ============================================

/**
 * GET /api/analyses
 * Get all analyses with optional filters
 * Query params: athleteId, globalClassification, startDate, endDate
 */
router.get('/', AnalysisController.getAll)

/**
 * GET /api/analyses/statistics/summary
 * Get general statistics (must be before /:id route)
 */
router.get('/statistics/summary', AnalysisController.getStatistics)

/**
 * GET /api/analyses/:id
 * Get a specific analysis by ID
 */
router.get('/:id', AnalysisController.getById)

/**
 * POST /api/analyses
 * Create a new analysis with optional graph images
 * Supports multipart/form-data with 'graphs' field for multiple images
 */
router.post('/', upload.array('graphs', 10), AnalysisController.create)

/**
 * PUT /api/analyses/:id
 * Update an analysis
 */
router.put('/:id', AnalysisController.update)

/**
 * POST /api/analyses/:id/graphs
 * Upload additional graph images to an existing analysis
 */
router.post('/:id/graphs', upload.array('graphs', 10), AnalysisController.uploadGraphs)

/**
 * POST /api/analyses/ai-analyze
 * Analyze images using configured AI provider
 * Expects: images (multipart), analysisTypes (JSON string)
 */
router.post('/ai-analyze', uploadMemory.array('images', 10), AnalysisController.aiAnalyze)

/**
 * DELETE /api/analyses/:id
 * Delete an analysis and its associated images
 */
router.delete('/:id', AnalysisController.delete)

export default router
