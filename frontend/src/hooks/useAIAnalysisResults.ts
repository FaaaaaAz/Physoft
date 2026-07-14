import { useEffect, useState } from 'react'
import { analysisAPI, type AIAnalysisResult } from '@/services/api'
import { useAnalysisStore } from '@/store/analysisStore'

export interface UseAIAnalysisResultsReturn {
  results: AIAnalysisResult[]
  saveEdit: (id: string, newText: string) => Promise<void>
}

/**
 * Shared inline-edit logic for persisted Textual Analysis AI results.
 * Used by AnalysisView (read + edit) and EditAnalysis (read + edit).
 */
export function useAIAnalysisResults(analysisId: number, initial: AIAnalysisResult[]): UseAIAnalysisResultsReturn {
  const [results, setResults] = useState<AIAnalysisResult[]>(initial)
  const { updateAnalysis } = useAnalysisStore()

  // `initial` arrives asynchronously (the analysis loads after mount), so
  // re-sync once real data shows up rather than relying on useState's
  // mount-only initializer.
  useEffect(() => {
    setResults(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analysisId, initial])

  const saveEdit = async (id: string, newText: string) => {
    const updated = results.map(r =>
      r.id === id
        ? { ...r, aiResponse: newText, edited: true, editedAt: new Date().toISOString() }
        : r
    )

    const response = await analysisAPI.update(analysisId, { aiAnalysisResults: updated })
    setResults(updated)
    updateAnalysis(analysisId, response.data)
  }

  return { results, saveEdit }
}
