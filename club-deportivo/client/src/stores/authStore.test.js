import { describe, it, expect, vi, beforeEach } from 'vitest'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './authStore.js'

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}))

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, session: null, loading: true })
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('starts with no user, no session and loading true', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
    expect(state.loading).toBe(true)
  })

  it('login sets the user and session and stores the token', async () => {
    const user = { id: 'u1', email: 'test@example.com' }
    const session = { access_token: 'token123' }
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { session, user },
      error: null,
    })

    const result = await useAuthStore.getState().login('test@example.com', 'pass')

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'pass',
    })
    expect(result).toEqual({ session, user })
    expect(useAuthStore.getState().user).toEqual(user)
    expect(useAuthStore.getState().session).toEqual(session)
    expect(localStorage.getItem('supabase_token')).toBe('token123')
  })

  it('login throws when supabase returns an error', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: null, user: null },
      error: { message: 'Invalid credentials' },
    })

    await expect(
      useAuthStore.getState().login('test@example.com', 'pass')
    ).rejects.toThrow('Invalid credentials')
  })

  it('logout clears the user, session and token', async () => {
    useAuthStore.setState({ user: { id: 'u1' }, session: { access_token: 'token123' } })
    localStorage.setItem('supabase_token', 'token123')
    supabase.auth.signOut.mockResolvedValue({ error: null })

    await useAuthStore.getState().logout()

    expect(supabase.auth.signOut).toHaveBeenCalled()
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().session).toBeNull()
    expect(localStorage.getItem('supabase_token')).toBeNull()
  })
})