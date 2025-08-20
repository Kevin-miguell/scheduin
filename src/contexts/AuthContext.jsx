import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)
        }
        setLoading(false)
      })

    // Listen for auth changes - NEVER ASYNC callback
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)  // Fire-and-forget, NO AWAIT
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = (userId) => {
    supabase?.from('user_profiles')?.select(`
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
      `)?.eq('id', userId)?.single()?.then(({ data, error }) => {
        if (error) {
          console.log('Profile fetch error:', error)
          return
        }
        setUserProfile(data)
      })?.catch(error => {
        console.log('Profile fetch error:', error)
      })
  }

  const signUp = async (email, password, fullName) => {
    try {
      setLoading(true)
      setError('')
      
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      if (error) {
        setError(error?.message)
        return { error }
      }
      
      return { data }
    } catch (error) {
      setError('Something went wrong during signup')
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email, password) => {
    try {
      setLoading(true)
      setError('')
      
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setError(error?.message)
        return { error }
      }
      
      return { data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
      } else {
        setError('Something went wrong during signin')
      }
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase?.auth?.signOut()
      
      if (error) {
        setError(error?.message)
        return { error }
      }
      
      setUser(null)
      setUserProfile(null)
      return { success: true }
    } catch (error) {
      setError('Something went wrong during signout')
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!user) return { error: 'No user logged in' }
      
      const { error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)
      
      if (error) {
        setError(error?.message)
        return { error }
      }
      
      // Refresh profile data
      fetchUserProfile(user?.id)
      return { success: true }
    } catch (error) {
      setError('Failed to update profile')
      return { error }
    }
  }

  const connectLinkedIn = async (linkedinData) => {
    try {
      if (!user) return { error: 'No user logged in' }
      
      const { error } = await supabase?.from('linkedin_connections')?.upsert({
          user_id: user?.id,
          linkedin_user_id: linkedinData?.id,
          access_token: linkedinData?.accessToken,
          refresh_token: linkedinData?.refreshToken,
          expires_at: linkedinData?.expiresAt,
          profile_data: linkedinData?.profile,
          is_active: true
        })
      
      if (error) {
        setError(error?.message)
        return { error }
      }
      
      // Update user profile to reflect LinkedIn connection
      await updateProfile({ linkedin_connected: true })
      
      return { success: true }
    } catch (error) {
      setError('Failed to connect LinkedIn')
      return { error }
    }
  }

  const disconnectLinkedIn = async () => {
    try {
      if (!user) return { error: 'No user logged in' }
      
      const { error } = await supabase?.from('linkedin_connections')?.update({ is_active: false })?.eq('user_id', user?.id)
      
      if (error) {
        setError(error?.message)
        return { error }
      }
      
      // Update user profile
      await updateProfile({ linkedin_connected: false })
      
      return { success: true }
    } catch (error) {
      setError('Failed to disconnect LinkedIn')
      return { error }
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    connectLinkedIn,
    disconnectLinkedIn,
    clearError: () => setError('')
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}