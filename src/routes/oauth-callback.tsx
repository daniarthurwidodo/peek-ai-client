import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useClerk } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/oauth-callback')({
  component: OAuthCallback,
});

function OAuthCallback() {
  const clerk = useClerk();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const createdSessionId = searchParams.get('created_session_id');
        
        console.log('OAuth callback received:', {
          search: window.location.search,
          hash: window.location.hash,
          createdSessionId,
          params: Object.fromEntries(searchParams.entries())
        });

        // If we have a created_session_id, the OAuth flow was successful
        if (createdSessionId) {
          console.log('OAuth successful! Session ID:', createdSessionId);
          
          // Wait a moment for Clerk to process the session
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Redirect to dashboard
          console.log('Redirecting to dashboard...');
          navigate({ to: '/dashboard' });
          return;
        }

        // Otherwise, wait for Clerk to process the callback
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if user is now signed in
        if (clerk.user) {
          console.log('User signed in successfully:', (clerk.user as any).id);
          navigate({ to: '/dashboard' });
        } else {
          // If not signed in yet, wait a bit more
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          if (clerk.user) {
            console.log('User signed in after delay:', (clerk.user as any).id);
            navigate({ to: '/dashboard' });
          } else {
            throw new Error('Authentication completed but user not found');
          }
        }
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleOAuthCallback();
  }, [clerk, navigate]);

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate({ to: '/' })}>
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Completing sign in...</h2>
      <p>Please wait while we complete your authentication.</p>
    </div>
  );
}
