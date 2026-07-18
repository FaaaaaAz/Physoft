// ============================================
// MOCK DATA: Main Charts (Cards 2, 3, 4, 6, 7)
// ============================================
// UI-only placeholder data. Card 1 (Radar) reuses mockCapacityProfile.ts;
// Card 5 (Load Distribution) is just an image, no data needed here.
// Aggregate figures (average symmetry, overall ROM average) are stored as
// plain mock values rather than computed from the row arrays, to keep
// every number in this file a static placeholder with zero logic.
// ============================================

// --- Card 2: Cohort Comparison ---
export interface CohortComparisonPoint {
    label: string
    patient: number
    cohortAverage: number
}

export const cohortComparisonMock: CohortComparisonPoint[] = [
    { label: 'Strength', patient: 68, cohortAverage: 60 },
    { label: 'Power', patient: 72, cohortAverage: 63 },
    { label: 'Speed', patient: 69, cohortAverage: 65 },
    { label: 'Endurance', patient: 64, cohortAverage: 61 },
    { label: 'Flexibility', patient: 48, cohortAverage: 58 }
]

// --- Card 3: Progress Over Time ---
export interface ProgressPoint {
    month: string
    strength: number
    power: number
    flexibility: number
}

export const progressOverTimeMock: ProgressPoint[] = [
    { month: 'Feb', strength: 58, power: 61, flexibility: 42 },
    { month: 'Mar', strength: 60, power: 64, flexibility: 43 },
    { month: 'Apr', strength: 62, power: 66, flexibility: 45 },
    { month: 'May', strength: 64, power: 68, flexibility: 44 },
    { month: 'Jun', strength: 66, power: 70, flexibility: 46 },
    { month: 'Jul', strength: 68, power: 72, flexibility: 48 }
]

// --- Card 4: Muscular Balance (EMG) ---
export interface MuscleBalanceItem {
    muscle: string
    symmetryPercent: number
}

export interface MuscularBalanceData {
    muscles: MuscleBalanceItem[]
    averageSymmetry: number
}

export const muscularBalanceMock: MuscularBalanceData = {
    muscles: [
        { muscle: 'Quadriceps', symmetryPercent: 94 },
        { muscle: 'Hamstrings', symmetryPercent: 87 },
        { muscle: 'Glutes', symmetryPercent: 91 },
        { muscle: 'Calves', symmetryPercent: 96 },
        { muscle: 'Spinal Erectors', symmetryPercent: 83 },
        { muscle: 'Deltoids', symmetryPercent: 90 }
    ],
    averageSymmetry: 90
}

// --- Card 6: Range of Motion Analysis ---
export interface RomRow {
    movement: string
    currentRom: number
    idealRom: number
    percentage: number
}

export interface RangeOfMotionData {
    rows: RomRow[]
    overallAverage: number
}

export const rangeOfMotionMock: RangeOfMotionData = {
    rows: [
        { movement: 'Hip Flexion', currentRom: 108, idealRom: 120, percentage: 90 },
        { movement: 'Hip Extension', currentRom: 18, idealRom: 20, percentage: 90 },
        { movement: 'Shoulder Flexion', currentRom: 165, idealRom: 180, percentage: 92 },
        { movement: 'Thoracic Rotation', currentRom: 32, idealRom: 45, percentage: 71 },
        { movement: 'Ankle Dorsiflexion', currentRom: 9, idealRom: 15, percentage: 60 }
    ],
    overallAverage: 81
}

// --- Card 7: Body Composition (FREE) ---
export interface BodyCompositionData {
    bodyFatPercent: number
    muscleMassPercent: number
    waterPercent: number
    basalMetabolism: string
    classification: string
}

export const bodyCompositionMock: BodyCompositionData = {
    bodyFatPercent: 16,
    muscleMassPercent: 46,
    waterPercent: 38,
    basalMetabolism: '1,850 kcal/day',
    classification: 'Athletic'
}
