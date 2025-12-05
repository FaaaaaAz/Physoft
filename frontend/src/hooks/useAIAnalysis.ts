import { useState } from 'react'
import { 
  hasSelectedAnalysis, 
  generateSimulatedAIAnalysis 
} from '../utils/analysis.utils'

interface AnalysisCheckboxes {
  flexibilidad: boolean
  biobit: boolean
  asimetria: boolean
  controlMotor: boolean
  fatiga: boolean
  fuerzaInercia: boolean
}

interface UseAIAnalysisReturn {
  aiProcessing: boolean
  aiProgress: number
  usedAI: boolean
  generateAIAnalysis: (
    checkboxes: AnalysisCheckboxes,
    hasImages: boolean,
    isOnline: boolean,
    onSuccess: (analysis: Record<string, string>) => void,
    onError: (message: string) => void
  ) => void
  resetAI: () => void
}

/**
 * Hook para gestionar generación de análisis con IA
 * Usado en: NuevoAnalisis.tsx
 */
export function useAIAnalysis(): UseAIAnalysisReturn {
  const [aiProcessing, setAiProcessing] = useState(false)
  const [aiProgress, setAiProgress] = useState(0)
  const [usedAI, setUsedAI] = useState(false)

  const generateAIAnalysis = (
    checkboxes: AnalysisCheckboxes,
    hasImages: boolean,
    isOnline: boolean,
    onSuccess: (analysis: Record<string, string>) => void,
    onError: (message: string) => void
  ) => {
    // Validaciones
    if (!isOnline) {
      onError('No hay conexión a internet. Usa el modo manual o conéctate para usar IA.')
      return
    }

    if (!hasSelectedAnalysis(checkboxes)) {
      onError('Selecciona al menos un tipo de análisis para generar')
      return
    }

    if (!hasImages) {
      onError('Debes subir al menos una imagen para el análisis de IA')
      return
    }

    // Iniciar procesamiento
    setAiProcessing(true)
    setAiProgress(0)

    // Simular progreso
    const interval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    // Simular tiempo de procesamiento
    setTimeout(() => {
      clearInterval(interval)
      setAiProgress(100)

      const simulatedAnalysis = generateSimulatedAIAnalysis(checkboxes)
      
      setUsedAI(true)
      setAiProcessing(false)
      onSuccess(simulatedAnalysis)
    }, 3500)
  }

  const resetAI = () => {
    setAiProgress(0)
    setUsedAI(false)
  }

  return {
    aiProcessing,
    aiProgress,
    usedAI,
    generateAIAnalysis,
    resetAI
  }
}
