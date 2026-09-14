import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authMiddleware, requireAdmin, optionalAuth } from './auth.js'
import { getSupabase } from '../utils/supabase.js'

describe('authMiddleware', () => {
  let supabase
  let res

  beforeEach(() => {
    supabase = { auth: { getUser: vi.fn() } }
    vi.mocked(getSupabase).mockReturnValue(supabase)
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    }
    vi.clearAllMocks()
  })

  it('responds 401 when no bearer token is provided', () => {
    const next = vi.fn()
    const req = { headers: {} }

    authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' })
    expect(next).not.toHaveBeenCalled()
  })

  it('responds 401 when the token is invalid', async () => {
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Invalid token' },
    })
    const next = vi.fn()
    const req = { headers: { authorization: 'Bearer bad-token' } }

    await authMiddleware(req, res, next)

    expect(supabase.auth.getUser).toHaveBeenCalledWith('bad-token')
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' })
    expect(next).not.toHaveBeenCalled()
  })

  it('sets req.user and calls next for a valid token', async () => {
    const user = { id: 'u1', email: 'a@b.com' }
    supabase.auth.getUser.mockResolvedValue({ data: { user }, error: null })
    const next = vi.fn()
    const req = { headers: { authorization: 'Bearer good-token' } }

    await authMiddleware(req, res, next)

    expect(req.user).toEqual(user)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  it('responds 401 when supabase fails with an unexpected error', async () => {
    supabase.auth.getUser.mockRejectedValue(new Error('boom'))
    const next = vi.fn()

    await authMiddleware(
      { headers: { authorization: 'Bearer token' } },
      res,
      next
    )

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication failed' })
  })
})

describe('requireAdmin', () => {
  let next

  beforeEach(() => {
    next = vi.fn()
  })

  it('responds 401 when there is no authenticated user', () => {
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() }

    requireAdmin({}, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' })
    expect(next).not.toHaveBeenCalled()
  })

  it('responds 403 when the user is not an admin', () => {
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() }
    const req = { user: { user_metadata: { role: 'portero' } } }

    requireAdmin(req, res, next)

    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ error: 'Admin access required' })
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next for admin users', () => {
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() }
    const req = { user: { user_metadata: { role: 'admin' } } }

    requireAdmin(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })
})

describe('optionalAuth', () => {
  let res

  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() }
  })

  it('sets req.user to null and continues without a token', () => {
    const next = vi.fn()
    const req = { headers: {} }

    optionalAuth(req, res, next)

    expect(req.user).toBeNull()
    expect(next).toHaveBeenCalled()
  })

  it('delegates to authMiddleware when a token is present', async () => {
    const supabase = { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }) } }
    vi.mocked(getSupabase).mockReturnValue(supabase)
    const next = vi.fn()
    const req = { headers: { authorization: 'Bearer token' } }

    await optionalAuth(req, res, next)

    expect(req.user).toEqual({ id: 'u1' })
    expect(next).toHaveBeenCalled()
  })
})