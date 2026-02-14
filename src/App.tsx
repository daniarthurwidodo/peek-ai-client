import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { useWindowDrag } from "./hooks/useWindowDrag";
import { LogoLinks } from "./components/LogoLinks";
import { useGoogleSignIn, useSession } from "./hooks/useAuth";
import { useEffect } from "react";
import { useAppMode } from "./hooks/useAppMode";
import { AppHeader } from "./components/AppHeader";
import { AppModeControls } from "./components/AppModeControls";
import { AuthSection } from "./components/AuthSection";
import { ScreenshotSelection } from "./components/ScreenshotSelection";
import { CloseButton } from "./components/CloseButton";
import "./App.css";

function App() {
  const { isFullscreen, isScreenshotMode, toggleFullscreen, toggleScreenshotMode } = useAppMode();
  useWindowDrag(!isFullscreen && !isScreenshotMode);
  
  const { isSignedIn, user, isLoaded } = useUser();
  const navigate = useNavigate();
  const signInMutation = useGoogleSignIn();
  const session = useSession();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate({ to: '/dashboard' });
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleNavigateToDashboard = () => {
    navigate({ to: '/dashboard' });
  };

  console.log("App render - Clerk state:", {
    isLoaded,
    isSignedIn,
    user: user ? { id: user.id, firstName: user.firstName, username: user.username } : null,
    cachedSession: session
  });

  return (
    <>
      <CloseButton />
      <ScreenshotSelection isActive={isScreenshotMode} />
      
      <main className="container">
        <AppHeader />

        <AppModeControls
          isFullscreen={isFullscreen}
          isScreenshotMode={isScreenshotMode}
          onToggleFullscreen={toggleFullscreen}
          onToggleScreenshotMode={toggleScreenshotMode}
        />
        
        <div style={{ marginBottom: "20px" }}>
          <AuthSection
            isLoaded={isLoaded}
            isSignedIn={isSignedIn ?? false}
            user={user}
            signInMutation={signInMutation}
            session={session}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        </div>

        <LogoLinks />
        <p>Click on the Tauri, Vite, and React logos to learn more.</p>
      </main>
    </>
  );
}

export default App;
