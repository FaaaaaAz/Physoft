// ============================================
// CONTROLLER: Athlete - Presentation Layer
// ============================================
// Handles HTTP requests related to athletes
// ============================================

import { Request, Response } from 'express'
import { prisma } from '../../infrastructure/prismaClient'
import { ComparisonService } from '../../application/services/ComparisonService'

export class AthleteController {
  /**
   * GET /api/atletas
   * Get all athletes with optional filters
   * Query params: name, gender, sport, bodyType, ageMin, ageMax
   */
  static async getAll(req: Request, res: Response) {
    try {
      const { name, gender, sport, bodyType, ageMin, ageMax } = req.query

      // Build dynamic filters
      const where: any = {}

      if (name) {
        where.name = {
          contains: name as string,
          mode: 'insensitive'
        }
      }

      if (gender) {
        where.gender = gender as string
      }

      if (sport) {
        where.sport = sport as string
      }

      if (bodyType) {
        where.bodyType = bodyType as string
      }

      if (ageMin || ageMax) {
        where.age = {}
        if (ageMin) where.age.gte = parseInt(ageMin as string)
        if (ageMax) where.age.lte = parseInt(ageMax as string)
      }

      const athletes = await prisma.athlete.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      })

      res.json({
        success: true,
        data: athletes,
        total: athletes.length,
      })
    } catch (error) {
      console.error('Error fetching athletes:', error)
      res.status(500).json({
        success: false,
        error: 'Error fetching athletes',
      })
    }
  }

  /**
   * GET /api/atletas/:id
   * Get an athlete by ID
   */
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params
      const atleta = await prisma.athlete.findUnique({
        where: { id: parseInt(id) },
        include: {
          analyses: true, // Include related analyses
        },
      })

      if (!atleta) {
        return res.status(404).json({
          success: false,
          error: 'Athlete not found',
        })
      }

      res.json({
        success: true,
        data: atleta,
      })
    } catch (error) {
      console.error('Error fetching athlete:', error)
      res.status(500).json({
        success: false,
        error: 'Error fetching athlete',
      })
    }
  }

  /**
   * POST /api/atletas
   * Create a new athlete
   */
  static async create(req: Request, res: Response) {
    try {
      const { name, gender, sport, position, bodyType, height, weight, age } = req.body

      // Basic validations
      if (!name || !gender || !sport || !bodyType || !height || !weight || !age) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields',
        })
      }

      const newAthlete = await prisma.athlete.create({
        data: {
          name,
          gender,
          sport,
          position,
          bodyType,
          height: parseFloat(height),
          weight: parseFloat(weight),
          age: parseInt(age),
        },
      })

      res.status(201).json({
        success: true,
        data: newAthlete,
        message: 'Athlete created successfully',
      })
    } catch (error) {
      console.error('Error creating athlete:', error)
      res.status(500).json({
        success: false,
        error: 'Error creating athlete',
      })
    }
  }

  /**
   * PUT /api/atletas/:id
   * Update an athlete
   */
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { name, gender, sport, position, bodyType, height, weight, age } = req.body

      const updatedAthlete = await prisma.athlete.update({
        where: { id: parseInt(id) },
        data: {
          ...(name && { name }),
          ...(gender && { gender }),
          ...(sport && { sport }),
          ...(position !== undefined && { position }),
          ...(bodyType && { bodyType }),
          ...(height && { height: parseFloat(height) }),
          ...(weight && { weight: parseFloat(weight) }),
          ...(age && { age: parseInt(age) }),
        },
      })

      res.json({
        success: true,
        data: updatedAthlete,
        message: 'Athlete updated successfully',
      })
    } catch (error) {
      console.error('Error updating athlete:', error)
      res.status(500).json({
        success: false,
        error: 'Error updating athlete',
      })
    }
  }

  /**
   * DELETE /api/atletas/:id
   * Delete an athlete
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params

      await prisma.athlete.delete({
        where: { id: parseInt(id) },
      })

      res.json({
        success: true,
        message: 'Athlete deleted successfully',
      })
    } catch (error) {
      console.error('Error deleting athlete:', error)
      res.status(500).json({
        success: false,
        error: 'Error deleting athlete',
      })
    }
  }

  /**
   * GET /api/atletas/:id/comparar
   * Compare an athlete with their cohort
   */
  static async comparar(req: Request, res: Response) {
    try {
      const { id } = req.params
      const result = await ComparisonService.compareWithCohort(parseInt(id))

      res.json({
        success: true,
        data: result,
      })
    } catch (error) {
      console.error('Error comparing athlete:', error)
      res.status(500).json({
        success: false,
        error: 'Error comparing athlete',
      })
    }
  }

  /**
   * GET /api/atletas/estadisticas/resumen
   * Get general athlete statistics
   */
  static async estadisticas(req: Request, res: Response) {
    try {
      const total = await prisma.athlete.count()

      const byGender = await prisma.athlete.groupBy({
        by: ['gender'],
        _count: true
      })

      const bySport = await prisma.athlete.groupBy({
        by: ['sport'],
        _count: true
      })

      const byBodyType = await prisma.athlete.groupBy({
        by: ['bodyType'],
        _count: true
      })

      // Average age, height and weight
      const averages = await prisma.athlete.aggregate({
        _avg: {
          age: true,
          height: true,
          weight: true
        }
      })

      res.json({
        success: true,
        data: {
          total,
          byGender,
          bySport,
          byBodyType,
          averages: {
            age: averages._avg.age,
            height: averages._avg.height,
            weight: averages._avg.weight
          }
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
