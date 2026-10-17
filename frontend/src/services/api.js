import axios from 'axios'
import { normalizeApiError } from '../lib/feedback.js'
import { pushAlert } from './alertService.js'

const baseURL = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.DEV ? 'http://127.0.0.1:8000/api' : '/api'
)

const api = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const userMessage = normalizeApiError(error)

    error.userMessage = userMessage

    if (error.config?.skipGlobalError !== true) {
      pushAlert({
        type: error.response?.status === 422 ? 'warning' : 'error',
        message: userMessage,
      })
    }

    return Promise.reject(error)
  },
)

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return
  }

  delete api.defaults.headers.common.Authorization
}

export default api
