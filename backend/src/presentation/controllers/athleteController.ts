// ============================================
// CONTROLLER: Athlete - Presentation Layer
// ============================================
// Handles HTTP requests related to athletes
// ============================================

import { Request, Response } from 'express'
import { prisma } from '../../infrastructure/prismaClient'
import { ComparisonService } from '../../application/services/ComparisonService'
import { UploadService } from '../../application/services/uploadService'

// Helper function to generate next access code
async function generateAccessCode(): Promise<string> {
  const athletes = await prisma.athlete.findMany({
    select: { accessCode: true },
    orderBy: { accessCode: 'desc' },
    take: 1
  })

  if (athletes.length === 0) {
    return '00000'
  }

  const lastCode = parseInt(athletes[0].accessCode)
  const nextCode = (lastCode + 1).toString().padStart(5, '0')
  return nextCode
}

export class AthleteController {
  /**
   * GET /api/athletes
   * Get all athletes with optional filters
   */
  static async getAll(req: Request, res: Response) {
    try {
      const { name, gender, sport, bodyType, nationality } = req.query

      // Build dynamic filters
      const where: any = { deletedAt: null }

      if (name) {
        where.name = {
          contains: name as string,
          mode: 'insensitive'
        }
      }

      if (gender) where.gender = gender as string
      if (sport) where.sport = sport as string
      if (bodyType) where.bodyType = bodyType as string
      if (nationality) where.nationality = nationality as string

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
      const athlete = await prisma.athlete.findUnique({
        where: { id },
        include: {
          analyses: true,
        },
      })

      if (!athlete || athlete.deletedAt) {
        return res.status(404).json({
          success: false,
          error: 'Athlete not found',
        })
      }

      res.json({
        success: true,
        data: athlete,
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
   * Create a new athlete with optional photo
   */
  static async create(req: Request, res: Response) {
    try {
      const {
        name, gender, birthDate, nationality, sport, club,
        position, bodyType, height, weight, email, phone, deviceId
      } = req.body

      // Basic validations
      if (!name || !gender || !sport || !bodyType || !height || !weight) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: name, gender, sport, bodyType, height, weight',
        })
      }

      // Generate access code
      const accessCode = await generateAccessCode()

      // Generate UUID for athlete
      const id = crypto.randomUUID()

      // Handle photo upload if present
      let photoUrl: string | null = null
      let cloudinaryPublicId: string | null = null

      if (req.file) {
        const uploadResult = await UploadService.uploadPhoto(req.file, id)
        photoUrl = uploadResult.url
        cloudinaryPublicId = uploadResult.publicId || null
      }

      const newAthlete = await prisma.athlete.create({
        data: {
          id,
          accessCode,
          name,
          gender,
          birthDate: birthDate || null,
          nationality: nationality || null,
          sport,
          club: club || null,
          position: position || null,
          bodyType,
          height: parseFloat(height),
          weight: parseFloat(weight),
          email: email || null,
          phone: phone || null,
          photo: photoUrl,
          cloudinaryPublicId,
          deviceId: deviceId || null,
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
      const {
        name, gender, birthDate, nationality, sport, club,
        position, bodyType, height, weight, email, phone
      } = req.body

      // Check if athlete exists
      const existing = await prisma.athlete.findUnique({ where: { id } })
      if (!existing || existing.deletedAt) {
        return res.status(404).json({
          success: false,
          error: 'Athlete not found',
        })
      }

      const updatedAthlete = await prisma.athlete.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(gender && { gender }),
          ...(birthDate !== undefined && { birthDate }),
          ...(nationality !== undefined && { nationality }),
          ...(sport && { sport }),
          ...(club !== undefined && { club }),
          ...(position !== undefined && { position }),
          ...(bodyType && { bodyType }),
          ...(height && { height: parseFloat(height) }),
          ...(weight && { weight: parseFloat(weight) }),
          ...(email !== undefined && { email }),
          ...(phone !== undefined && { phone }),
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
   * POST /api/atletas/:id/photo
   * Upload or update athlete photo
   */
  static async uploadPhoto(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No image file provided',
        })
      }

      // Get current athlete to delete old photo
      const athlete = await prisma.athlete.findUnique({
        where: { id }
      })

      if (!athlete || athlete.deletedAt) {
        return res.status(404).json({
          success: false,
          error: 'Athlete not found',
        })
      }

      // Delete old photo if exists
      if (athlete.photo) {
        await UploadService.deletePhoto(athlete.photo, athlete.cloudinaryPublicId)
      }

      // Upload new photo
      const uploadResult = await UploadService.uploadPhoto(req.file, id)

      // Update athlete with new photo
      const updatedAthlete = await prisma.athlete.update({
        where: { id },
        data: {
          photo: uploadResult.url,
          cloudinaryPublicId: uploadResult.publicId || null
        }
      })

      res.json({
        success: true,
        data: updatedAthlete,
        message: 'Photo uploaded successfully',
      })
    } catch (error) {
      console.error('Error uploading photo:', error)
      res.status(500).json({
        success: false,
        error: 'Error uploading photo',
      })
    }
  }

  /**
   * DELETE /api/atletas/:id
   * Delete an athlete (soft delete)
   */
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params

      // Get athlete to delete photo
      const athlete = await prisma.athlete.findUnique({
        where: { id }
      })

      if (!athlete || athlete.deletedAt) {
        return res.status(404).json({
          success: false,
          error: 'Athlete not found',
        })
      }

      // Delete photo if exists
      if (athlete.photo) {
        await UploadService.deletePhoto(athlete.photo, athlete.cloudinaryPublicId)
      }

      // Soft delete by setting deletedAt
      await prisma.athlete.update({
        where: { id },
        data: { deletedAt: new Date() }
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
      const result = await ComparisonService.compareWithCohort(id)

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
  static async estadisticas(_req: Request, res: Response) {
    try {
      const total = await prisma.athlete.count({
        where: { deletedAt: null }
      })

      const byGender = await prisma.athlete.groupBy({
        by: ['gender'],
        where: { deletedAt: null },
        _count: true
      })

      const bySport = await prisma.athlete.groupBy({
        by: ['sport'],
        where: { deletedAt: null },
        _count: true
      })

      const byBodyType = await prisma.athlete.groupBy({
        by: ['bodyType'],
        where: { deletedAt: null },
        _count: true
      })

      // Average height and weight
      const averages = await prisma.athlete.aggregate({
        where: { deletedAt: null },
        _avg: {
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
            height: averages._avg.height || 0,
            weight: averages._avg.weight || 0
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
