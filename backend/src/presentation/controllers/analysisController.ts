// ============================================
// CONTROLLER: Analysis - Presentation Layer
// ============================================
// Handles HTTP requests related to analyses
// ============================================

import { Request, Response } from 'express'
import { prisma } from '../../infrastructure/prismaClient'
import { UploadService } from '../../application/services/uploadService'
import { ComparisonService } from '../../application/services/ComparisonService'

export class AnalysisController {
  /**
   * GET /api/analyses
   * Get all analyses with optional filters
   */
  static async getAll(req: Request, res: Response) {
    try {
      const { athleteId, globalClassification, startDate, endDate } = req.query

      // Build dynamic filters
      const where: any = {}

      if (athleteId) {
        where.athleteId = athleteId as string
      }

      if (globalClassification) {
        where.globalClassification = globalClassification as string
      }

      if (startDate || endDate) {
        where.evaluationDate = {}
        if (startDate) {
          where.evaluationDate.gte = new Date(startDate as string)
        }
        if (endDate) {
          where.evaluationDate.lte = new Date(endDate as string)
        }
      }

      const analyses = await prisma.analysis.findMany({
        where,
        include: {
          athlete: {
            select: {
              id: true,
              accessCode: true,
              name: true,
              sport: true,
              photo: true
            }
          }
        },
        orderBy: {
          evaluationDate: 'desc',
        },
      })

      res.json({
        success: true,
        data: analyses,
        total: analyses.length,
      })
    } catch (error) {
      console.error('Error fetching analyses:', error)
      res.status(500).json({
        success: false,
        error: 'Error fetching analyses',
      })
    }
  }

