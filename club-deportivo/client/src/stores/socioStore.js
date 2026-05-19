import { create } from 'zustand'
import api from '@/lib/api'

export const useSocioStore = create((set, get) => ({
  socio: null,
  deportes: [],
  pagos: [],
  deuda: null,
  loading: false,
  error: null,
  initialized: false,

  fetchPortalData: async () => {
    if (get().initialized) return
    set({ loading: true, error: null })
    try {
      const token = localStorage.getItem('socio_token')
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
      const { data } = await api.get('/portal/me')
      set({
        socio: data.socio,
        deportes: data.deportes,
        pagos: data.pagos,
        deuda: data.deuda,
        loading: false,
        initialized: true,
      })
    } catch {
      set({ error: 'Error al cargar datos del portal', loading: false })
    }
  },

  logout: () => {
    localStorage.removeItem('socio_token')
    set({ socio: null, deportes: [], pagos: [], deuda: null, error: null, initialized: false })
  },

  clearError: () => set({ error: null }),
}))

export default useSocioStore