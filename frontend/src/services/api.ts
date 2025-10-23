import axios from 'axios'

// Configuración base de Axios
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Crear instancia de axios configurada
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de peticiones (opcional - para agregar tokens en el futuro)
apiClient.interceptors.request.use(
  (config) => {
    // Aquí se puede agregar lógica para tokens de autenticación
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

// Interceptor de respuestas (manejo de errores globales)
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Manejo de errores globales
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Error de servidor:', error.response.status)
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('Error de red: No se pudo conectar al servidor')
    } else {
      // Algo pasó al configurar la petición
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

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
