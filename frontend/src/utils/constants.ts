/**
 * Constantes centralizadas de la aplicación
 */

// Disciplinas deportivas
export const DISCIPLINAS = [
  'Fútbol',
  'Básquet',
  'Rugby',
  'Atletismo',
  'Tenis',
  'Handball',
  'Voleibol',
  'Natación',
  'Otro'
] as const

// Somatotipos
export const SOMATOTIPOS = [
  'Ectomorfo',
  'Mesomorfo',
  'Endomorfo',
  'No definido'
] as const

// Géneros
export const GENEROS = [
  'Masculino',
  'Femenino',
  'Otro'
] as const

// Clasificaciones globales
export const CLASIFICACIONES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const

export const CLASIFICACION_LABELS = {
  high: 'Encima del Promedio',
  medium: 'Promedio',
  low: 'Debajo del Promedio'
} as const

// Herramientas de análisis
export const HERRAMIENTAS_ANALISIS = [
  'BTS / FreeEMG',
  'G-Walk',
  'BioBit / Equilibrio',
  'Wyscout',
  'Otros'
] as const

// Lados de apoyo
export const LADOS_APOYO = [
  'Derecho',
  'Izquierdo',
  'Indeterminado'
] as const

// Paginación
export const ITEMS_PER_PAGE = 10

// Debounce delay para búsquedas (ms)
export const SEARCH_DEBOUNCE_DELAY = 300
