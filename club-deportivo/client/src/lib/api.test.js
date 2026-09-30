import { describe, it, expect, vi, beforeEach } from 'vitest'

const { interceptorsMock } = vi.hoisted(() => ({
  interceptorsMock: {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  },
}))

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: interceptorsMock,
      defaults: {},
    })),
  },
}))

vi.mock('@/stores/authStore', () => ({
  useAuthStore: { getState: vi.fn() },
}))

import api, { getApiError } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

const requestHandler = interceptorsMock.request.use.mock.calls[0][0]
const responseHandler = interceptorsMock.response.use.mock.calls[0][0]
const responseErrorHandler = interceptorsMock.response.use.mock.calls[0][1]

function mockStore(session, expireSession = vi.fn()) {
  useAuthStore.getState.mockReturnValue({ session, expireSession })
  return expireSession
}

describe('api interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore(null)
  })

  it('adds the Authorization header from the session in the store', () => {
    mockStore({ access_token: 'tok' })
    const config = { headers: {} }

    const result = requestHandler(config)

    expect(result.headers.Authorization).toBe('Bearer tok')
  })

  it('prefers the store over a leftover supabase_token in localStorage', () => {
    localStorage.setItem('supabase_token', 'stale-token')
    mockStore({ access_token: 'store-token' })
    const config = { headers: {} }

    const result = requestHandler(config)

    expect(result.headers.Authorization).toBe('Bearer store-token')
  })

  it('passes through when there is no session', () => {
    const config = { headers: {} }

    const result = requestHandler(config)

    expect(result.headers.Authorization).toBeUndefined()
  })

  it('passes through when the session exists but carries no token', () => {
    mockStore({ user: { id: 'u1' } })
    const config = { headers: {} }

    const result = requestHandler(config)

    expect(result.headers.Authorization).toBeUndefined()
  })

  it('passes responses through unchanged', () => {
    const res = { data: 1 }
    expect(responseHandler(res)).toBe(res)
  })

  it('expires the store session on 401', async () => {
    const expireSession = mockStore({ access_token: 'tok' })
    const err = { response: { status: 401 } }

    await expect(responseErrorHandler(err)).rejects.toBe(err)

    expect(expireSession).toHaveBeenCalledTimes(1)
  })

  it('rejects non-401 errors without expiring the session', async () => {
    const expireSession = mockStore({ access_token: 'tok' })
    const err = { response: { status: 500 } }

    await expect(responseErrorHandler(err)).rejects.toBe(err)

    expect(expireSession).not.toHaveBeenCalled()
  })

  it('creates the axios instance through the mocked create', () => {
    expect(api.defaults).toBeDefined()
  })
})

describe('getApiError', () => {
  it('reads the error key, which is the server contract', () => {
    const err = { response: { data: { error: 'Socio not found' } } }
    expect(getApiError(err, 'fallback')).toBe('Socio not found')
  })

  it('falls back to message when error is absent', () => {
    const err = { response: { data: { message: 'Conflict' } } }
    expect(getApiError(err, 'fallback')).toBe('Conflict')
  })

  it('prefers error over message', () => {
    const err = { response: { data: { error: 'Admin access required', message: 'ignored' } } }
    expect(getApiError(err, 'fallback')).toBe('Admin access required')
  })

  it('uses the fallback when the response body is missing', () => {
    expect(getApiError(new Error('Network Error'), 'fallback')).toBe('fallback')
  })

  it('uses the fallback when the body carries no message', () => {
    expect(getApiError({ response: { data: {} } }, 'fallback')).toBe('fallback')
  })
})