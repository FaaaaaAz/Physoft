// ============================================
// SERVICE: Comparison - Application Layer
// ============================================
// Business logic to compare athletes with cohorts
// Placeholder for MVP - future implementation
// ============================================

import { prisma } from '../../infrastructure/prismaClient'
import { ComparisonResult } from '../../domain/types'

export class ComparisonService {
  /**
   * Generate comparison criteria for an athlete
   * based on their physical characteristics
   */
  static generateCriteria(athlete: {
    gender: string
    sport: string
    position?: string | null
    bodyType: string
    height: number
    weight: number
  }) {
    // Use default tolerance values for now
    const heightTolerance = 10 // cm
    const weightTolerance = 10 // kg

    return {
      gender: athlete.gender,
      sport: athlete.sport,
      position: athlete.position || undefined,
      bodyType: athlete.bodyType,
      heightMin: athlete.height - heightTolerance,
      heightMax: athlete.height + heightTolerance,
      weightMin: athlete.weight - weightTolerance,
      weightMax: athlete.weight + weightTolerance,
    }
  }

  /**
   * Search for comparable athletes in the database
   * according to defined criteria
   */
  static async findCohort(criteria: ReturnType<typeof ComparisonService.generateCriteria>) {
    return await prisma.athlete.findMany({
      where: {
        gender: criteria.gender,
        sport: criteria.sport,
        bodyType: criteria.bodyType,
        height: {
          gte: criteria.heightMin,
          lte: criteria.heightMax,
        },
        weight: {
          gte: criteria.weightMin,
          lte: criteria.weightMax,
        },
        deletedAt: null, // Only active athletes
      },
    })
  }

  /**
   * Compare an athlete with their cohort
   * Placeholder: statistical comparison logic pending
   */
  static async compareWithCohort(athleteId: string): Promise<ComparisonResult> {
    // Get the athlete
    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
    })

    if (!athlete) {
      throw new Error('Athlete not found')
    }

    // Generate criteria and search cohort
    const criteria = this.generateCriteria(athlete)
    const cohort = await this.findCohort(criteria)

    // Placeholder: Statistical comparison logic would go here
    // For now we return an example result
    return {
      overallStatus: 'Average',
      weakPoints: [
        'Explosive strength',
        'Flexibility',
        'Anaerobic resistance',
      ],
      absoluteImprovement: 15.5,
      percentualImprovement: 12.3,
      athletesCompared: cohort.length,
    }
  }
}
