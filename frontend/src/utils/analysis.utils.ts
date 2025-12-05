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
      'Análisis de flexibilidad generado por IA: Se observa un rango de movimiento adecuado en las principales articulaciones. Flexión de cadera: 85°, extensión de rodilla: 30°, dorsiflexión de tobillo: 20°. Recomendación: mantener rutina de estiramiento dinámico.'
  }

  if (checkboxes.biobit) {
    analysis.analisisBiobit = 
      'Análisis Biobit generado por IA: Activación muscular simétrica detectada en un 92%. Patrón de disparo óptimo en cuádriceps y glúteos. Se detecta un retraso menor de 12ms en tibial anterior izquierdo.'
  }

  if (checkboxes.asimetria) {
    analysis.asimetriaMuscular = 
      'Análisis de asimetría muscular generado por IA: Dominancia de pierna derecha evidente con 8% mayor amplitud EMG. Complejo aductor izquierdo muestra 15% menos activación durante movimientos laterales.'
  }

  if (checkboxes.controlMotor) {
    analysis.controlMotorActivo = 
      'Análisis de control motor generado por IA: Respuesta propioceptiva superior. Test de equilibrio monopodal: 45s ojos abiertos, 28s ojos cerrados. Estabilidad del core en percentil 95.'
  }

  if (checkboxes.fatiga) {
    analysis.fatigaMuscular = 
      'Análisis de fatiga muscular generado por IA: Índice de fatiga al 18% después del protocolo de 30min. Declive moderado en potencia explosiva (-12%) en series finales. Tiempo de recuperación recomendado: 48-52 horas.'
  }

  if (checkboxes.fuerzaInercia) {
    analysis.controlFuerzaInercia = 
      'Análisis de control de fuerza e inercia generado por IA: Mecánica de desaceleración excepcional. Fuerzas de reacción del suelo bien distribuidas. Ratio de fuerza excéntrica: 1.15 (rango óptimo).'
  }

  return analysis
}
