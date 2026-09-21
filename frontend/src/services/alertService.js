let alertHandler = null

export function registerAlertHandler(handler) {
  alertHandler = handler
}

export function unregisterAlertHandler(handler) {
  if (alertHandler === handler) {
    alertHandler = null
  }
}

export function pushAlert(payload) {
  if (typeof alertHandler === 'function') {
    alertHandler(payload)
  }
}
