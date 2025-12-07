import { useState, useEffect, useCallback } from 'react'
import { athleteAPI, Athlete, CreateAthleteDTO } from '../services/api'

interface UseAthletesReturn {
  athletes: Athlete[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  createAthlete: (data: CreateAthleteDTO) => Promise<any>
  updateAthlete: (id: string, data: Partial<CreateAthleteDTO>) => Promise<any>
  deleteAthlete: (id: string) => Promise<any>
}

interface UseAthleteReturn {
  athlete: Athlete | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Custom hook to fetch all athletes
 * @returns {UseAthletesReturn} Athletes data, loading state, error, and refetch function
 */
export const useAthletes = (): UseAthletesReturn => {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAthletes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await athleteAPI.getAll()
      setAthletes(response.data)
    } catch (err) {
      console.error('Error fetching athletes:', err)
      setError('Error loading athletes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAthletes()
  }, [fetchAthletes])

  const createAthlete = useCallback(async (data: CreateAthleteDTO) => {
    try {
      const response = await athleteAPI.create(data)
      await fetchAthletes() // Refresh list
      return response
    } catch (err) {
      console.error('Error creating athlete:', err)
      throw err
    }
  }, [fetchAthletes])

  const updateAthlete = useCallback(async (id: string, data: Partial<CreateAthleteDTO>) => {
    try {
      const response = await athleteAPI.update(id, data)
      await fetchAthletes() // Refresh list
      return response
    } catch (err) {
      console.error('Error updating athlete:', err)
      throw err
    }
  }, [fetchAthletes])

  const deleteAthlete = useCallback(async (id: string) => {
    try {
      const response = await athleteAPI.delete(id)
      await fetchAthletes() // Refresh list
      return response
    } catch (err) {
      console.error('Error deleting athlete:', err)
      throw err
    }
  }, [fetchAthletes])

  return {
    athletes,
    loading,
    error,
    refetch: fetchAthletes,
    createAthlete,
    updateAthlete,
    deleteAthlete
  }
}

/**
 * Custom hook to fetch a single athlete by ID
 * @param {string} id - Athlete ID
 * @param {boolean} enabled - Whether to fetch automatically (default: true)
 * @returns {UseAthleteReturn} Athlete data, loading state, error, and refetch function
 */
export const useAthlete = (id: string | undefined, enabled = true): UseAthleteReturn => {
  const [athlete, setAthlete] = useState<Athlete | null>(null)
  const [loading, setLoading] = useState<boolean>(enabled)
  const [error, setError] = useState<string | null>(null)

  const fetchAthlete = useCallback(async () => {
    if (!id) {
      setError('Athlete ID not provided')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await athleteAPI.getById(id)
      setAthlete(response.data)
    } catch (err) {
      console.error('Error fetching athlete:', err)
      setError('Error loading athlete')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (enabled && id) {
      fetchAthlete()
    }
  }, [fetchAthlete, enabled, id])

  return {
    athlete,
    loading,
    error,
    refetch: fetchAthlete
  }
}
