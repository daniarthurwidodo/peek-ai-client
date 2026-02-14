import { openUrl } from '@tauri-apps/plugin-opener';
import { AuthErrorMessage, AuthSuccessMessage } from './enums/auth';

export async function signInWithGoogle(signIn: any, clerk: any) {
  try {
    console.log(AuthSuccessMessage.OAUTH_STARTED);
    
    // Check if there's a stale session and sign out first
    try {
      if (clerk.session) {
        console.log(AuthSuccessMessage.SIGNING_OUT);
        await clerk.signOut();
        // Wait a moment for sign out to complete
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (signOutError) {
      console.log('Sign out error (continuing anyway):', signOutError);
    }
    
    // Create a sign-in attempt with OAuth strategy
    // Use HTTP redirect URL for Clerk, then handle deep link in Tauri
    const signInAttempt = await signIn.create({
      strategy: 'oauth_google',
      redirectUrl: 'http://localhost:3000/oauth-callback',
    });

    console.log('SignIn attempt created:', signInAttempt);
    
    // Get the OAuth URL from firstFactorVerification
    const oauthUrl = signInAttempt.firstFactorVerification?.externalVerificationRedirectURL;

    if (!oauthUrl) {
      console.error('No OAuth URL found in response');
      throw new Error(AuthErrorMessage.NO_OAUTH_URL);
    }

    console.log('Opening system browser with OAuth URL:', oauthUrl);

    // Open the OAuth URL in the user's default system browser
    await openUrl(oauthUrl);
    
    console.log(AuthSuccessMessage.BROWSER_OPENED);
  } catch (error: any) {
    console.error('Failed to initiate Google sign-in:', error);
    
    // Handle specific error cases
    let errorMessage = AuthErrorMessage.DEFAULT;
    
    if (error.message?.includes('already signed in')) {
      // User is already signed in, this is not really an error
      console.log('User is already signed in');
      throw new Error("You're already signed in.");
    } else if (error.status === 429 || error.message?.includes('429')) {
      errorMessage = AuthErrorMessage.RATE_LIMIT;
    } else if (error.message?.includes('invalid_url_scheme')) {
      errorMessage = AuthErrorMessage.INVALID_URL;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
}
