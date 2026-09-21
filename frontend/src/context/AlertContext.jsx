import { createContext, useContext, useEffect, useRef, useState } from 'react'
import AlertStack from '../components/ui/AlertStack.jsx'
import { pushAlert, registerAlertHandler, unregisterAlertHandler } from '../services/alertService.js'

const AlertContext = createContext(null)

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([])
  const timersRef = useRef(new Map())

  function dismissAlert(id) {
    const timer = timersRef.current.get(id)

    if (timer) {
      window.clearTimeout(timer)
      timersRef.current.delete(id)
    }

    setAlerts((current) => current.filter((alert) => alert.id !== id))
  }

  function showAlert({ type = 'success', message, duration = 4000 }) {
    if (!message) {
      return
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setAlerts((current) => [...current, { id, type, message }])

    const timer = window.setTimeout(() => {
      dismissAlert(id)
    }, duration)

    timersRef.current.set(id, timer)
  }

  useEffect(() => {
    registerAlertHandler(showAlert)

    return () => {
      unregisterAlertHandler(showAlert)
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
      timersRef.current.clear()
    }
  }, [])

  const value = {
    showAlert,
    dismissAlert,
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertStack alerts={alerts} onDismiss={dismissAlert} />
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const context = useContext(AlertContext)

  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider')
  }

  return context
}

export { pushAlert }
