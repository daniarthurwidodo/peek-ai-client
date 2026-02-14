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
        
        console.log('OAuth callback received:', {
          search: window.location.search,
          hash: window.location.hash,
          params: Object.fromEntries(searchParams.entries())
        });

        // Clerk handles the OAuth callback automatically through the ClerkProvider
        // We just need to wait a moment for it to process
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if user is now signed in
        if (clerk.user) {
          console.log('User signed in successfully:', (clerk.user as any).id);
          navigate({ to: '/' });
        } else {
          // If not signed in yet, wait a bit more
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          if (clerk.user) {
            console.log('User signed in after delay:', (clerk.user as any).id);
            navigate({ to: '/' });
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
