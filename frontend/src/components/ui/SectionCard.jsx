import Card from './Card.jsx'

function SectionCard({ id, eyebrow, title, description, actions, children, className = '' }) {
  return (
    <Card id={id} className={`section-card scroll-mt-24 ${className}`}>
      <div className="section-header">
        <div>
          {eyebrow ? <p className="section-kicker">{eyebrow}</p> : null}
          <h3 className="section-title mt-2">{title}</h3>
          {description ? (
            <p className="section-copy">{description}</p>
          ) : null}
        </div>

        {actions ? <div className="section-actions">{actions}</div> : null}
      </div>

      {children}
    </Card>
  )
}

export default SectionCard
