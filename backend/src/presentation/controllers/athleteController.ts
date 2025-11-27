// ============================================
// CONTROLLER: Athlete - Presentation Layer
// ============================================
// Handles HTTP requests related to athletes
// ============================================

import { Request, Response } from 'express'
import { prisma } from '../../infrastructure/prismaClient'
import { ComparisonService } from '../../application/services/ComparisonService'
import { ImageStorageService } from '../../application/services/ImageStorageService'
import path from 'path'

export class AthleteController {
  /**
   * GET /api/athletes
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
   * GET /api/athletes/:id
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
   * POST /api/athletes
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
   * PUT /api/athletes/:id
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
   * DELETE /api/athletes/:id
   * Delete an athlete
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params

      // Get athlete to delete associated images
      const athlete = await prisma.athlete.findUnique({
        where: { id: parseInt(id) }
      })

      if (athlete) {
        // Delete images if they exist
        if (athlete.photo) {
          ImageStorageService.deleteLocalImage(athlete.photo)
        }
        if (athlete.cloudinaryPublicId) {
          await ImageStorageService.deleteFromCloudinary(athlete.cloudinaryPublicId)
        }
      }

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
   * GET /api/athletes/:id/compare
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
   * GET /api/athletes/statistics/summary
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

  /**
   * POST /api/athletes/:id/photo
   * Upload or update athlete photo (hybrid storage: local + Cloudinary)
   */
  static async uploadPhoto(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No image file provided'
        })
      }

      const athlete = await prisma.athlete.findUnique({
        where: { id: parseInt(id) }
      })

      if (!athlete) {
        return res.status(404).json({
          success: false,
          error: 'Athlete not found'
        })
      }

      // Delete previous images if they exist
      if (athlete.photo) {
        ImageStorageService.deleteLocalImage(athlete.photo)
      }
      if (athlete.cloudinaryPublicId) {
        await ImageStorageService.deleteFromCloudinary(athlete.cloudinaryPublicId)
      }

      // Local photo URL
      const localPhotoUrl = `/uploads/athletes/${req.file.filename}`
      const localPhotoPath = path.join(__dirname, '../../../public', localPhotoUrl)

      // Try to upload to Cloudinary
      const cloudinaryResult = await ImageStorageService.uploadToCloudinary(
        localPhotoPath,
        parseInt(id)
      )

      // Update database
      const updatedAthlete = await prisma.athlete.update({
        where: { id: parseInt(id) },
        data: {
          photo: cloudinaryResult?.url || localPhotoUrl,
          cloudinaryPublicId: cloudinaryResult?.publicId || null
        }
      })

      res.json({
        success: true,
        data: updatedAthlete,
        message: 'Photo uploaded successfully',
        cloudinaryStatus: cloudinaryResult ? 'uploaded' : 'offline_mode'
      })
    } catch (error) {
      console.error('Error uploading photo:', error)
      res.status(500).json({
        success: false,
        error: 'Error uploading photo'
      })
    }
  }
}
