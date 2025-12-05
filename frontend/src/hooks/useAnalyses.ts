import { useState, useEffect, useCallback } from 'react'
import { analysisAPI, Analysis } from '../services/api'

interface UseAnalysesParams {
  athleteId?: string
  enabled?: boolean
}

interface UseAnalysesReturn {
  analyses: Analysis[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseAnalysisReturn {
  analysis: Analysis | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch analyses
 * @param {UseAnalysesParams} params - Optional athleteId filter and enabled flag
 * @returns {UseAnalysesReturn} Analyses data, loading state, error, and refetch function
 */
export const useAnalyses = ({ athleteId, enabled = true }: UseAnalysesParams = {}): UseAnalysesReturn => {
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState<boolean>(enabled)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalyses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await analysisAPI.getAll(athleteId ? { athleteId } : undefined)
      setAnalyses(response.data)
    } catch (err) {
      console.error('Error fetching analyses:', err)
      setError('Error al cargar los análisis')
    } finally {
      setLoading(false)
    }
  }, [athleteId])

  useEffect(() => {
    if (enabled) {
      fetchAnalyses()
    }
  }, [fetchAnalyses, enabled])

  return {
    analyses,
    loading,
    error,
    refetch: fetchAnalyses
  }
}

/**
 * Custom hook to fetch a single analysis by ID
 * @param {number} id - Analysis ID
 * @param {boolean} enabled - Whether to fetch automatically (default: true)
 * @returns {UseAnalysisReturn} Analysis data, loading state, error, and refetch function
 */
export const useAnalysis = (id: number | undefined, enabled = true): UseAnalysisReturn => {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [loading, setLoading] = useState<boolean>(enabled)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalysis = useCallback(async () => {
    if (!id) {
      setError('ID de análisis no proporcionado')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await analysisAPI.getById(id)
      setAnalysis(response.data)
    } catch (err) {
      console.error('Error fetching analysis:', err)
      setError('Error al cargar el análisis')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (enabled && id) {
      fetchAnalysis()
    }
  }, [fetchAnalysis, enabled, id])

  return {
    analysis,
    loading,
    error,
    refetch: fetchAnalysis
  }
}

/**
 * Custom hook to fetch athlete with their analyses
 * @param {string} athleteId - Athlete ID
 * @returns Combined athlete and analyses data
 */
export const useAthleteAnalyses = (athleteId: string | undefined) => {
  const { analyses, loading: analysesLoading, error: analysesError } = useAnalyses({ 
    athleteId, 
    enabled: !!athleteId 
  })

  return {
    analyses,
    loading: analysesLoading,
    error: analysesError,
    latestAnalysis: analyses[0] || null,
    totalAnalyses: analyses.length
  }
}
