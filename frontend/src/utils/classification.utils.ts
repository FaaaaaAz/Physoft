/**
 * Utilidades para clasificaciones y badges
 */

import { CLASIFICACION_LABELS } from './constants'

/**
 * Obtiene la clase CSS para el badge de clasificación
 */
export function getBadgeClass(clasificacion: string | null | undefined): string {
  if (clasificacion === 'high') return 'badge-encima'
  if (clasificacion === 'medium') return 'badge-promedio'
  if (clasificacion === 'low') return 'badge-debajo'
  return 'badge-promedio'
}

/**
 * Obtiene el label legible para una clasificación
 */
export function getClassificationLabel(clasificacion: string | null | undefined): string {
  if (!clasificacion) return 'Sin clasificar'
  return CLASIFICACION_LABELS[clasificacion as keyof typeof CLASIFICACION_LABELS] || 'Sin clasificar'
}

/**
 * Obtiene el valor numérico para ordenamiento de clasificaciones
 */
export function getClassificationOrder(clasificacion: string | null | undefined): number {
  const orden: Record<string, number> = {
    'high': 3,
    'medium': 2,
    'low': 1
  }
  return orden[clasificacion || 'medium'] || 2
}
