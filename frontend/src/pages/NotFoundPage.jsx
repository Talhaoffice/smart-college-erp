import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <div className="center-shell app-shell">
      <div className="card center-card">
        <p className="section-kicker">404</p>
        <h1 className="mt-2 text-[1.8rem] font-semibold text-slate-800">Page not found</h1>
        <p className="mt-3 text-sm text-slate-500">Go back to login and open the right section from there.</p>
        <Link to="/login" className="btn-primary mt-6">
          Go to Login
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
