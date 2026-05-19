import { create } from 'zustand';

export const useSocioStore = create((set) => ({
  socio: null,
  deportes: [],
  pagos: [],
  deuda: null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { default: api } = await import('@/lib/api');
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('socio_token', data.session?.access_token || '');
      set({ loading: false });
      return data;
    } catch {
      const msg = 'Error de autenticacion';
      set({ error: msg, loading: false });
    }
  },

  fetchPortalData: async () => {
    set({ loading: true, error: null });
    try {
      const { default: api } = await import('@/lib/api');
      const token = localStorage.getItem('socio_token');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      const { data } = await api.get('/portal/me');
      set({
        socio: data.socio,
        deportes: data.deportes,
        pagos: data.pagos,
        deuda: data.deuda,
        loading: false,
      });
    } catch {
      set({ error: 'Error al cargar datos del portal', loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('socio_token');
    set({ socio: null, deportes: [], pagos: [], deuda: null, error: null });
  },

  clearError: () => set({ error: null }),
}));

export default useSocioStore;