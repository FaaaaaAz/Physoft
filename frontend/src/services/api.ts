import axios from 'axios'

// Base Axios configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create configured axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor (optional - to add tokens in the future)
apiClient.interceptors.request.use(
  (config) => {
    // Here you can add logic for authentication tokens
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
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
    // Global error handling
    if (error.response) {
      // Server responded with error code
      console.error('Server error:', error.response.status)
    } else if (error.request) {
      // Request was made but no response
      console.error('Network error: Could not connect to server')
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// ============================================
// ATHLETE API
// ============================================

export interface Athlete {
  id: number
  name: string
  gender: string
  sport: string
  position?: string | null
  bodyType: string
  height: number
  weight: number
  age: number
  photo?: string | null
  cloudinaryPublicId?: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateAthleteDTO {
  name: string
  gender: string
  sport: string
  position?: string
  bodyType: string
  height: number
  weight: number
  age: number
}

export interface AthleteFilters {
  name?: string
  gender?: string
  sport?: string
  bodyType?: string
  ageMin?: number
  ageMax?: number
}

export const athleteAPI = {
  // Get all athletes with optional filters
  getAll: async (filters?: AthleteFilters) => {
    const params = new URLSearchParams()
    if (filters?.name) params.append('name', filters.name)
    if (filters?.gender) params.append('gender', filters.gender)
    if (filters?.sport) params.append('sport', filters.sport)
    if (filters?.bodyType) params.append('bodyType', filters.bodyType)
    if (filters?.ageMin) params.append('ageMin', filters.ageMin.toString())
    if (filters?.ageMax) params.append('ageMax', filters.ageMax.toString())

    const response = await apiClient.get<{ success: boolean; data: Athlete[]; total: number }>(
      `/athletes?${params.toString()}`
    )
    return response.data
  },

  // Get athlete by ID
  getById: async (id: number) => {
    const response = await apiClient.get<{ success: boolean; data: Athlete }>(
      `/athletes/${id}`
    )
    return response.data
  },

  // Create new athlete
  create: async (athlete: CreateAthleteDTO) => {
    const response = await apiClient.post<{ success: boolean; data: Athlete; message: string }>(
      '/athletes',
      athlete
    )
    return response.data
  },

  // Update athlete
  update: async (id: number, athlete: Partial<CreateAthleteDTO>) => {
    const response = await apiClient.put<{ success: boolean; data: Athlete; message: string }>(
      `/athletes/${id}`,
      athlete
    )
    return response.data
  },

  // Delete athlete
  delete: async (id: number) => {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `/athletes/${id}`
    )
    return response.data
  },

  // Upload athlete photo
  uploadPhoto: async (id: number, file: File) => {
    const formData = new FormData()
    formData.append('photo', file)

    const response = await apiClient.post<{
      success: boolean
      data: Athlete
      message: string
      cloudinaryStatus: 'uploaded' | 'offline_mode'
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

  // Get statistics
  getStatistics: async () => {
    const response = await apiClient.get('/athletes/statistics/summary')
    return response.data
  },

  // Compare athlete with cohort
  compare: async (id: number) => {
    const response = await apiClient.get(`/athletes/${id}/compare`)
    return response.data
  }
}

// ============================================
// ANALYSIS API
// ============================================

export interface Analysis {
  id: number
  atletaId: number
  fechaAnalisis: string
  tipoAnalisis: string
  datosJson: string
  estadoGeneral?: string | null
  puntoDebil1?: string | null
  puntoDebil2?: string | null
  puntoDebil3?: string | null
  margenMejora?: number | null
  createdAt: string
  updatedAt: string
}

export interface CreateAnalysisDTO {
  atletaId: number
  tipoAnalisis: string
  datosJson: any // Will be stringified
  estadoGeneral?: string
  puntoDebil1?: string
  puntoDebil2?: string
  puntoDebil3?: string
  margenMejora?: number
}

export const analysisAPI = {
  // Get all analyses with optional filters
  getAll: async (filters?: { atletaId?: number; tipoAnalisis?: string; fechaDesde?: string; fechaHasta?: string }) => {
    const params = new URLSearchParams()
    if (filters?.atletaId) params.append('atletaId', filters.atletaId.toString())
    if (filters?.tipoAnalisis) params.append('tipoAnalisis', filters.tipoAnalisis)
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
  getByAthleteId: async (atletaId: number) => {
    const response = await apiClient.get(`/analisis/atleta/${atletaId}`)
    return response.data
  },

  // Create new analysis
  create: async (analysis: CreateAnalysisDTO) => {
    const dataToSend = {
      ...analysis,
      datosJson: typeof analysis.datosJson === 'string'
        ? analysis.datosJson
        : JSON.stringify(analysis.datosJson)
    }
    const response = await apiClient.post('/analisis', dataToSend)
    return response.data
  },

  // Update analysis
  update: async (id: number, analysis: Partial<CreateAnalysisDTO>) => {
    const dataToSend = analysis.datosJson
      ? {
        ...analysis,
        datosJson: typeof analysis.datosJson === 'string'
          ? analysis.datosJson
          : JSON.stringify(analysis.datosJson)
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

// Tipos de respuesta (ejemplo)
export interface Atleta {
  id: number
  nombre: string
  genero: string
  disciplina: string
  posicion?: string
  somatotipo: string
  altura: number
  peso: number
  edad: number
  createdAt: string
  updatedAt: string
}

// Funciones de API específicas
export const atletasAPI = {
  // Obtener todos los atletas
  getAll: async (): Promise<Atleta[]> => {
    const response = await apiClient.get('/atletas')
    return response.data
  },

  // Obtener un atleta por ID
  getById: async (id: number): Promise<Atleta> => {
    const response = await apiClient.get(`/atletas/${id}`)
    return response.data
  },

  // Crear un nuevo atleta
  create: async (data: Omit<Atleta, 'id' | 'createdAt' | 'updatedAt'>): Promise<Atleta> => {
    const response = await apiClient.post('/atletas', data)
    return response.data
  },

  // Actualizar un atleta
  update: async (id: number, data: Partial<Atleta>): Promise<Atleta> => {
    const response = await apiClient.put(`/atletas/${id}`, data)
    return response.data
  },

  // Eliminar un atleta
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/atletas/${id}`)
  },
}

export default apiClient
