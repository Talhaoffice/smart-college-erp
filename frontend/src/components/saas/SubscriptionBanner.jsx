import Badge from '../ui/Badge.jsx'
import Card from '../ui/Card.jsx'
import { formatDate } from '../../lib/utils.js'

function SubscriptionBanner({ organization, subscription }) {
  const currentOrganization = organization || {}
  const currentSubscription = subscription || {}

  if (!organization || !subscription) {
    return null
  }

  return (
    <Card className="section-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="section-kicker">Subscription</p>
          <h3 className="section-title mt-2">
            {currentOrganization?.name || 'Organization'} /{' '}
            {currentSubscription?.plan_label || 'No plan'}
          </h3>
          <p className="section-copy mt-2 max-w-none">
            Current billing state for this organization, including expiry, payment
            status, and renewal reminders.
          </p>
          <div className="meta-row">
            <span>Expires: {formatDate(currentSubscription?.expiry_date)}</span>
            <span>Auto-renew: {currentSubscription?.auto_renew ? 'On' : 'Off'}</span>
            <span>Payment method: {currentSubscription?.payment_method || 'Not saved'}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge value={currentSubscription?.plan_label || 'No plan'} />
          <Badge value={currentSubscription?.status || 'unknown'} />
          <Badge value={currentSubscription?.payment_status || 'unknown'} />
        </div>
      </div>

      {currentSubscription?.alerts?.length ? (
        <div className="stack-sm mt-5">
          {currentSubscription?.alerts?.map((alert) => (
            <div
              key={alert}
              className={
                alert.toLowerCase().includes('payment failed')
                  ? 'alert-error'
                  : 'muted-panel'
              }
            >
              {alert}
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  )
}

export default SubscriptionBanner
