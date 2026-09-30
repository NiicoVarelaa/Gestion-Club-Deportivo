import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

let latestInitId = 0

export const useAuthStore = create((set) => {
  function applySession(session) {
    set({ session, user: session?.user ?? null, loading: false })
  }

  async function expireSession() {
    try {
      await supabase.auth.signOut()
    } catch {
      // Local state is cleared regardless: without a session the app cannot
      // keep serving requests, so anything in flight gets a 401 and redirects.
    }
    set({ session: null, user: null, loading: false })
  }

  return {
    user: null,
    session: null,
    loading: true,

    init: () => {
      const id = ++latestInitId
      let disposed = false
      let sawEvent = false
      const isCurrent = () => !disposed && id === latestInitId

      // Subscribed before awaiting getSession. An event that lands while the
      // session is still resolving carries a newer token than the one
      // getSession captured when it was called, so it wins.
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isCurrent()) return
        sawEvent = true
        applySession(session)
      })

      supabase.auth.getSession().then(({ data }) => {
        if (!isCurrent() || sawEvent) return
        applySession(data.session)
      })

      return () => {
        disposed = true
        sub?.subscription?.unsubscribe()
      }
    },

    applySession,

    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      applySession(data.session)
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

    logout: expireSession,
    expireSession,
  }
})