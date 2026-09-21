import Card from './Card.jsx'

function StatCard({ label, value, hint, icon: Icon, accent = 'sky' }) {
  const accentClass = {
    sky: 'stat-icon-accent',
    amber: 'stat-icon-sand',
    emerald: 'stat-icon-olive',
    rose: 'stat-icon-clay',
  }[accent]

  return (
    <Card className="stat-card" hoverable>
      <div className="stat-row">
        <div>
          <p className="tiny-label">{label}</p>
          <p className="stat-value">{value}</p>
          {hint ? <p className="stat-hint">{hint}</p> : null}
        </div>

        <div className={`stat-icon ${accentClass}`}>
          <Icon size={24} />
        </div>
      </div>
    </Card>
  )
}

export default StatCard
