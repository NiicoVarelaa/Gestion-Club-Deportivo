import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('supabase_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('supabase_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getApiError = (err, fallback) => {
  const body = err?.response?.data
  return body?.error || body?.message || fallback
}

export default api