  /**
   * GET /api/analyses/:id
   * Get an analysis by ID
   */
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const analysis = await prisma.analysis.findUnique({
        where: { id: parseInt(id) },
        include: {
          athlete: true,
        },
      })

      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: 'Analysis not found',
        })
      }

      res.json({
        success: true,
        data: analysis,
      })
    } catch (error) {
      console.error('Error fetching analysis:', error)
      res.status(500).json({
        success: false,
        error: 'Error fetching analysis',
      })
    }
  }

  /**
   * GET /api/athletes/:athleteId/analyses
   * Get all analyses for a specific athlete
   */
  static async getByAthlete(req: Request, res: Response) {
    try {
      const { athleteId } = req.params

      // Verify athlete exists
      const athlete = await prisma.athlete.findUnique({
        where: { id: athleteId }
      })

      if (!athlete || athlete.deletedAt) {
        return res.status(404).json({
          success: false,
          error: 'Athlete not found',
        })
      }

      const analyses = await prisma.analysis.findMany({
        where: { athleteId },
        orderBy: {
          evaluationDate: 'desc',
        },
      })

      res.json({
        success: true,
        data: analyses,
        total: analyses.length,
      })
    } catch (error) {
      console.error('Error fetching athlete analyses:', error)
      res.status(500).json({
        success: false,
        error: 'Error fetching athlete analyses',
      })
    }
  }

  /**
   * POST /api/analyses
   * Create a new analysis with optional graph images
   */
  static async create(req: Request, res: Response) {
    try {
      const {
        athleteId,
        evaluationDate,
        flexibilityAnalysis,
        biobitAnalysis,
        muscularAsymmetry,
        activeMotorControl,
        functionalMuscleFatigue,
        inertiaForceControl,
        weakPoints, // JSON string array
        power,
        endurance,
        strength,
        flexibility,
        speed,
        globalClassification,
        coachRecommendations
      } = req.body

      // Validate required fields
      if (!athleteId || !evaluationDate) {
        return res.status(400).json({
          success: false,
          error: 'athleteId and evaluationDate are required',
        })
      }

      // Verify athlete exists
      const athlete = await prisma.athlete.findUnique({
        where: { id: athleteId }
      })

      if (!athlete || athlete.deletedAt) {
        return res.status(404).json({
          success: false,
          error: 'Athlete not found',
        })
      }

      // Validate physical capacities (0-100)
      const validateCapacity = (value: any, name: string) => {
        if (value !== undefined && value !== null) {
          const num = parseInt(value)
          if (isNaN(num) || num < 0 || num > 100) {
            throw new Error(`${name} must be between 0 and 100`)
          }
          return num
        }
        return null
      }

      // Handle multiple graph images upload
      let graphImagesArray: string[] = []
      let tempAnalysisId = `temp_${Date.now()}`

      if (req.files && Array.isArray(req.files)) {
        const uploadPromises = (req.files as Express.Multer.File[]).map(async (file) => {
          const result = await UploadService.uploadPhoto(
            file,
            tempAnalysisId,
            `physoft/analysis/${tempAnalysisId}`
          )
          return result.url
        })
        graphImagesArray = await Promise.all(uploadPromises)
      }

      // Calculate global classification based on capacities average and cohort comparison
      let calculatedGlobalClassification = globalClassification || 'medium'
      
      if (power !== undefined || endurance !== undefined || strength !== undefined || 
          flexibility !== undefined || speed !== undefined) {
        const capacitiesAverage = ComparisonService.calculateCapacitiesAverage({
          power: validateCapacity(power, 'Power'),
          endurance: validateCapacity(endurance, 'Endurance'),
          strength: validateCapacity(strength, 'Strength'),
          flexibility: validateCapacity(flexibility, 'Flexibility'),
          speed: validateCapacity(speed, 'Speed')
        })
        
        // Calculate classification based on comparison with same sport/bodyType
        calculatedGlobalClassification = await ComparisonService.calculateGlobalClassification(
          athleteId,
          capacitiesAverage
        )
      }

      const newAnalysis = await prisma.analysis.create({
        data: {
          athleteId,
          evaluationDate: new Date(evaluationDate),
          graphImages: graphImagesArray.length > 0 ? JSON.stringify(graphImagesArray) : null,
          flexibilityAnalysis: flexibilityAnalysis || null,
          biobitAnalysis: biobitAnalysis || null,
          muscularAsymmetry: muscularAsymmetry || null,
          activeMotorControl: activeMotorControl || null,
          functionalMuscleFatigue: functionalMuscleFatigue || null,
          inertiaForceControl: inertiaForceControl || null,
          weakPoints: weakPoints || null,
          power: validateCapacity(power, 'Power'),
          endurance: validateCapacity(endurance, 'Endurance'),
          strength: validateCapacity(strength, 'Strength'),
          flexibility: validateCapacity(flexibility, 'Flexibility'),
          speed: validateCapacity(speed, 'Speed'),
          globalClassification: calculatedGlobalClassification,
          cohortClassification: globalClassification || null, // Store the cohort classification separately
          coachRecommendations: coachRecommendations || null,
        },
        include: {
          athlete: {
            select: {
              id: true,
              accessCode: true,
              name: true,
              sport: true
            }
          }
        }
      })

      res.status(201).json({
        success: true,
        data: newAnalysis,
        message: 'Analysis created successfully',
      })
    } catch (error: any) {
      console.error('Error creating analysis:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Error creating analysis',
      })
    }
  }

  /**
   * PUT /api/analyses/:id
   * Update an analysis
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const {
        evaluationDate,
        flexibilityAnalysis,
        biobitAnalysis,
        muscularAsymmetry,
        activeMotorControl,
        functionalMuscleFatigue,
        inertiaForceControl,
        weakPoints,
        power,
        endurance,
        strength,
        flexibility,
        speed,
        globalClassification,
        coachRecommendations
      } = req.body

      // Check if analysis exists
      const existing = await prisma.analysis.findUnique({
        where: { id: parseInt(id) }
      })

      if (!existing) {
        return res.status(404).json({
          success: false,
          error: 'Analysis not found',
        })
      }

      // Validate physical capacities
      const validateCapacity = (value: any, name: string) => {
        if (value !== undefined && value !== null) {
          const num = parseInt(value)
          if (isNaN(num) || num < 0 || num > 100) {
            throw new Error(`${name} must be between 0 and 100`)
          }
          return num
        }
        return undefined
      }

      const updatedAnalysis = await prisma.analysis.update({
        where: { id: parseInt(id) },
        data: {
          ...(evaluationDate && { evaluationDate: new Date(evaluationDate) }),
          ...(flexibilityAnalysis !== undefined && { flexibilityAnalysis }),
          ...(biobitAnalysis !== undefined && { biobitAnalysis }),
          ...(muscularAsymmetry !== undefined && { muscularAsymmetry }),
          ...(activeMotorControl !== undefined && { activeMotorControl }),
          ...(functionalMuscleFatigue !== undefined && { functionalMuscleFatigue }),
          ...(inertiaForceControl !== undefined && { inertiaForceControl }),
          ...(weakPoints !== undefined && { weakPoints }),
          ...(power !== undefined && { power: validateCapacity(power, 'Power') }),
          ...(endurance !== undefined && { endurance: validateCapacity(endurance, 'Endurance') }),
          ...(strength !== undefined && { strength: validateCapacity(strength, 'Strength') }),
          ...(flexibility !== undefined && { flexibility: validateCapacity(flexibility, 'Flexibility') }),
          ...(speed !== undefined && { speed: validateCapacity(speed, 'Speed') }),
          ...(globalClassification !== undefined && { globalClassification }),
          ...(coachRecommendations !== undefined && { coachRecommendations }),
        },
        include: {
          athlete: {
            select: {
              id: true,
              accessCode: true,
              name: true,
              sport: true
            }
          }
        }
      })

      res.json({
        success: true,
        data: updatedAnalysis,
        message: 'Analysis updated successfully',
      })
    } catch (error: any) {
      console.error('Error updating analysis:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Error updating analysis',
      })
    }
  }

  /**
   * POST /api/analyses/:id/graphs
   * Upload or add graph images to an analysis
   */
  static async uploadGraphs(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No image files provided',
        })
      }

      // Get current analysis
      const analysis = await prisma.analysis.findUnique({
        where: { id: parseInt(id) }
      })

      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: 'Analysis not found',
        })
      }

      // Upload new graph images
      const uploadPromises = (req.files as Express.Multer.File[]).map(async (file) => {
        const result = await UploadService.uploadPhoto(
          file,
          `analysis_${id}`,
          `physoft/analysis/${id}`
        )
        return result.url
      })
      const newGraphUrls = await Promise.all(uploadPromises)

      // Merge with existing graphs
      let existingGraphs: string[] = []
      if (analysis.graphImages) {
        try {
          existingGraphs = JSON.parse(analysis.graphImages)
        } catch (e) {
          existingGraphs = []
        }
      }

      const allGraphs = [...existingGraphs, ...newGraphUrls]

      // Update analysis
      const updatedAnalysis = await prisma.analysis.update({
        where: { id: parseInt(id) },
        data: {
          graphImages: JSON.stringify(allGraphs)
        }
      })

      res.json({
        success: true,
        data: updatedAnalysis,
        message: `${newGraphUrls.length} graph images uploaded successfully`,
      })
    } catch (error) {
      console.error('Error uploading graphs:', error)
      res.status(500).json({
        success: false,
        error: 'Error uploading graphs',
      })
    }
  }

  /**
   * DELETE /api/analyses/:id
   * Delete an analysis
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params

      // Get analysis to delete associated images
      const analysis = await prisma.analysis.findUnique({
        where: { id: parseInt(id) }
      })

      if (!analysis) {
        return res.status(404).json({
          success: false,
          error: 'Analysis not found',
        })
      }

      // Delete associated graph images
      if (analysis.graphImages) {
        try {
          const graphUrls: string[] = JSON.parse(analysis.graphImages)
          for (const url of graphUrls) {
            await UploadService.deletePhoto(url, null)
          }
        } catch (e) {
          console.error('Error deleting graph images:', e)
        }
      }

      // Delete analysis
      await prisma.analysis.delete({
        where: { id: parseInt(id) }
      })

      res.json({
        success: true,
        message: 'Analysis deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting analysis:', error)
      res.status(500).json({
        success: false,
        error: 'Error deleting analysis',
      })
    }
  }

  /**
   * POST /api/analyses/ai-analyze
   * Analyze images using Gemini AI
   */
  static async aiAnalyze(req: Request, res: Response) {
    try {
      // Import AI service dynamically to avoid circular dependencies
      const aiService = (await import('../../application/services/ai.service')).default

      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No image files provided. Please upload at least one image.',
        })
      }

      const { analysisTypes } = req.body

      if (!analysisTypes) {
        return res.status(400).json({
          success: false,
          error: 'analysisTypes is required',
        })
      }

      // Parse analysisTypes if it's a JSON string
      let parsedAnalysisTypes
      try {
        parsedAnalysisTypes = typeof analysisTypes === 'string'
          ? JSON.parse(analysisTypes)
          : analysisTypes
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'Invalid analysisTypes format',
        })
      }

      // Convert uploaded files to buffers
      const imageBuffers = (req.files as Express.Multer.File[]).map(file => file.buffer)

      // Call AI service
      const results = await aiService.analyzeImages(imageBuffers, parsedAnalysisTypes)

      res.json({
        success: true,
        data: results,
        message: 'AI analysis completed successfully',
      })
    } catch (error: any) {
      console.error('Error in AI analysis:', error)
      res.status(500).json({
        success: false,
        error: error.message || 'Error processing AI analysis',
      })
    }
  }

  /**
   * GET /api/analyses/statistics/summary
   * Get general analysis statistics
   */
  static async getStatistics(_req: Request, res: Response) {
    try {
      const total = await prisma.analysis.count()

      const byClassification = await prisma.analysis.groupBy({
        by: ['globalClassification'],
        _count: true
      })

      // Average physical capacities
      const averages = await prisma.analysis.aggregate({
        _avg: {
          power: true,
          endurance: true,
          strength: true,
          flexibility: true,
          speed: true
        }
      })

      // Recent analyses
      const recentAnalyses = await prisma.analysis.findMany({
        take: 10,
        orderBy: { evaluationDate: 'desc' },
        include: {
          athlete: {
            select: {
              id: true,
              accessCode: true,
              name: true,
              sport: true
            }
          }
        }
      })

      res.json({
        success: true,
        data: {
          total,
          byClassification,
          averages: {
            power: averages._avg.power || 0,
            endurance: averages._avg.endurance || 0,
            strength: averages._avg.strength || 0,
            flexibility: averages._avg.flexibility || 0,
            speed: averages._avg.speed || 0
          },
          recentAnalyses
        }
      })
    } catch (error) {
      console.error('Error fetching statistics:', error)
      res.status(500).json({
        success: false,
        error: 'Error fetching statistics'
      })
    }
  }
}


