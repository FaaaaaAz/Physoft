import axios from 'axios'

// Base Axios configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create configured axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Future: add authentication tokens here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (global error handling)
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      console.error('Server error:', error.response.status)
    } else if (error.request) {
      console.error('Network error: Could not connect to server')
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// ============================================
// ATHLETE API
// ============================================

export interface Athlete {
  id: string  // UUID
  accessCode: string
  photo?: string | null
  cloudinaryPublicId?: string | null
  name: string
  gender: string
  birthDate?: string | null
  nationality?: string | null
  sport: string
  club?: string | null
  position?: string | null
  bodyType: string
  height: number
  weight: number
  email?: string | null
  phone?: string | null
  syncedAt: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  deviceId?: string | null
}

export interface CreateAthleteDTO {
  photo?: File | null
  name: string
  gender: string
  birthDate?: string
  nationality?: string
  sport: string
  club?: string
  position?: string
  bodyType: string
  height: number
  weight: number
  email?: string
  phone?: string
  deviceId?: string
}

export interface AthleteFilters {
  name?: string
  gender?: string
  sport?: string
  bodyType?: string
  nationality?: string
}

export const athleteAPI = {
  // Get all athletes with optional filters
  getAll: async (filters?: AthleteFilters) => {
    const params = new URLSearchParams()
    if (filters?.name) params.append('name', filters.name)
    if (filters?.gender) params.append('gender', filters.gender)
    if (filters?.sport) params.append('sport', filters.sport)
    if (filters?.bodyType) params.append('bodyType', filters.bodyType)
    if (filters?.nationality) params.append('nationality', filters.nationality)

    const response = await apiClient.get<{ success: boolean; data: Athlete[]; total: number }>(
      `/athletes?${params.toString()}`
    )
    return response.data
  },

  // Get athlete by ID
  getById: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: Athlete }>(
      `/athletes/${id}`
    )
    return response.data
  },

  // Create new athlete with photo
  create: async (athlete: CreateAthleteDTO) => {
    const formData = new FormData()

    // Append all fields
    formData.append('name', athlete.name)
    formData.append('gender', athlete.gender)
    formData.append('sport', athlete.sport)
    formData.append('bodyType', athlete.bodyType)
    formData.append('height', athlete.height.toString())
    formData.append('weight', athlete.weight.toString())

    // Optional fields
    if (athlete.birthDate) formData.append('birthDate', athlete.birthDate)
    if (athlete.nationality) formData.append('nationality', athlete.nationality)
    if (athlete.club) formData.append('club', athlete.club)
    if (athlete.position) formData.append('position', athlete.position)
    if (athlete.email) formData.append('email', athlete.email)
    if (athlete.phone) formData.append('phone', athlete.phone)
    if (athlete.deviceId) formData.append('deviceId', athlete.deviceId)

    // Append photo if present
    if (athlete.photo) {
      formData.append('photo', athlete.photo)
    }

    const response = await apiClient.post<{ success: boolean; data: Athlete; message: string }>(
      '/athletes',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  // Update athlete
  update: async (id: string, athlete: Partial<CreateAthleteDTO>) => {
    const response = await apiClient.put<{ success: boolean; data: Athlete; message: string }>(
      `/athletes/${id}`,
      athlete
    )
    return response.data
  },

  // Upload or update athlete photo
  uploadPhoto: async (id: string, photo: File) => {
    const formData = new FormData()
    formData.append('photo', photo)

    const response = await apiClient.post<{
      success: boolean
      data: Athlete
      message: string
      cloudinaryStatus?: 'uploaded' | 'offline_mode'
    }>(
      `/athletes/${id}/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  // Delete athlete
  delete: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/athletes/${id}`
    )
    return response.data
  },

  // Get statistics
  getStatistics: async () => {
    const response = await apiClient.get('/athletes/statistics/summary')
    return response.data
  },

  // Compare athlete with cohort
  compare: async (id: string) => {
    const response = await apiClient.get(`/atletas/${id}/comparar`)
    return response.data
  }
}

// Helper function to get full photo URL
export function getPhotoUrl(photo: string | null | undefined): string {
  if (!photo) return ''  // No default photo

  // If it's a full URL (Cloudinary), return as is
  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo
  }

  // For local files, prepend the backend base URL (without /api)
  const baseUrl = API_URL.replace('/api', '')
  return `${baseUrl}${photo}`
}

// ============================================
// ANALYSIS API
// ============================================

export interface Analysis {
  id: number
  athleteId: string
  analysisDate: string
  analysisType: string
  dataJson: string
  overallStatus?: string | null
  weakPoint1?: string | null
  weakPoint2?: string | null
  weakPoint3?: string | null
  improvementMargin?: number | null
  createdAt: string
  updatedAt: string
}

export interface CreateAnalysisDTO {
  athleteId: string
  analysisType: string
  dataJson: any
  overallStatus?: string
  weakPoint1?: string
  weakPoint2?: string
  weakPoint3?: string
  improvementMargin?: number
}

export const analysisAPI = {
  // Get all analyses with optional filters
  getAll: async (filters?: { athleteId?: string; analysisType?: string; fechaDesde?: string; fechaHasta?: string }) => {
    const params = new URLSearchParams()
    if (filters?.athleteId) params.append('athleteId', filters.athleteId)
    if (filters?.analysisType) params.append('analysisType', filters.analysisType)
    if (filters?.fechaDesde) params.append('fechaDesde', filters.fechaDesde)
    if (filters?.fechaHasta) params.append('fechaHasta', filters.fechaHasta)

    const response = await apiClient.get(`/analisis?${params.toString()}`)
    return response.data
  },

  // Get analysis by ID
  getById: async (id: number) => {
    const response = await apiClient.get(`/analisis/${id}`)
    return response.data
  },

  // Get analyses by athlete ID
  getByAthleteId: async (athleteId: string) => {
    const response = await apiClient.get(`/analisis/atleta/${athleteId}`)
    return response.data
  },

  // Create new analysis
  create: async (analysis: CreateAnalysisDTO) => {
    const dataToSend = {
      ...analysis,
      dataJson: typeof analysis.dataJson === 'string'
        ? analysis.dataJson
        : JSON.stringify(analysis.dataJson)
    }
    const response = await apiClient.post('/analisis', dataToSend)
    return response.data
  },

  // Update analysis
  update: async (id: number, analysis: Partial<CreateAnalysisDTO>) => {
    const dataToSend = analysis.dataJson
      ? {
        ...analysis,
        dataJson: typeof analysis.dataJson === 'string'
          ? analysis.dataJson
          : JSON.stringify(analysis.dataJson)
      }
      : analysis
    const response = await apiClient.put(`/analisis/${id}`, dataToSend)
    return response.data
  },

  // Delete analysis
  delete: async (id: number) => {
    const response = await apiClient.delete(`/analisis/${id}`)
    return response.data
  },

  // Get statistics
  getStatistics: async () => {
    const response = await apiClient.get('/analisis/estadisticas/resumen')
    return response.data
  }
}

export default apiClient
