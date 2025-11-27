// ============================================
// ENTITY: Athlete - Domain Layer
// ============================================
// Represents the properties of an athlete
// ============================================

export interface Athlete {
  id: string  // UUID
  accessCode: string  // 5-digit access code
  photo?: string | null  // Photo URL (local or Cloudinary)
  cloudinaryPublicId?: string | null  // Cloudinary public ID
  name: string
  gender: string
  birthDate?: string | null  // Birth date
  nationality?: string | null  // Nationality
  sport: string
  club?: string | null  // Club or team
  position?: string | null
  bodyType: string
  height: number  // cm
  weight: number  // kg
  email?: string | null
  phone?: string | null
  syncedAt: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  deviceId?: string | null
}

// Types for creating a new athlete (without auto-generated fields)
export type CreateAthleteDTO = Omit<Athlete, 'id' | 'syncedAt' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'accessCode'>

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
