'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

type AuthAction = 
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'LOGIN_SUCCESS'; user: User; token: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; user: User }

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.loading }
      
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.user,
        token: action.token,
        isLoading: false,
        isAuthenticated: true
      }
      
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false
      }
      
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.user
      }
      
    default:
      return state
  }
}

const AuthContext = createContext<{
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
} | null>(null)

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Carica token salvato all'avvio
  useEffect(() => {
    // Controlla se siamo nel browser
    if (typeof window === 'undefined') {
      dispatch({ type: 'SET_LOADING', loading: false })
      return
    }

    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser)
        dispatch({ type: 'LOGIN_SUCCESS', user, token: savedToken })
      } catch (error) {
        console.error('Errore nel caricamento dati utente:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        dispatch({ type: 'SET_LOADING', loading: false })
      }
    } else {
      dispatch({ type: 'SET_LOADING', loading: false })
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      // Salva in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
      }

      dispatch({ type: 'LOGIN_SUCCESS', user: data.user, token: data.token })
      
      return { success: true }
    } catch (error) {
      console.error('Errore login:', error)
      return { success: false, error: 'Errore di connessione' }
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        return { success: false, error: result.error }
      }

      // Salva in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', result.token)
        localStorage.setItem('auth_user', JSON.stringify(result.user))
      }

      dispatch({ type: 'LOGIN_SUCCESS', user: result.user, token: result.token })
      
      return { success: true }
    } catch (error) {
      console.error('Errore registrazione:', error)
      return { success: false, error: 'Errore di connessione' }
    }
  }

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve essere usato dentro AuthProvider')
  }
  return context
}