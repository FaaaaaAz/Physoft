/**
 * Utilidades para manejo de fechas
 */

/**
 * Calcula la edad a partir de una fecha de nacimiento
 */
export function calculateAge(birthDate: string | Date | null | undefined): number {
  if (!birthDate) return 0
  
  const birth = new Date(birthDate)
  const today = new Date()
  
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

/**
 * Formatea una fecha a formato locale español
 */
export function formatDate(date: string | Date | null | undefined, format: 'short' | 'long' = 'short'): string {
  if (!date) return 'N/A'
  
  const dateObj = new Date(date)
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  return dateObj.toLocaleDateString('es-ES')
}

/**
 * Formatea una fecha a formato mes/año para filtros
 */
export function formatMonthYear(date: string | Date): string {
  const dateObj = new Date(date)
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Verifica si dos fechas están en el mismo mes
 */
export function isSameMonth(date1: string | Date, date2: string | Date): boolean {
  return formatMonthYear(date1) === formatMonthYear(date2)
}
