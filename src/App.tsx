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
import { Card, CardContent, CardDescription, CardFooter } from "./components/ui/card";
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
      
      <main className="container mx-auto p-6 max-w-4xl">
        <AppHeader />

        <Card className="mb-6">
          <CardContent className="pt-6">
            <AppModeControls
              isFullscreen={isFullscreen}
              isScreenshotMode={isScreenshotMode}
              onToggleFullscreen={toggleFullscreen}
              onToggleScreenshotMode={toggleScreenshotMode}
            />
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <AuthSection
              isLoaded={isLoaded}
              isSignedIn={isSignedIn ?? false}
              user={user}
              signInMutation={signInMutation}
              session={session}
              onNavigateToDashboard={handleNavigateToDashboard}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <LogoLinks />
          </CardContent>
          <CardFooter>
            <CardDescription>
              Click on the Tauri, Vite, and React logos to learn more.
            </CardDescription>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}

export default App;
