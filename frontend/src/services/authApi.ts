import { apiClient } from './api'

export type UserRole = 'ADMIN'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
}

export interface LoginResponse {
  success: boolean
  data: {
    token: string
    user: AuthUser
  }
}

export interface ChangePasswordResponse {
  success: boolean
  message: string
}

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post<LoginResponse>('/auth/login', { email, password })
    return response.data
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.post<ChangePasswordResponse>('/auth/change-password', {
      currentPassword,
      newPassword
    })
    return response.data
  }
}
