import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SignOutButton, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { LayoutDashboard } from 'lucide-react';

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
});

function Dashboard() {
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if not signed in
    if (isLoaded && !isSignedIn) {
      navigate({ to: '/' });
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return null; // Will redirect via useEffect
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <LayoutDashboard size={28} color="#3b82f6" />
        <h1 style={{ margin: 0 }}>Dashboard</h1>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Welcome, {user.firstName || user.username || user.emailAddresses[0]?.emailAddress}!</p>
        <p style={{ color: '#666', fontSize: '14px' }}>
          User ID: {user.id}
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Your Profile</h2>
        <ul style={{ textAlign: 'left', maxWidth: '400px' }}>
          <li>Email: {user.emailAddresses[0]?.emailAddress}</li>
          <li>Name: {user.firstName} {user.lastName}</li>
          <li>Username: {user.username || 'Not set'}</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => window.location.reload()} 
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Refresh
        </button>
        
        <SignOutButton>
          <button style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Sign Out
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
