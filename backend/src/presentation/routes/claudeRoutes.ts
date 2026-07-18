// ============================================
// ROUTES: Claude
// ============================================
// HTTP routes for AI-assisted Textual Analysis (Anthropic Claude)
// ============================================

import { Router } from 'express'
import { ClaudeController } from '../controllers/claudeController'
import { uploadClaudeFiles } from '../../middleware/claudeUpload'
import { claudeRateLimiter } from '../../middleware/claudeRateLimiter'

const router = Router()

/**
 * POST /api/claude/analyze-assessment
 * Generate an AI analysis for one Textual Analysis checkbox type.
 * multipart/form-data: checkboxType, userPrompt?, patientContext?, assessmentId?, patientId, files[]
 */
router.post('/analyze-assessment', claudeRateLimiter, uploadClaudeFiles.array('files', 5), ClaudeController.analyzeAssessment)

export default router
