/**
 * Parsea puntos débiles de string JSON a array
 */
export const parseWeakPoints = (weakPoints: string | null | undefined): string[] => {
  if (!weakPoints) return []
  try {
    return JSON.parse(weakPoints)
  } catch {
    return []
  }
}

/**
 * Formatea capacidades físicas para envío al backend
 */
export const formatCapacitiesForSubmit = (capacities: {
  potencia: number
  resistencia: number
  fuerza: number
  flexibilidad: number
  velocidad: number
}) => {
  return {
    power: capacities.potencia,
    endurance: capacities.resistencia,
    strength: capacities.fuerza,
    flexibility: capacities.flexibilidad,
    speed: capacities.velocidad
  }
}

/**
 * Formatea puntos débiles para envío al backend
 */
export const formatWeakPointsForSubmit = (
  weakPoints: Array<{ id: number; texto: string }>
): string => {
  const filtered = weakPoints
    .filter(point => point.texto.trim() !== '')
    .map(point => point.texto.trim())
  
  return JSON.stringify(filtered)
}

/**
 * Calcula promedio de capacidades físicas
 */
export const calculateCapacitiesAverage = (capacities: {
  potencia: number
  resistencia: number
  fuerza: number
  flexibilidad: number
  velocidad: number
}): number => {
  const values = Object.values(capacities)
  const sum = values.reduce((acc, val) => acc + val, 0)
  return Math.round(sum / values.length)
}

/**
 * Determina clasificación basada en promedio de capacidades
 */
export const determineClassification = (average: number): 'high' | 'average' | 'low' => {
  if (average >= 70) return 'high'
  if (average >= 40) return 'average'
  return 'low'
}

/**
 * Valida que al menos un checkbox de análisis esté seleccionado
 */
export const hasSelectedAnalysis = (checkboxes: {
  flexibilidad: boolean
  biobit: boolean
  asimetria: boolean
  controlMotor: boolean
  fatiga: boolean
  fuerzaInercia: boolean
}): boolean => {
  return Object.values(checkboxes).some(val => val)
}

/**
 * Genera análisis simulado por IA basado en checkboxes seleccionados
 */
export const generateSimulatedAIAnalysis = (checkboxes: {
  flexibilidad: boolean
  biobit: boolean
  asimetria: boolean
  controlMotor: boolean
  fatiga: boolean
  fuerzaInercia: boolean
}) => {
  const analysis: Record<string, string> = {}

  if (checkboxes.flexibilidad) {
    analysis.analisisFlexibilidad = 
      'AI-generated flexibility analysis: Observed adequate range of motion in major joints. Hip flexion: 85°, knee extension: 30°, ankle dorsiflexion: 20°. Recommendation: maintain a dynamic stretching routine.'
  }

  if (checkboxes.biobit) {
    analysis.analisisBiobit = 
      'AI-generated Biobit analysis: Muscle activation symmetry detected at 92%. Optimal firing pattern in quadriceps and glutes. Minor delay (~12ms) detected in the left tibialis anterior.'
  }

  if (checkboxes.asimetria) {
    analysis.asimetriaMuscular = 
      'AI-generated muscular asymmetry analysis: Right leg dominance evident with 8% higher EMG amplitude. Left adductor complex shows ~15% less activation during lateral movements.'
  }

  if (checkboxes.controlMotor) {
    analysis.controlMotorActivo = 
      'AI-generated motor control analysis: Superior proprioceptive response. Single-leg balance test: 45s eyes open, 28s eyes closed. Core stability in the 95th percentile.'
  }

  if (checkboxes.fatiga) {
    analysis.fatigaMuscular = 
      'AI-generated muscle fatigue analysis: Fatigue index at 18% after a 30-minute protocol. Moderate decline in explosive power (-12%) in final sets. Recommended recovery time: 48-52 hours.'
  }

  if (checkboxes.fuerzaInercia) {
    analysis.controlFuerzaInercia = 
      'AI-generated inertial force control analysis: Excellent deceleration mechanics. Ground reaction forces well distributed. Eccentric force ratio: 1.15 (optimal range).'
  }

  return analysis
}
