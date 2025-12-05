import { useState, useMemo } from 'react'
import { sortBy } from '../utils/array.utils'

export type SortOrder = 'asc' | 'desc'

interface UseSortReturn<T> {
  sortedData: T[]
  sortKey: keyof T | null
  sortOrder: SortOrder
  sortByKey: (key: keyof T) => void
  resetSort: () => void
}

/**
 * Hook para gestionar ordenamiento de datos
 * Usado en: TodosAnalisis.tsx, Dashboard
 */
export function useSort<T>(data: T[]): UseSortReturn<T> {
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')

  const sortedData = useMemo(() => {
    if (!sortKey) return data
    return sortBy(data, sortKey, sortOrder)
  }, [data, sortKey, sortOrder])

  const sortByKey = (key: keyof T) => {
    if (sortKey === key) {
      // Toggle order if same key
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      // New key, start with asc
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const resetSort = () => {
    setSortKey(null)
    setSortOrder('asc')
  }

  return {
    sortedData,
    sortKey,
    sortOrder,
    sortByKey,
    resetSort
  }
}
