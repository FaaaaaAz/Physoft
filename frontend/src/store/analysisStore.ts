import { create } from 'zustand'
import { analysisAPI, Analysis } from '../services/api'

interface AnalysisStore {
    analyses: Analysis[]
    loading: boolean
    error: string | null

    // Actions
    fetchAnalyses: () => Promise<void>
    fetchAnalysesByAthlete: (athleteId: string) => Promise<void>
    addAnalysis: (analysis: Analysis) => void
    updateAnalysis: (id: number, analysis: Analysis) => void
    deleteAnalysis: (id: number) => void
    getAnalysisById: (id: number) => Analysis | undefined
}

export const useAnalysisStore = create<AnalysisStore>((set, get) => ({
    analyses: [],
    loading: false,
    error: null,

    fetchAnalyses: async () => {
        set({ loading: true, error: null })
        try {
            const response = await analysisAPI.getAll()
            set({ analyses: response.data, loading: false })
        } catch (error: any) {
            set({ error: error.message, loading: false })
        }
    },

    fetchAnalysesByAthlete: async (athleteId: string) => {
        set({ loading: true, error: null })
        try {
            const response = await analysisAPI.getByAthleteId(athleteId)
            set({ analyses: response.data, loading: false })
        } catch (error: any) {
            set({ error: error.message, loading: false })
        }
    },

    addAnalysis: (analysis: Analysis) => {
        set((state) => ({
            analyses: [...state.analyses, analysis]
        }))
    },

    updateAnalysis: (id: number, updatedAnalysis: Analysis) => {
        set((state) => ({
            analyses: state.analyses.map((a) =>
                a.id === id ? updatedAnalysis : a
            )
        }))
    },

    deleteAnalysis: (id: number) => {
        set((state) => ({
            analyses: state.analyses.filter((a) => a.id !== id)
        }))
    },

    getAnalysisById: (id: number) => {
        return get().analyses.find((a) => a.id === id)
    }
}))
