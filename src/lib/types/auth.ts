export interface AuthSession {
  userId: string;
  sessionId: string;
  expiresAt: Date;
}

export interface OAuthConfig {
  redirectUrl: string;
  strategy: 'oauth_google' | 'oauth_github';
}

export interface SignInAttempt {
  id: string;
  status: string;
  firstFactorVerification?: {
    externalVerificationRedirectURL?: string;
  };
}
