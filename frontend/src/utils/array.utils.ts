/**
 * Paginación simple de arrays
 */
export const paginateArray = <T>(
  array: T[],
  page: number,
  itemsPerPage: number
): T[] => {
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  return array.slice(startIndex, endIndex)
}

/**
 * Calcula información de paginación
 */
export const getPaginationInfo = (
  totalItems: number,
  currentPage: number,
  itemsPerPage: number
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
  
  return {
    totalPages,
    startIndex,
    endIndex,
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages
  }
}

/**
 * Genera array de números de página para UI
 */
export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | string)[] => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = []
  const halfVisible = Math.floor(maxVisible / 2)
  
  // Siempre mostrar primera página
  pages.push(1)
  
  let start = Math.max(2, currentPage - halfVisible)
  let end = Math.min(totalPages - 1, currentPage + halfVisible)
  
  // Ajustar si estamos cerca del inicio
  if (currentPage <= halfVisible + 1) {
    end = Math.min(maxVisible - 1, totalPages - 1)
  }
  
  // Ajustar si estamos cerca del final
  if (currentPage >= totalPages - halfVisible) {
    start = Math.max(2, totalPages - maxVisible + 2)
  }
  
  // Agregar '...' si hay salto
  if (start > 2) {
    pages.push('...')
  }
  
  // Agregar páginas del medio
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  // Agregar '...' si hay salto
  if (end < totalPages - 1) {
    pages.push('...')
  }
  
  // Siempre mostrar última página
  if (totalPages > 1) {
    pages.push(totalPages)
  }
  
  return pages
}

/**
 * Ordena array por campo específico
 */
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal === bVal) return 0
    
    const comparison = aVal > bVal ? 1 : -1
    return order === 'asc' ? comparison : -comparison
  })
}

/**
 * Agrupa array por campo específico
 */
export const groupBy = <T>(
  array: T[],
  key: keyof T
): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key])
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(item)
    return groups
  }, {} as Record<string, T[]>)
}
