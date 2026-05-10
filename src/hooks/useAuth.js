import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const DEFAULT_ROLE = 'viewer'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser?.id) {
      setProfile(null)
      return null
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, staff_id, active')
        .eq('id', authUser.id)
        .maybeSingle()

      if (error) {
        console.error('Failed to load profile:', error)
        setProfile(null)
        return null
      }

      setProfile(data ?? null)
      return data ?? null
    } catch (error) {
      console.error('Failed to load profile:', error)
      setProfile(null)
      return null
    }
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const nextUser = session?.user ?? null
        setUser(nextUser)
        await loadProfile(nextUser)
      } catch (error) {
        console.error('Failed to initialize auth session:', error)
        setUser(null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        const nextUser = session?.user ?? null
        setUser(nextUser)
        await loadProfile(nextUser)
      } catch (error) {
        console.error('Failed during auth state change:', error)
        setUser(session?.user ?? null)
        setProfile(null)
      } finally {
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [loadProfile])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Failed to sign out:', error)
    } finally {
      setUser(null)
      setProfile(null)
    }
  }

  const activeRole = profile?.active === false ? DEFAULT_ROLE : (profile?.role ?? DEFAULT_ROLE)
  const isAdmin = profile?.active !== false && profile?.role === 'admin'

  const role = activeRole

  return { user, profile, role, loading, signIn, signOut, isAdmin }
}
