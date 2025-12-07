// ============================================
// TYPES: Analysis related types
// ============================================

export interface Analysis {
    id: number
    athleteId: number
    analysisDate: string
    analysisType: string
    dataJson: string
    globalStatus: string | null
    weakPoint1: string | null
    weakPoint2: string | null
    weakPoint3: string | null
    improvementMargin: number | null
    createdAt: string
    updatedAt: string
}

// New Analysis Form Types
export interface WeakPoint {
    id: number
    text: string
}

export interface PhysicalCapacities {
    power: number
    endurance: number
    strength: number
    flexibility: number
    speed: number
}

export interface AnalysisCheckboxes {
    flexibility: boolean
    biobit: boolean
    asymmetry: boolean
    motorControl: boolean
    fatigue: boolean
    inertiaForce: boolean
}

export interface NewAnalysisFormData {
    athleteId: string
    evaluationDate: string
    images: File[]

    // Textual Analysis
    flexibilityAnalysis: string
    biobitAnalysis: string
    muscularAsymmetry: string
    activeMotorControl: string
    muscleFatigue: string
    inertiaForceControl: string

    // Conclusions
    weakPoints: WeakPoint[]
    physicalCapacities: PhysicalCapacities
    cohortClassification: string
    recommendations: string
}

// Legacy types (keep for compatibility)
export interface AnalysisFormData {
    athleteId: number
    analysisType: string
    sessionInfo: SessionInfo
    anthropometric: AnthropometricData
    consultReason: string
    kpis: KPIData
    textAnalysis: string
    conclusions: string
    files: File[]
}

export interface SessionInfo {
    date: string
    location: string
    duration: number
    evaluator: string
}

export interface AnthropometricData {
    height: number
    weight: number
    bmi: number
    bodyFat: number
    muscleMass: number
}

export interface KPIData {
    power: number
    strength: number
    speed: number
    flexibility: number
    endurance: number
}
