// ============================================
// SERVICE: Comparison - Application Layer
// ============================================
// Business logic to compare athletes with cohorts
// Placeholder for MVP - future implementation
// ============================================

import { prisma } from '../../infrastructure/prismaClient'
import { ComparisonCriteria, ComparisonResult, getComparisonRules } from '../../domain/types'

export class ComparisonService {
  /**
   * Generate comparison criteria for an athlete
   * based on their physical characteristics and age rules
   */
  static generateCriteria(athlete: {
    gender: string
    sport: string
    position?: string | null
    bodyType: string
    height: number
    weight: number
    age: number
  }): ComparisonCriteria {
    const rules = getComparisonRules(athlete.age)

    return {
      gender: athlete.gender,
      sport: athlete.sport,
      position: athlete.position || undefined,
      bodyType: athlete.bodyType,
      heightMin: athlete.height - rules.heightTolerance,
      heightMax: athlete.height + rules.heightTolerance,
      weightMin: athlete.weight - rules.weightTolerance,
      weightMax: athlete.weight + rules.weightTolerance,
      ageMin: athlete.age - rules.ageTolerance,
      ageMax: athlete.age + rules.ageTolerance,
    }
  }

  /**
   * Search for comparable athletes in the database
   * according to defined criteria
   */
  static async findCohort(criteria: ComparisonCriteria) {
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
        age: {
          gte: criteria.ageMin,
          lte: criteria.ageMax,
        },
      },
    })
  }

  /**
   * Compare an athlete with their cohort
   * Placeholder: statistical comparison logic pending
   */
  static async compareWithCohort(athleteId: number): Promise<ComparisonResult> {
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


