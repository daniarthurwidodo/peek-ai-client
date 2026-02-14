import { SignOutButton, useUser, useSignIn } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { useWindowDrag } from "./hooks/useWindowDrag";
import { LogoLinks } from "./components/LogoLinks";
import { GreetForm } from "./components/GreetForm";
import { signInWithGoogle } from "./lib/auth";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  useWindowDrag();
  const { isSignedIn, user, isLoaded } = useUser();
  const { signIn } = useSignIn();
  const navigate = useNavigate();
  const [signInError, setSignInError] = useState<string | null>(null);

  // Redirect to dashboard if user is signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate({ to: '/dashboard' });
    }
  }, [isLoaded, isSignedIn, navigate]);

  console.log("App render - Clerk state:", {
    isLoaded,
    isSignedIn,
    user: user ? { id: user.id, firstName: user.firstName, username: user.username } : null
  });

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>
      
      <div style={{ marginBottom: "20px" }}>
        {!isLoaded ? (
          <p>Loading authentication...</p>
        ) : isSignedIn ? (
          <div>
            <p>Hello, {user.firstName || user.username}!</p>
            <SignOutButton>
              <button onClick={() => console.log("Sign out clicked")}>Sign Out</button>
            </SignOutButton>
          </div>
        ) : (
          <div>
            <button onClick={async () => {
              console.log("Sign in clicked");
              setSignInError(null);
              
              if (!signIn) {
                console.error("SignIn not loaded");
                setSignInError("Authentication system not ready. Please try again.");
                return;
              }
              
              try {
                await signInWithGoogle(signIn);
              } catch (error: any) {
                console.error("Sign in error:", error);
                
                // Handle specific error cases
                if (error.message?.includes("already signed in")) {
                  setSignInError("You're already signed in. Please refresh the page.");
                } else {
                  setSignInError(error.message || "Failed to sign in. Please try again.");
                }
              }
            }}>
              Sign In with Google
            </button>
            
            {signInError && (
              <p style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>
                {signInError}
              </p>
            )}
          </div>
        )}
      </div>

      <LogoLinks />
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>
      <GreetForm />
    </main>
  );
}

export default App;
