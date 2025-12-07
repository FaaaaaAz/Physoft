import { useState, useCallback } from 'react'

export type SortDirection = 'asc' | 'desc'

interface UseSortReturn<T> {
  sortField: T
  sortDirection: SortDirection
  handleSort: (field: T) => void
  resetSort: () => void
}

/**
 * Hook for managing table sorting
 * @param initialField - Initial field to sort by
 * @param initialDirection - Initial sort direction (default: 'asc')
 * @returns Sort state and handlers
 */
export function useSort<T extends string>(
  initialField: T,
  initialDirection: SortDirection = 'asc'
): UseSortReturn<T> {
  const [sortField, setSortField] = useState<T>(initialField)
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialDirection)

  const handleSort = useCallback((field: T) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, reset to ascending
      setSortField(field)
      setSortDirection('asc')
    }
  }, [sortField])

  const resetSort = useCallback(() => {
    setSortField(initialField)
    setSortDirection(initialDirection)
  }, [initialField, initialDirection])

  return {
    sortField,
    sortDirection,
    handleSort,
    resetSort
  }
}
