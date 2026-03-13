import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null; isAuthenticated: boolean; isLoading: boolean; error: string | null
  setUser:    (user: User | null) => void
  setLoading: (loading: boolean)  => void
  setError:   (error: string | null) => void
  clearAuth:  () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, isAuthenticated: false, isLoading: true, error: null,
      setUser:    (user)    => set({ user, isAuthenticated: !!user, isLoading: false, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError:   (error)   => set({ error, isLoading: false }),
      clearAuth:  ()        => set({ user: null, isAuthenticated: false, isLoading: false, error: null }),
    }),
    {
      name: 'kommunity-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    },
  ),
)
