import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().session?.access_token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Drop the session in the store too, not just the header source, or the
      // app keeps rendering as if signed in until the next full reload.
      // Best effort: the rejection below is what the caller actually handles.
      void useAuthStore.getState().expireSession()
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
