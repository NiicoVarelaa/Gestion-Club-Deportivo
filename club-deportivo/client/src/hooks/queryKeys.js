export const queryKeys = {
  dashboard: () => ['dashboard'],

  socios: {
    all: () => ['socios'],
    list: (params) => ['socios', 'list', params ?? {}],
    detail: (id) => ['socios', 'detail', String(id)],
    options: () => ['socios', 'options'],
  },

  deportes: {
    all: () => ['deportes'],
    list: (params) => ['deportes', 'list', params ?? {}],
  },

  inscripciones: {
    all: () => ['inscripciones'],
    list: (params) => ['inscripciones', 'list', params ?? {}],
  },

  pagos: {
    all: () => ['pagos'],
    list: (params) => ['pagos', 'list', params ?? {}],
    deudas: (socioId) => ['pagos', 'deudas', String(socioId)],
    vencidosCount: () => ['pagos', 'vencidos-count'],
  },

  portal: {
    all: () => ['portal'],
    me: () => ['portal', 'me'],
  },
}
