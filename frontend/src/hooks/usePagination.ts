import { useState, useCallback, useMemo } from 'react'
import { getPaginationInfo, generatePageNumbers } from '../utils/array.utils'

interface UsePaginationReturn<T> {
  currentPage: number
  totalPages: number
  paginatedData: T[]
  goToPage: (page: number) => void
  nextPage: () => void
  previousPage: () => void
  goToFirstPage: () => void
  goToLastPage: () => void
  paginationInfo: ReturnType<typeof getPaginationInfo>
  pageNumbers: (number | string)[]
}

/**
 * Hook para gestionar paginación de datos
 * Usado en: TodosAnalisis.tsx, Dashboard (si se implementa paginación)
 */
export function usePagination<T>(
  data: T[],
  itemsPerPage: number = 10
): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1)

  const paginationInfo = useMemo(
    () => getPaginationInfo(data.length, currentPage, itemsPerPage),
    [data.length, currentPage, itemsPerPage]
  )

  const paginatedData = useMemo(() => {
    return data.slice(paginationInfo.startIndex, paginationInfo.endIndex)
  }, [data, paginationInfo.startIndex, paginationInfo.endIndex])

  const pageNumbers = useMemo(
    () => generatePageNumbers(currentPage, paginationInfo.totalPages),
    [currentPage, paginationInfo.totalPages]
  )

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, paginationInfo.totalPages))
    setCurrentPage(validPage)
  }, [paginationInfo.totalPages])

  const nextPage = useCallback(() => {
    if (paginationInfo.hasNext) {
      setCurrentPage(prev => prev + 1)
    }
  }, [paginationInfo.hasNext])

  const previousPage = useCallback(() => {
    if (paginationInfo.hasPrevious) {
      setCurrentPage(prev => prev - 1)
    }
  }, [paginationInfo.hasPrevious])

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const goToLastPage = useCallback(() => {
    setCurrentPage(paginationInfo.totalPages)
  }, [paginationInfo.totalPages])

  return {
    currentPage,
    totalPages: paginationInfo.totalPages,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    paginationInfo,
    pageNumbers
  }
}
