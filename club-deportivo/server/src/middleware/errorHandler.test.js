import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { errorHandler } from './errorHandler.js'

function mockRes() {
  const res = { status: vi.fn(), json: vi.fn() }
  res.status.mockReturnValue(res)
  res.json.mockReturnValue(res)
  return res
}

describe('errorHandler', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('responds 400 with validation details for ZodError', () => {
    const err = {
      name: 'ZodError',
      errors: [{ path: ['email'], message: 'Invalid email' }],
    }
    const res = mockRes()

    errorHandler(err, {}, res, () => {})

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Validation error',
      details: err.errors,
    })
  })

  it('responds 409 for Prisma P2002', () => {
    const err = { code: 'P2002' }
    const res = mockRes()

    errorHandler(err, {}, res, () => {})

    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Conflict',
      message: 'A record with this value already exists',
    })
  })

  it('responds 404 for Prisma P2025', () => {
    const err = { code: 'P2025' }
    const res = mockRes()

    errorHandler(err, {}, res, () => {})

    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Not found',
      message: 'Record not found',
    })
  })

  it('responds with err.status and err.message when present', () => {
    const err = { status: 403, message: 'Forbidden' }
    const res = mockRes()

    errorHandler(err, {}, res, () => {})

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' })
  })

  it('responds 500 with the error message for generic errors', () => {
    const err = new Error('boom')
    const res = mockRes()

    errorHandler(err, {}, res, () => {})

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'boom' })
  })

  it('responds 500 with default message when missing', () => {
    const res = mockRes()

    errorHandler({}, {}, res, () => {})

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' })
  })
})