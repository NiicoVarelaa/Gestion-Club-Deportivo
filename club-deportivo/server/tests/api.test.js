import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { getSupabase } from '../src/utils/supabase.js'

function chainable(result) {
  const proxy = new Proxy(function () {}, {
    get(_target, prop) {
      if (prop === 'then') {
        return (resolve) => Promise.resolve(result).then(resolve)
      }
      return chainable(result)
    },
    apply() {
      return chainable(result)
    },
  })
  return proxy
}

function makeSupabaseMock(tableHandlers, authGetUser) {
  return {
    from: (table) => chainable(tableHandlers[table]()),
    auth: authGetUser
      ? { getUser: authGetUser }
      : undefined,
  }
}

describe('API integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('GET /api/health responds ok with connected database', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      makeSupabaseMock({
        Socio: () => ({ data: [{ id: 1 }], error: null }),
      })
    )

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.database).toBe('connected')
  })

  it('GET /api/health reports disconnected database on query error', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      makeSupabaseMock({
        Socio: () => ({ data: null, error: { message: 'down' } }),
      })
    )

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('ok')
    expect(res.body.database).toBe('disconnected')
  })

  it('GET /api/health responds 503 when supabase throws', async () => {
    const supabase = {
      from: () => {
        throw new Error('connection refused')
      },
    }
    vi.mocked(getSupabase).mockReturnValue(supabase)

    const res = await request(app).get('/api/health')

    expect(res.status).toBe(503)
    expect(res.body.status).toBe('degraded')
  })

  it('GET /api/deportes lists deportes with inscripciones count', async () => {
    vi.mocked(getSupabase).mockReturnValue(
      makeSupabaseMock({
        Deporte: () => ({
          data: [{ id: 'd1', nombre: 'Futbol', activo: true }],
          error: null,
        }),
        Inscripcion: () => ({ count: 3 }),
      })
    )

    const res = await request(app).get('/api/deportes')

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0]).toMatchObject({ nombre: 'Futbol' })
    expect(res.body.data[0]._count).toEqual({ inscripciones: 3 })
  })

  it('GET /api/socios lists socios with pagination and inscripciones', async () => {
    const getUser = vi.fn().mockResolvedValue({
      data: { user: { user_metadata: { role: 'admin' } } },
      error: null,
    })
    vi.mocked(getSupabase).mockReturnValue(
      makeSupabaseMock(
        {
          Socio: () => ({
            data: [{ id: 's1', nombre: 'Juan' }],
            count: 1,
            error: null,
          }),
          Inscripcion: () => ({
            data: [{ id: 'i1', socioId: 's1', deporteId: 'd1' }],
            error: null,
          }),
          Deporte: () => ({
            data: [{ id: 'd1', nombre: 'Futbol' }],
            error: null,
          }),
        },
        getUser
      )
    )

    const res = await request(app)
      .get('/api/socios?page=1&limit=10')
      .set('Authorization', 'Bearer token')

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveLength(1)
    expect(res.body.data[0].inscripciones[0]).toMatchObject({ id: 'i1' })
    expect(res.body.data[0].inscripciones[0].deporte).toMatchObject({
      nombre: 'Futbol',
    })
    expect(res.body.pagination).toEqual({
      page: 1,
      limit: 10,
      total: 1,
      pages: 1,
    })
  })

  it('POST /api/deportes responds 400 with validation error for invalid body', async () => {
    const getUser = vi.fn().mockResolvedValue({
      data: { user: { user_metadata: { role: 'admin' } } },
      error: null,
    })
    vi.mocked(getSupabase).mockReturnValue(makeSupabaseMock({}, getUser))

    const res = await request(app)
      .post('/api/deportes')
      .set('Authorization', 'Bearer token')
      .send({ nombre: '' })

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('Validation error')
    expect(Array.isArray(res.body.details)).toBe(true)
  })
})