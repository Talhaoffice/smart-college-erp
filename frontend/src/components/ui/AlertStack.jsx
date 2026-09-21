import { AlertCircle, AlertTriangle, CheckCircle2, X } from 'lucide-react'

const alertMeta = {
  success: {
    icon: CheckCircle2,
    className: 'alert-success',
  },
  warning: {
    icon: AlertTriangle,
    className: 'alert-warning',
  },
  error: {
    icon: AlertCircle,
    className: 'alert-error',
  },
}

function AlertStack({ alerts, onDismiss }) {
  if (!alerts.length) {
    return null
  }

  return (
    <div className="alert-stack" role="status" aria-live="polite">
      {alerts.map((alert) => {
        const meta = alertMeta[alert.type] ?? alertMeta.error
        const Icon = meta.icon

        return (
          <div key={alert.id} className={`global-alert ${meta.className}`}>
            <div className="flex items-start gap-3">
              <Icon size={18} className="mt-0.5 shrink-0" />
              <span>{alert.message}</span>
            </div>
            <button
              type="button"
              className="alert-dismiss"
              aria-label="Dismiss alert"
              onClick={() => onDismiss(alert.id)}
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default AlertStack
