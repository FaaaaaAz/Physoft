// ============================================
// ENTITY: Athlete - Domain Layer
// ============================================
// Represents the properties of an athlete
// ============================================

export interface Athlete {
  id: number
  name: string
  gender: string
  sport: string
  position?: string | null
  bodyType: string
  height: number  // cm
  weight: number  // kg
  age: number
  createdAt: Date
  updatedAt: Date
}

// Types for creating a new athlete (without auto-generated fields)
export type CreateAthleteDTO = Omit<Athlete, 'id' | 'createdAt' | 'updatedAt'>

// Types for updating an athlete (optional fields)
export type UpdateAthleteDTO = Partial<CreateAthleteDTO>

// Allowed value types
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum BodyType {
  MESOMORPH = 'Mesomorph',
  ECTOMORPH = 'Ectomorph',
  ENDOMORPH = 'Endomorph',
}
