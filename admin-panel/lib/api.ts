import axios from 'axios'

const SSO_API_URL = process.env.NEXT_PUBLIC_SSO_API_URL || 'http://localhost:3000'

export const ssoApi = axios.create({
  baseURL: SSO_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
ssoApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle token expiration
ssoApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
