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
      updateUser: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
  },
}))

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

function trackSubscriptions() {
  const subs = []
  supabase.auth.onAuthStateChange.mockImplementation((callback) => {
    const sub = {
      callback,
      active: true,
      unsubscribe: vi.fn(() => {
        sub.active = false
      }),
    }
    subs.push(sub)
    return { data: { subscription: sub } }
  })
  return subs
}

function resolveSession(session) {
  supabase.auth.getSession.mockResolvedValue({
    data: { session },
    error: null,
  })
}

const activeSubs = (subs) => subs.filter((s) => s.active)

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, session: null, loading: true })
    localStorage.clear()
    vi.clearAllMocks()
    supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    supabase.auth.signOut.mockResolvedValue({ error: null })
  })

  it('starts with no user, no session and loading true', () => {
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.session).toBeNull()
    expect(state.loading).toBe(true)
  })

  it('exposes no register action, which had no callers', () => {
    expect(useAuthStore.getState().register).toBeUndefined()
  })

  describe('init', () => {
    it('returns a cleanup function', () => {
      trackSubscriptions()
      expect(typeof useAuthStore.getState().init()).toBe('function')
    })

    it('subscribes to auth state changes', () => {
      trackSubscriptions()
      useAuthStore.getState().init()
      expect(supabase.auth.onAuthStateChange).toHaveBeenCalledTimes(1)
    })

    it('unsubscribes the listener on cleanup', () => {
      const subs = trackSubscriptions()
      const cleanup = useAuthStore.getState().init()

      cleanup()

      expect(subs[0].unsubscribe).toHaveBeenCalledTimes(1)
    })

    it('restores the session and token from getSession', async () => {
      const session = { access_token: 'tok', user: { id: 'u1' } }
      resolveSession(session)
      trackSubscriptions()

      useAuthStore.getState().init()
      await flush()

      expect(useAuthStore.getState().session).toEqual(session)
      expect(useAuthStore.getState().user).toEqual({ id: 'u1' })
      expect(useAuthStore.getState().loading).toBe(false)
      expect(localStorage.getItem('supabase_token')).toBe('tok')
    })

    it('keeps loading true until getSession resolves', async () => {
      let resolveGetSession
      supabase.auth.getSession.mockReturnValue(
        new Promise((resolve) => {
          resolveGetSession = resolve
        })
      )
      trackSubscriptions()

      useAuthStore.getState().init()
      await flush()
      expect(useAuthStore.getState().loading).toBe(true)

      resolveGetSession({ data: { session: null }, error: null })
      await flush()
      expect(useAuthStore.getState().loading).toBe(false)
    })

    it('leaves no token behind when there is no session', async () => {
      localStorage.setItem('supabase_token', 'stale')
      resolveSession(null)
      trackSubscriptions()

      useAuthStore.getState().init()
      await flush()

      expect(localStorage.getItem('supabase_token')).toBeNull()
    })

    it('leaves a single active listener across a StrictMode remount', () => {
      const subs = trackSubscriptions()

      const firstCleanup = useAuthStore.getState().init()
      const secondCleanup = useAuthStore.getState().init()
      firstCleanup()

      expect(activeSubs(subs)).toHaveLength(1)

      secondCleanup()
      expect(activeSubs(subs)).toHaveLength(0)
    })

    it('does not let a stale init overwrite a newer one', async () => {
      const resolvers = []
      supabase.auth.getSession.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvers.push(resolve)
          })
      )
      trackSubscriptions()

      useAuthStore.getState().init()
      useAuthStore.getState().init()

      resolvers[0]({ data: { session: { access_token: 'stale' } }, error: null })
      await flush()

      expect(useAuthStore.getState().session).toBeNull()

      resolvers[1]({ data: { session: { access_token: 'fresh' } }, error: null })
      await flush()

      expect(localStorage.getItem('supabase_token')).toBe('fresh')
    })

    it('ignores auth events emitted after cleanup', () => {
      const subs = trackSubscriptions()
      const cleanup = useAuthStore.getState().init()

      cleanup()
      subs[0].callback('SIGNED_IN', { access_token: 'tok', user: { id: 'u1' } })

      expect(useAuthStore.getState().session).toBeNull()
      expect(localStorage.getItem('supabase_token')).toBeNull()
    })
  })

  describe('auth state changes', () => {
    it('updates the session, the user and the token', () => {
      const subs = trackSubscriptions()
      useAuthStore.getState().init()
      const session = { access_token: 'fresh', user: { id: 'u9' } }

      subs[0].callback('TOKEN_REFRESHED', session)

      expect(useAuthStore.getState().session).toEqual(session)
      expect(useAuthStore.getState().user).toEqual({ id: 'u9' })
      expect(useAuthStore.getState().loading).toBe(false)
      expect(localStorage.getItem('supabase_token')).toBe('fresh')
    })

    it('clears the token when the session ends', () => {
      const subs = trackSubscriptions()
      useAuthStore.getState().init()
      localStorage.setItem('supabase_token', 'tok')

      subs[0].callback('SIGNED_OUT', null)

      expect(useAuthStore.getState().session).toBeNull()
      expect(useAuthStore.getState().user).toBeNull()
      expect(localStorage.getItem('supabase_token')).toBeNull()
    })
  })

  describe('applySession', () => {
    it('adopts a session returned outside supabase auth', () => {
      const session = { access_token: 'from-server', user: { id: 'u2' } }

      useAuthStore.getState().applySession(session)

      expect(useAuthStore.getState().session).toEqual(session)
      expect(useAuthStore.getState().user).toEqual({ id: 'u2' })
      expect(useAuthStore.getState().loading).toBe(false)
      expect(localStorage.getItem('supabase_token')).toBe('from-server')
    })

    it('clears everything when passed null', () => {
      localStorage.setItem('supabase_token', 'tok')

      useAuthStore.getState().applySession(null)

      expect(useAuthStore.getState().session).toBeNull()
      expect(localStorage.getItem('supabase_token')).toBeNull()
    })
  })

  describe('login', () => {
    it('sets the user and session and stores the token', async () => {
      const user = { id: 'u1', email: 'test@example.com' }
      const session = { access_token: 'token123', user }
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
      expect(useAuthStore.getState().loading).toBe(false)
      expect(localStorage.getItem('supabase_token')).toBe('token123')
    })

    it('throws when supabase returns an error', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'Invalid credentials' },
      })

      await expect(
        useAuthStore.getState().login('test@example.com', 'pass')
      ).rejects.toThrow('Invalid credentials')
    })

    it('leaves no token behind on failure', async () => {
      localStorage.setItem('supabase_token', 'stale')
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'Invalid credentials' },
      })

      await expect(
        useAuthStore.getState().login('test@example.com', 'pass')
      ).rejects.toThrow()

      expect(localStorage.getItem('supabase_token')).toBe('stale')
    })
  })

  describe('logout', () => {
    it('clears the user, session and token', async () => {
      useAuthStore.setState({ user: { id: 'u1' }, session: { access_token: 'token123' } })
      localStorage.setItem('supabase_token', 'token123')

      await useAuthStore.getState().logout()

      expect(supabase.auth.signOut).toHaveBeenCalled()
      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().session).toBeNull()
      expect(useAuthStore.getState().loading).toBe(false)
      expect(localStorage.getItem('supabase_token')).toBeNull()
    })

    it('clears local state even when signOut fails, so the app can still log out', async () => {
      useAuthStore.setState({ user: { id: 'u1' }, session: { access_token: 'token123' } })
      localStorage.setItem('supabase_token', 'token123')
      supabase.auth.signOut.mockRejectedValue(new Error('network down'))

      await useAuthStore.getState().logout()

      expect(useAuthStore.getState().user).toBeNull()
      expect(localStorage.getItem('supabase_token')).toBeNull()
    })
  })
})
