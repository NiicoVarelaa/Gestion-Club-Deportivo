import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  session: null,
  loading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    set({ session, user: session?.user ?? null, loading: false })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, user: session?.user ?? null })
      if (session) {
        localStorage.setItem('supabase_token', session.access_token)
      } else {
        localStorage.removeItem('supabase_token')
      }
    })
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    localStorage.setItem('supabase_token', data.session.access_token)
    set({ session: data.session, user: data.user })
    return data
  },

  register: async (email, password, metadata) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    })
    if (error) throw error
    return data
  },

  logout: async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('supabase_token')
    set({ session: null, user: null })
  },
}))
