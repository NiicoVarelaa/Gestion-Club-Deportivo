import { describe, it, expect, vi, beforeEach } from 'vitest'
import { errorHandler } from './errorHandler.js'
import { logger } from '../utils/logger.js'

function mockRes(overrides = {}) {
  const res = { headersSent: false, status: vi.fn(), json: vi.fn(), ...overrides }
  res.status.mockReturnValue(res)
  res.json.mockReturnValue(res)
  return res
}

function run(err, res = mockRes(), next = vi.fn()) {
  errorHandler(err, { originalUrl: '/api/test' }, res, next)
  return { res, next }
}

const postgrestError = (code, message) => ({
  message,
  details: 'Key (email)=(a@b.com) already exists.',
  hint: null,
  code,
})

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('ZodError', () => {
    it('responds 400 with details using the Zod v3 errors alias', () => {
      const err = { name: 'ZodError', errors: [{ path: ['email'], message: 'Invalid email' }] }
      const { res } = run(err)

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation error',
        details: err.errors,
      })
    })

    it('responds 400 with details using the Zod v4 issues alias', () => {
      const err = { name: 'ZodError', issues: [{ path: ['email'], message: 'Invalid email' }] }
      const { res } = run(err)

      expect(res.json).toHaveBeenCalledWith({ error: 'Validation error', details: err.issues })
    })
  })

  describe('Postgres constraint violations', () => {
    it('responds 409 for a unique violation without leaking the index name', () => {
      const { res } = run(postgrestError('23505', 'duplicate key value violates unique constraint "Socio_email_key"'))

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({ error: 'A record with this value already exists' })
    })

    it('responds 409 for a foreign key violation', () => {
      const { res } = run(postgrestError('23503', 'insert or update on table violates foreign key constraint'))

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({ error: 'Related record does not exist' })
    })

    it('responds 400 for a not-null violation', () => {
      const { res } = run(postgrestError('23502', 'null value in column "nombre"'))

      expect(res.status).toHaveBeenCalledWith(400)
      expect(res.json).toHaveBeenCalledWith({ error: 'Required field is missing' })
    })

    it('responds 400 for a check constraint violation', () => {
      const { res } = run(postgrestError('23514', 'new row violates check constraint'))

      expect(res.json).toHaveBeenCalledWith({ error: 'Value rejected by a database constraint' })
    })
  })

  describe('PostgREST errors', () => {
    it('responds 404 when no row matches the request', () => {
      const { res } = run(postgrestError('PGRST116', 'JSON object requested, multiple (or no) rows returned'))

      expect(res.status).toHaveBeenCalledWith(404)
      expect(res.json).toHaveBeenCalledWith({ error: 'Record not found' })
    })
  })

  describe('GoTrue auth errors', () => {
    it('responds 401 for invalid credentials', () => {
      const { res } = run({ name: 'AuthApiError', status: 400, code: 'invalid_credentials', message: 'Invalid login credentials' })

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' })
    })

    it('responds 409 for an already registered email', () => {
      const { res } = run({ name: 'AuthApiError', status: 422, code: 'email_exists', message: 'User already registered' })

      expect(res.status).toHaveBeenCalledWith(409)
      expect(res.json).toHaveBeenCalledWith({ error: 'Email already registered' })
    })

    it('responds 429 when GoTrue rate limits the request', () => {
      const { res } = run({ name: 'AuthApiError', code: 'over_request_rate_limit', message: 'Too many requests' })

      expect(res.status).toHaveBeenCalledWith(429)
    })
  })

  describe('infrastructure errors', () => {
    it('responds 503 without disclosing the missing env var names', () => {
      const err = { code: 'SUPABASE_NOT_CONFIGURED', message: 'SUPABASE_URL and SUPABASE_SERVICE_KEY must be set' }
      const { res } = run(err)

      expect(res.status).toHaveBeenCalledWith(503)
      expect(res.json).toHaveBeenCalledWith({ error: 'Service temporarily unavailable' })
      expect(JSON.stringify(res.json.mock.calls)).not.toContain('SUPABASE_URL')
    })
  })

  describe('client errors with an explicit status', () => {
    it('honours err.status', () => {
      const { res } = run({ status: 403, message: 'Forbidden' })

      expect(res.status).toHaveBeenCalledWith(403)
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' })
    })

    it('honours err.statusCode', () => {
      const { res } = run({ statusCode: 413, message: 'Payload too large' })

      expect(res.status).toHaveBeenCalledWith(413)
    })

    it('does not honour a non-integer or out-of-range status', () => {
      const { res } = run({ status: 'nope', message: 'boom' })

      expect(res.status).toHaveBeenCalledWith(500)
    })
  })

  describe('unexpected errors', () => {
    it('responds 500 with a generic message instead of the raw error', () => {
      const { res } = run(new Error('connection to 10.0.0.4:5432 refused'))

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' })
      expect(JSON.stringify(res.json.mock.calls)).not.toContain('10.0.0.4')
    })

    it('responds 500 with a generic message when the error carries no code', () => {
      const { res } = run({})

      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' })
    })
  })

  it('delegates to next when the response was already sent', () => {
    const res = mockRes({ headersSent: true })
    const next = vi.fn()

    run({ code: '23505' }, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})

describe('errorHandler logging', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs client errors as warn so they do not pollute error alerts', () => {
    run(postgrestError('23505', 'duplicate key'))

    expect(logger.warn).toHaveBeenCalled()
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('logs validation rejections as warn', () => {
    run({ name: 'ZodError', errors: [] })

    expect(logger.warn).toHaveBeenCalled()
  })

  it('logs server errors as error', () => {
    run(new Error('boom'))

    expect(logger.error).toHaveBeenCalled()
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it('includes the path and the database code in the log context', () => {
    run(postgrestError('23505', 'duplicate key'))

    expect(logger.warn).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/api/test', status: 409, code: '23505' }),
      'Request rejected'
    )
  })

  it('does not log at all when the response was already sent', () => {
    run({ code: '23505' }, mockRes({ headersSent: true }))

    expect(logger.warn).not.toHaveBeenCalled()
    expect(logger.error).not.toHaveBeenCalled()
  })
})
