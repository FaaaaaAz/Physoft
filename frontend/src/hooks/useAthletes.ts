import { useState, useEffect, useCallback } from 'react'
import { athleteAPI, Athlete } from '../services/api'

interface UseAthletesReturn {
  athletes: Athlete[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
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
      setError('Error al cargar los atletas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAthletes()
  }, [fetchAthletes])

  return {
    athletes,
    loading,
    error,
    refetch: fetchAthletes
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
      setError('ID de atleta no proporcionado')
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
      setError('Error al cargar el atleta')
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
