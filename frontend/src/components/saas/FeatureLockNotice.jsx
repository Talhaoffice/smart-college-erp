import { ArrowRight, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../ui/Card.jsx'

function FeatureLockNotice({
  title = 'Feature locked',
  message = 'Your current plan does not allow this feature.',
  ctaLabel = null,
  ctaTo = '/admin/plan',
}) {
  return (
    <Card className="feature-lock-card">
      <div className="feature-lock-icon">
        <Lock size={18} />
      </div>
      <div className="feature-lock-copy">
        <p className="section-kicker">Feature Restricted</p>
        <h3 className="section-title mt-2">{title}</h3>
        <p className="section-copy">{message}</p>
      </div>
      {ctaLabel ? (
        <Link className="btn-secondary" to={ctaTo}>
          {ctaLabel}
          <ArrowRight size={16} />
        </Link>
      ) : null}
    </Card>
  )
}

export default FeatureLockNotice
