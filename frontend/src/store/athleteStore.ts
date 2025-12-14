import { create } from 'zustand'
import { athleteAPI, Athlete } from '../services/api'

interface AthleteStore {
    athletes: Athlete[]
    loading: boolean
    error: string | null

    // Actions
    fetchAthletes: () => Promise<void>
    addAthlete: (athlete: Athlete) => void
    updateAthlete: (id: string, athlete: Athlete) => void
    deleteAthlete: (id: string) => void
    getAthleteById: (id: string) => Athlete | undefined
}

export const useAthleteStore = create<AthleteStore>((set, get) => ({
    athletes: [],
    loading: false,
    error: null,

    fetchAthletes: async () => {
        set({ loading: true, error: null })
        try {
            const response = await athleteAPI.getAll()
            set({ athletes: response.data, loading: false })
        } catch (error: any) {
            set({ error: error.message, loading: false })
        }
    },

    addAthlete: (athlete: Athlete) => {
        set((state) => ({
            athletes: [...state.athletes, athlete]
        }))
    },

    updateAthlete: (id: string, updatedAthlete: Athlete) => {
        set((state) => ({
            athletes: state.athletes.map((a) =>
                a.id === id ? updatedAthlete : a
            )
        }))
    },

    deleteAthlete: (id: string) => {
        set((state) => ({
            athletes: state.athletes.filter((a) => a.id !== id)
        }))
    },

    getAthleteById: (id: string) => {
        return get().athletes.find((a) => a.id === id)
    }
}))
