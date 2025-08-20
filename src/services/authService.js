import { supabase } from '../lib/supabase';

export const authService = {
  async signUp(email, password, fullName) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async signIn(email, password) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      return { error }
    }
  },

  async getSession() {
    try {
      const { data: { session }, error } = await supabase?.auth?.getSession()
      if (error) throw error
      return { session, error: null }
    } catch (error) {
      return { session: null, error }
    }
  },

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase?.from('user_profiles')?.select(`
          *,
          user_settings (
            optimal_posting_times,
            default_hashtags,
            notification_settings
          ),
          linkedin_connections (
            is_active,
            linkedin_user_id,
            profile_data
          )
        `)?.eq('id', userId)?.single()
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}