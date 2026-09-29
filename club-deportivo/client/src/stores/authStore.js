import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const TOKEN_KEY = 'supabase_token'

function persistToken(session) {
  try {
    const token = session?.access_token
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // localStorage throws in private mode and when the quota is full
  }
}

let latestInitId = 0

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  init: () => {
    const id = ++latestInitId
    let disposed = false
    const isCurrent = () => !disposed && id === latestInitId

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isCurrent()) return
      set({ session, user: session?.user ?? null, loading: false })
      persistToken(session)
    })

    supabase.auth.getSession().then(({ data }) => {
      if (!isCurrent()) return
      set({ session: data.session, user: data.session?.user ?? null, loading: false })
      persistToken(data.session)
    })

    return () => {
      disposed = true
      sub?.subscription?.unsubscribe()
    }
  },

  applySession: (session) => {
    set({ session, user: session?.user ?? null, loading: false })
    persistToken(session)
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const { session, user } = data
    set({ session, user, loading: false })
    persistToken(session)
    return data
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw error
  },

  updatePassword: async (password) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
  },

  logout: async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // Local state is cleared regardless: the token is gone either way, so
      // any request left in flight gets a 401 and the interceptor redirects.
    }
    set({ session: null, user: null, loading: false })
    persistToken(null)
  },
}))
