import { useState } from 'react'

export interface WeakPoint {
  id: number
  texto: string
}

interface UseWeakPointsReturn {
  weakPoints: WeakPoint[]
  addWeakPoint: () => void
  removeWeakPoint: (id: number) => void
  updateWeakPoint: (id: number, value: string) => void
  clearWeakPoints: () => void
  setWeakPoints: (points: WeakPoint[]) => void
}

/**
 * Hook para gestionar lista de puntos débiles
 * Usado en: NuevoAnalisis.tsx, FormularioAnalisis.tsx
 */
export function useWeakPoints(initialPoints: WeakPoint[] = []): UseWeakPointsReturn {
  const [weakPoints, setWeakPointsState] = useState<WeakPoint[]>(initialPoints)
  const [nextId, setNextId] = useState(1)

  const addWeakPoint = () => {
    const newPoint: WeakPoint = {
      id: nextId,
      texto: ''
    }
    setWeakPointsState(prev => [...prev, newPoint])
    setNextId(prev => prev + 1)
  }

  const removeWeakPoint = (id: number) => {
    setWeakPointsState(prev => prev.filter(point => point.id !== id))
  }

  const updateWeakPoint = (id: number, value: string) => {
    setWeakPointsState(prev =>
      prev.map(point => (point.id === id ? { ...point, texto: value } : point))
    )
  }

  const clearWeakPoints = () => {
    setWeakPointsState([])
  }

  const setWeakPoints = (points: WeakPoint[]) => {
    setWeakPointsState(points)
    if (points.length > 0) {
      const maxId = Math.max(...points.map(p => p.id))
      setNextId(maxId + 1)
    }
  }

  return {
    weakPoints,
    addWeakPoint,
    removeWeakPoint,
    updateWeakPoint,
    clearWeakPoints,
    setWeakPoints
  }
}
