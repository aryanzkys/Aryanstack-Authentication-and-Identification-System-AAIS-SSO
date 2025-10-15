import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('aais_token')
    if (token) {
      config.headers.Authorization = `******
    }
  }
  return config
})

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aais_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export interface SignupData {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginData {
  email: string
  password: string
}

export const authAPI = {
  signup: async (data: SignupData) => {
    const response = await api.post('/signup', data)
    return response.data
  },

  login: async (data: LoginData) => {
    const response = await api.post('/login', data)
    return response.data
  },

  callback: async (code: string, state?: string) => {
    const response = await api.get('/callback', {
      params: { code, state },
    })
    return response.data
  },

  getProfile: async () => {
    const response = await api.get('/profile')
    return response.data
  },
}
