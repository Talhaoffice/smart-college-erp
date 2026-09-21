import Card from './Card.jsx'

function PageIntro({ eyebrow, title, description, aside }) {
  return (
    <Card className="page-intro">
      <div className="page-intro-body">
        <div className="max-w-2xl">
          <p className="page-kicker">{eyebrow}</p>
          <h3 className="page-title">{title}</h3>
          <p className="page-copy">{description}</p>
        </div>

        {aside ? <div className="page-aside">{aside}</div> : null}
      </div>
    </Card>
  )
}

export default PageIntro
