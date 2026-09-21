import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import api, { setAuthToken } from '../services/api.js'

const AuthContext = createContext(null)

const STORAGE_KEYS = {
  token: 'smart-college-erp-token',
  user: 'smart-college-erp-user',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.token)
    const storedUser = localStorage.getItem(STORAGE_KEYS.user)

    if (!storedToken) {
      setReady(true)
      return
    }

    setAuthToken(storedToken)
    setToken(storedToken)

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    api
      .get('/me')
      .then(({ data }) => {
        setUser(data.data)
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.data))
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEYS.token)
        localStorage.removeItem(STORAGE_KEYS.user)
        setAuthToken(null)
        setToken(null)
        setUser(null)
      })
      .finally(() => setReady(true))
  }, [])

  async function login(credentials, config = {}) {
    const { data } = await api.post('/login', credentials, config)

    setAuthToken(data.token)
    setToken(data.token)
    setUser(data.user)

    localStorage.setItem(STORAGE_KEYS.token, data.token)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user))

    return data.user
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch {
      // Ignore logout transport errors and clear local state anyway.
    } finally {
      localStorage.removeItem(STORAGE_KEYS.token)
      localStorage.removeItem(STORAGE_KEYS.user)
      setAuthToken(null)
      setToken(null)
      setUser(null)
    }
  }

  async function refreshUser() {
    const { data } = await api.get('/me')
    setUser(data.data)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.data))
    return data.data
  }

  const value = {
    user,
    token,
    ready,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
