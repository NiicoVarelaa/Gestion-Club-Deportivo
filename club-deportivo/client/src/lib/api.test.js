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

import api from './api.js'

const requestHandler = interceptorsMock.request.use.mock.calls[0][0]
const responseHandler = interceptorsMock.response.use.mock.calls[0][0]
const responseErrorHandler = interceptorsMock.response.use.mock.calls[0][1]

describe('api interceptors', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('adds the Authorization header from localStorage', () => {
    localStorage.setItem('supabase_token', 'tok')
    const config = { headers: {} }

    const result = requestHandler(config)

    expect(result.headers.Authorization).toBe('Bearer tok')
  })

  it('passes through when there is no token', () => {
    const config = { headers: {} }

    const result = requestHandler(config)

    expect(result.headers.Authorization).toBeUndefined()
  })

  it('passes responses through unchanged', () => {
    const res = { data: 1 }
    expect(responseHandler(res)).toBe(res)
  })

  it('clears the token and rejects on 401', async () => {
    localStorage.setItem('supabase_token', 'tok')
    const err = { response: { status: 401 } }

    await expect(responseErrorHandler(err)).rejects.toBe(err)

    expect(localStorage.getItem('supabase_token')).toBeNull()
  })

  it('rejects non-401 errors without clearing the token', async () => {
    localStorage.setItem('supabase_token', 'tok')
    const err = { response: { status: 500 } }

    await expect(responseErrorHandler(err)).rejects.toBe(err)

    expect(localStorage.getItem('supabase_token')).toBe('tok')
  })

  it('creates the axios instance through the mocked create', () => {
    expect(api.defaults).toBeDefined()
  })
})