const FALLBACK_MESSAGES = {
  generic: 'Something went wrong.',
  server: 'Server error, please try again.',
  validation: 'Please fill all required fields.',
  accessDenied: 'Access denied.',
  invalidCredentials: 'Invalid credentials.',
  planRestricted: 'Your current plan does not allow this feature.',
}

function firstValidationMessage(errors) {
  const firstFieldErrors = Object.values(errors ?? {}).find(
    (value) => Array.isArray(value) && value.length,
  )

  return firstFieldErrors?.[0] ?? null
}

export function normalizeApiError(error, fallback = FALLBACK_MESSAGES.generic) {
  const status = error?.response?.status
  const message = error?.response?.data?.message
  const validationMessage = firstValidationMessage(error?.response?.data?.errors)
  const rawMessage = String(validationMessage ?? message ?? '').trim().toLowerCase()

  if (validationMessage) {
    return validationMessage
  }

  if (!status) {
    return 'Unable to connect. Please check your internet connection and try again.'
  }

  if (status === 401) {
    return FALLBACK_MESSAGES.invalidCredentials
  }

  if (status === 403) {
    if (rawMessage.includes('subscription') || rawMessage.includes('plan') || rawMessage.includes('feature')) {
      return FALLBACK_MESSAGES.planRestricted
    }

    return FALLBACK_MESSAGES.accessDenied
  }

  if (status === 404) {
    return message || 'The requested resource was not found.'
  }

  if (status === 422) {
    if (rawMessage.includes('email')) {
      return 'Invalid email format.'
    }

    if (rawMessage.includes('password') || rawMessage.includes('required') || rawMessage.includes('invalid')) {
      return validationMessage || message || FALLBACK_MESSAGES.validation
    }

    return message || FALLBACK_MESSAGES.validation
  }

  if (status >= 500) {
    return FALLBACK_MESSAGES.server
  }

  return message || fallback
}

export function validateRequiredFields(fields) {
  return Object.values(fields).every((value) => String(value ?? '').trim() !== '')
}
