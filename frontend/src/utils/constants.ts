/**
 * Constantes centralizadas de la aplicación
 */

// Disciplinas deportivas
export const DISCIPLINAS = [
  'Soccer',
  'Basketball',
  'Rugby',
  'Athletics',
  'Tennis',
  'Handball',
  'Volleyball',
  'Swimming',
  'Other'
] as const

// Somatotipos
export const SOMATOTIPOS = [
  'Ectomorph',
  'Mesomorph',
  'Endomorph',
  'Undefined'
] as const

// Géneros
export const GENEROS = [
  'Male',
  'Female',
  'Other'
] as const

// Clasificaciones globales
export const CLASIFICACIONES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
} as const

export const CLASIFICACION_LABELS = {
  high: 'Above Average',
  medium: 'Average',
  low: 'Below Average'
} as const

// Herramientas de análisis
export const HERRAMIENTAS_ANALISIS = [
  'BTS / FreeEMG',
  'G-Walk',
  'BioBit / Balance',
  'Wyscout',
  'Others'
] as const

// Lados de apoyo
export const LADOS_APOYO = [
  'Right',
  'Left',
  'Undetermined'
] as const

// Paginación
export const ITEMS_PER_PAGE = 10

// Debounce delay para búsquedas (ms)
export const SEARCH_DEBOUNCE_DELAY = 300
