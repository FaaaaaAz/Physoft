// ============================================
// CONTROLLER: Analysis
// ============================================
// Controllers for CRUD operations on musculoskeletal analyses
// ============================================

import { Request, Response } from 'express'
import { prisma } from '../../infrastructure/prismaClient'

// ============================================
// GET ALL ANALYSES
// ============================================
export const getAll = async (req: Request, res: Response) => {
  try {
    const { athleteId, analysisType, dateFrom, dateTo } = req.query

    // Build dynamic filters
    const where: any = {}

    if (athleteId) {
      where.athleteId = parseInt(athleteId as string)
    }

    if (analysisType) {
      where.analysisType = analysisType as string
    }

    if (dateFrom || dateTo) {
      where.analysisDate = {}
      if (dateFrom) {
        where.analysisDate.gte = new Date(dateFrom as string)
      }
      if (dateTo) {
        where.analysisDate.lte = new Date(dateTo as string)
      }
    }

    const analysisList = await prisma.analysis.findMany({
      where,
      include: {
        athlete: {
          select: {
            id: true,
            name: true,
            sport: true,
            bodyType: true,
          }
        }
      },
      orderBy: {
        analysisDate: 'desc'
      }
    })

    res.json({
      success: true,
      count: analysisList.length,
      data: analysisList
    })
  } catch (error) {
    console.error('Error fetching analyses:', error)
    res.status(500).json({
      success: false,
      error: 'Error fetching analyses'
    })
  }
}

// ============================================
// GET ANALYSIS BY ID
// ============================================
export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const analysis = await prisma.analysis.findUnique({
      where: { id: parseInt(id) },
      include: {
        athlete: true
      }
    })

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      })
    }

    res.json({
      success: true,
      data: analysis
    })
  } catch (error) {
    console.error('Error fetching analysis:', error)
    res.status(500).json({
      success: false,
      error: 'Error fetching analysis'
    })
  }
}

// ============================================
// GET ANALYSES BY ATHLETE
// ============================================
export const getByAthleteId = async (req: Request, res: Response) => {
  try {
    const { athleteId } = req.params

    const analysisList = await prisma.analysis.findMany({
      where: { athleteId: parseInt(athleteId) },
      orderBy: {
        analysisDate: 'desc'
      }
    })

    res.json({
      success: true,
      count: analysisList.length,
      data: analysisList
    })
  } catch (error) {
    console.error('Error fetching athlete analyses:', error)
    res.status(500).json({
      success: false,
      error: 'Error fetching athlete analyses'
    })
  }
}

// ============================================
// CREATE ANALYSIS
// ============================================
export const create = async (req: Request, res: Response) => {
  try {
    const {
      athleteId,
      analysisType,
      dataJson,
      overallStatus,
      weakPoint1,
      weakPoint2,
      weakPoint3,
      improvementMargin
    } = req.body

    // Basic validations
    if (!athleteId || !analysisType || !dataJson) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: athleteId, analysisType, dataJson'
      })
    }

    // Verify athlete exists
    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId }
    })

    if (!athlete) {
      return res.status(404).json({
        success: false,
        error: 'Athlete not found'
      })
    }

    // Validate dataJson is valid JSON
    let validatedData: string
    try {
      if (typeof dataJson === 'string') {
        JSON.parse(dataJson)
        validatedData = dataJson
      } else {
        validatedData = JSON.stringify(dataJson)
      }
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: 'The dataJson field must be valid JSON'
      })
    }

    const newAnalysis = await prisma.analysis.create({
      data: {
        athleteId,
        analysisType,
        dataJson: validatedData,
        overallStatus,
        weakPoint1,
        weakPoint2,
        weakPoint3,
        improvementMargin
      },
      include: {
        athlete: {
          select: {
            id: true,
            name: true,
            sport: true
          }
        }
      }
    })

    res.status(201).json({
      success: true,
      message: 'Analysis created successfully',
      data: newAnalysis
    })
  } catch (error) {
    console.error('Error creating analysis:', error)
    res.status(500).json({
      success: false,
      error: 'Error creating analysis'
    })
  }
}

// ============================================
// UPDATE ANALYSIS
// ============================================
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const {
      analysisType,
      dataJson,
      overallStatus,
      weakPoint1,
      weakPoint2,
      weakPoint3,
      improvementMargin
    } = req.body

    // Verify that the analysis exists
    const existingAnalysis = await prisma.analysis.findUnique({
      where: { id: parseInt(id) }
    })

    if (!existingAnalysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      })
    }

    // Validate dataJson if provided
    let validatedData: string | undefined
    if (dataJson) {
      try {
        if (typeof dataJson === 'string') {
          JSON.parse(dataJson)
          validatedData = dataJson
        } else {
          validatedData = JSON.stringify(dataJson)
        }
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: 'The dataJson field must be valid JSON'
        })
      }
    }

    // Update analysis
    const updatedAnalysis = await prisma.analysis.update({
      where: { id: parseInt(id) },
      data: {
        ...(analysisType && { analysisType }),
        ...(validatedData && { dataJson: validatedData }),
        ...(overallStatus !== undefined && { overallStatus }),
        ...(weakPoint1 !== undefined && { weakPoint1 }),
        ...(weakPoint2 !== undefined && { weakPoint2 }),
        ...(weakPoint3 !== undefined && { weakPoint3 }),
        ...(improvementMargin !== undefined && { improvementMargin })
      },
      include: {
        athlete: {
          select: {
            id: true,
            name: true,
            sport: true
          }
        }
      }
    })

    res.json({
      success: true,
      message: 'Analysis updated successfully',
      data: updatedAnalysis
    })
  } catch (error) {
    console.error('Error al actualizar análisis:', error)
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el análisis'
    })
  }
}

// ============================================
// DELETE ANALYSIS
// ============================================
export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Verify that the analysis exists
    const analysis = await prisma.analysis.findUnique({
      where: { id: parseInt(id) }
    })

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Analysis not found'
      })
    }

    await prisma.analysis.delete({
      where: { id: parseInt(id) }
    })

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting analysis:', error)
    res.status(500).json({
      success: false,
      error: 'Error deleting analysis'
    })
  }
}

// ============================================
// GET STATISTICS
// ============================================
export const getStatistics = async (req: Request, res: Response) => {
  try {
    const totalAnalyses = await prisma.analysis.count()
    
    const analysesByType = await prisma.analysis.groupBy({
      by: ['analysisType'],
      _count: true
    })

    const analysesByStatus = await prisma.analysis.groupBy({
      by: ['overallStatus'],
      _count: true,
      where: {
        overallStatus: {
          not: null
        }
      }
    })

    // Recent analyses (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentAnalyses = await prisma.analysis.count({
      where: {
        analysisDate: {
          gte: thirtyDaysAgo
        }
      }
    })

    res.json({
      success: true,
      data: {
        total: totalAnalyses,
        byType: analysesByType,
        byStatus: analysesByStatus,
        recent: recentAnalyses
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


