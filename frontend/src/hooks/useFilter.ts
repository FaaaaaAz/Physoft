import { useState, useMemo } from 'react'

interface UseFilterReturn<T, F> {
  filteredData: T[]
  filters: F
  setFilter: <K extends keyof F>(key: K, value: F[K]) => void
  setFilters: (filters: Partial<F>) => void
  resetFilters: () => void
  clearFilter: (key: keyof F) => void
}

/**
 * Hook genérico para gestionar filtros de datos
 * Usado en: Dashboard, TodosAnalisis
 */
export function useFilter<T, F extends Record<string, any>>(
  data: T[],
  initialFilters: F,
  filterFunction: (item: T, filters: F) => boolean
): UseFilterReturn<T, F> {
  const [filters, setFiltersState] = useState<F>(initialFilters)

  const filteredData = useMemo(() => {
    return data.filter(item => filterFunction(item, filters))
  }, [data, filters, filterFunction])

  const setFilter = <K extends keyof F>(key: K, value: F[K]) => {
    setFiltersState(prev => ({ ...prev, [key]: value }))
  }

  const setFilters = (newFilters: Partial<F>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFiltersState(initialFilters)
  }

  const clearFilter = (key: keyof F) => {
    setFiltersState(prev => ({ ...prev, [key]: initialFilters[key] }))
  }

  return {
    filteredData,
    filters,
    setFilter,
    setFilters,
    resetFilters,
    clearFilter
  }
}
