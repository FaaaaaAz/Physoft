// ============================================
// TYPES: Athlete related types
// ============================================

export interface Athlete {
    id: string  // UUID from API
    name: string
    gender: string
    birthDate: string | null
    nationality: string | null
    sport: string
    club: string | null
    position: string | null
    bodyType: string
    height: number
    weight: number
    email: string | null
    phone: string | null
    photo: string | null
    cloudinaryPublicId: string | null
    accessCode: string
    createdAt: string
    updatedAt: string
}

export interface AthleteFormData {
    name: string
    gender: string
    birthDate: string
    nationality: string
    sport: string
    club: string
    position: string
    bodyType: string
    patientType?: string
    height: number
    weight: number
    email: string
    phone: string
}

export interface AthleteDisplay {
    id: string
    name: string
    photo: string
    sport: string
    age: number
    nationality: string
    height?: number
    weight?: number
    club: string
    bodyType?: string
    accessCode?: string
    capacities: PhysicalCapacities
}

export interface PhysicalCapacities {
    power: number
    strength: number
    speed: number
    flexibility: number
    endurance: number
}

export interface CreateAthleteDTO {
    name: string
    gender: string
    birthDate?: string
    nationality?: string
    sport: string
    club?: string
    position?: string
    bodyType: string
    patientType?: string
    height: number
    weight: number
    email?: string
    phone?: string
}
