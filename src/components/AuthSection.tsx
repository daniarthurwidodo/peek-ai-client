import { SignOutButton, useUser } from "@clerk/clerk-react";
import { UseMutationResult } from "@tanstack/react-query";
import { SessionChecker } from "./SessionChecker";

type UserType = ReturnType<typeof useUser>['user'];

interface AuthSectionProps {
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  user: UserType;
  signInMutation: UseMutationResult<{ success: boolean; alreadySignedIn: boolean }, any, void, unknown>;
  session: any;
  onNavigateToDashboard: () => void;
}

export function AuthSection({
  isLoaded,
  isSignedIn,
  user,
  signInMutation,
  session,
  onNavigateToDashboard,
}: AuthSectionProps) {
  if (!isLoaded) {
    return <p>Loading authentication...</p>;
  }

  if (isSignedIn && user) {
    return (
      <div>
        <p>Hello, {user.firstName || user.username}!</p>
        <div className="auth-button-group">
          <button onClick={() => window.location.reload()}>Refresh</button>
          <SignOutButton>
            <button onClick={() => console.log("Sign out clicked")}>Sign Out</button>
          </SignOutButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="auth-button-group">
        <button 
          onClick={() => signInMutation.mutate()}
          disabled={signInMutation.isPending}
        >
          {signInMutation.isPending ? 'Signing in...' : 'Sign In with Google'}
        </button>
        
        <button onClick={() => window.location.reload()}>Refresh</button>
      </div>
      
      {signInMutation.isError && (
        <p className="error-message">
          {signInMutation.error?.message || 'Failed to sign in'}
        </p>
      )}

      <SessionChecker 
        session={session}
        onNavigateToDashboard={onNavigateToDashboard}
      />
    </div>
  );
}
