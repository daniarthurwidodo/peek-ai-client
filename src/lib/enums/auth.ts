export enum AuthErrorMessage {
  RATE_LIMIT = 'Too many sign-in attempts. Please wait a few minutes and try again.',
  INVALID_URL = 'Configuration error: Invalid redirect URL. Please contact support.',
  NO_OAUTH_URL = 'Failed to get OAuth URL from Clerk',
  DEFAULT = 'Failed to sign in. Please try again.',
}

export enum AuthSuccessMessage {
  BROWSER_OPENED = 'System browser opened successfully. User will be redirected back after authentication.',
  OAUTH_STARTED = 'Starting Google OAuth flow...',
  SIGNING_OUT = 'Found existing session, signing out first...',
}
