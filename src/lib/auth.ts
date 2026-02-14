import { openUrl } from '@tauri-apps/plugin-opener';

export async function signInWithGoogle(signIn: any) {
  try {
    console.log('Starting Google OAuth flow...');
    
    // Create a sign-in attempt with OAuth strategy and redirect URL
    const signInAttempt = await signIn.create({
      strategy: 'oauth_google',
      redirectUrl: 'http://localhost:3000/oauth-callback',
    });

    console.log('SignIn attempt created:', signInAttempt);
    
    // Get the OAuth URL from firstFactorVerification
    const oauthUrl = signInAttempt.firstFactorVerification?.externalVerificationRedirectURL;

    if (!oauthUrl) {
      console.error('No OAuth URL found in response');
      throw new Error('Failed to get OAuth URL from Clerk');
    }

    console.log('Opening system browser with OAuth URL:', oauthUrl);

    // Open the OAuth URL in the user's default system browser
    await openUrl(oauthUrl);
    
    console.log('System browser opened successfully. User will be redirected back after authentication.');
  } catch (error) {
    console.error('Failed to initiate Google sign-in:', error);
    throw error;
  }
}
