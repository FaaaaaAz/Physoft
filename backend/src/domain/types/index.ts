// ============================================
// TYPES - Domain Layer
// ============================================
// Tipos y interfaces compartidos del dominio
// ============================================

// Comparison criteria for cohorts
export interface ComparisonCriteria {
  gender: string
  sport: string
  position?: string
  bodyType: string
  heightMin: number
  heightMax: number
  weightMin: number
  weightMax: number
  ageMin: number
  ageMax: number
}

// Comparison result
export interface ComparisonResult {
  overallStatus: 'Low' | 'Average' | 'High'
  weakPoints: string[]
  absoluteImprovement: number
  percentualImprovement: number
  athletesCompared: number
}

// Comparison rules based on age
export function getComparisonRules(age: number): {
  heightTolerance: number
  weightTolerance: number
  ageTolerance: number
} {
  if (age >= 17) {
    return {
      heightTolerance: 7,  // ±7 cm
      weightTolerance: 20,   // ±20 lbs
      ageTolerance: 3,    // ±3 years
    }
  } else {
    return {
      heightTolerance: 5,  // ±5 cm
      weightTolerance: 15,   // ±15 lbs
      ageTolerance: 1,    // ±1 year
    }
  }
}
