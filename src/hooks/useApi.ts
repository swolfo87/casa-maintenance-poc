import { useAuth } from '@/contexts/AuthContext'

export function useApi() {
  const { state: authState } = useAuth()

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Aggiungi token se autenticato
    if (authState.token) {
      headers['Authorization'] = `Bearer ${authState.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  return { apiCall }
}