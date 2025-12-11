// ============================================
// SERVICE: Comparison - Application Layer
// ============================================
// Business logic to compare athletes with cohorts
// Calculates classification based on average capacities
// ============================================

import { prisma } from '../../infrastructure/prismaClient'
import { ComparisonResult } from '../../domain/types'

export class ComparisonService {
  /**
   * Calculate average of physical capacities
   */
  static calculateCapacitiesAverage(capacities: {
    power?: number | null
    endurance?: number | null
    strength?: number | null
    flexibility?: number | null
    speed?: number | null
  }): number {
    const values = [
      capacities.power,
      capacities.endurance,
      capacities.strength,
      capacities.flexibility,
      capacities.speed
    ].filter((val): val is number => val !== null && val !== undefined)

    if (values.length === 0) return 0
    return values.reduce((sum, val) => sum + val, 0) / values.length
  }

  /**
   * Calculate global classification based on comparison with same sport and bodyType
   * Returns: "low", "medium", or "high"
   */
  static async calculateGlobalClassification(
    athleteId: string,
    currentAverage: number
  ): Promise<string> {
    // Get the athlete to know their sport and bodyType
    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
      select: { sport: true, bodyType: true }
    })

    if (!athlete) {
      return 'medium' // Default if athlete not found
    }

    // Get all analyses from athletes with same sport and bodyType
    const comparableAnalyses = await prisma.analysis.findMany({
      where: {
        athlete: {
          sport: athlete.sport,
          bodyType: athlete.bodyType,
          deletedAt: null
        }
      },
      select: {
        power: true,
        endurance: true,
        strength: true,
        flexibility: true,
        speed: true
      }
    })

    if (comparableAnalyses.length === 0) {
      return 'medium' // Default if no comparable data
    }

    // Calculate average for each comparable analysis
    const averages = comparableAnalyses.map(analysis =>
      this.calculateCapacitiesAverage(analysis)
    )

    // Calculate cohort statistics
    const cohortAverage = averages.reduce((sum, avg) => sum + avg, 0) / averages.length
    const cohortStdDev = this.calculateStandardDeviation(averages, cohortAverage)

    // Classify based on standard deviation
    // Above 0.5 std dev = high, below -0.5 std dev = low, otherwise = medium
    const zScore = cohortStdDev > 0 ? (currentAverage - cohortAverage) / cohortStdDev : 0

    if (zScore >= 0.5) return 'high'
    if (zScore <= -0.5) return 'low'
    return 'medium'
  }

  /**
   * Calculate standard deviation
   */
  private static calculateStandardDeviation(values: number[], mean: number): number {
    if (values.length === 0) return 0
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2))
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length
    return Math.sqrt(avgSquaredDiff)
  }

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
