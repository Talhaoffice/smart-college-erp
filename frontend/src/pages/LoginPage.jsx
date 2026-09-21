import { AlertCircle, GraduationCap } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card.jsx'
import { useAlert } from '../context/AlertContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { normalizeApiError, validateRequiredFields } from '../lib/feedback.js'
import { roleHomePath } from '../lib/utils.js'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { showAlert } = useAlert()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!validateRequiredFields({ email: form.email, password: form.password })) {
      setError('Please fill all required fields.')
      showAlert({ type: 'warning', message: 'Please fill all required fields.' })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Invalid email format.')
      showAlert({ type: 'warning', message: 'Invalid email format.' })
      return
    }

    setLoading(true)
    setError('')

    try {
      const user = await login(
        {
          email: form.email,
          password: form.password,
        },
        { skipGlobalError: true },
      )
      showAlert({ type: 'success', message: 'Login successful' })
      navigate(roleHomePath(user.role), { replace: true })
    } catch (requestError) {
      setError(normalizeApiError(requestError, 'Invalid credentials.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell app-shell">
      <div className="auth-wrap">
        <div className="mb-5 px-1">
          <div className="auth-badge">
            <span className="auth-mark">
              <GraduationCap size={16} />
            </span>
            Smart College ERP
          </div>
          <h1 className="auth-title">Sign in</h1>
          <p className="auth-copy">Use your college email and password to continue.</p>
        </div>

        <Card className="section-card">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="form-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="you@college.edu"
                value={form.email}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="Enter your password"
                value={form.password}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
              />
            </div>

            {error ? (
              <div className="alert-error">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
