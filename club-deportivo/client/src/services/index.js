import api from '../lib/api'

export const sociosService = {
  getAll: (params) => api.get('/socios', { params }),
  getById: (id) => api.get(`/socios/${id}`),
  create: (data) => api.post('/socios', data),
  update: (id, data) => api.put(`/socios/${id}`, data),
  delete: (id) => api.delete(`/socios/${id}`),
}

export const deportesService = {
  getAll: (params) => api.get('/deportes', { params }),
  getById: (id) => api.get(`/deportes/${id}`),
  create: (data) => api.post('/deportes', data),
  update: (id, data) => api.put(`/deportes/${id}`, data),
  delete: (id) => api.delete(`/deportes/${id}`),
}

export const inscripcionesService = {
  getAll: (params) => api.get('/inscripciones', { params }),
  create: (data) => api.post('/inscripciones', data),
  cancel: (id) => api.delete(`/inscripciones/${id}`),
}

export const pagosService = {
  getAll: (params) => api.get('/pagos', { params }),
  create: (data) => api.post('/pagos', data),
  getDeudas: (socioId) => api.get(`/pagos/deudas/${socioId}`),
  generateMonthly: () => api.post('/pagos/generar'),
  getDashboard: () => api.get('/pagos/dashboard'),
}
