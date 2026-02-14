import { useState } from "react";

interface SessionCheckerProps {
  session: any;
  onNavigateToDashboard: () => void;
}

export function SessionChecker({ session, onNavigateToDashboard }: SessionCheckerProps) {
  const [sessionIdInput, setSessionIdInput] = useState("");
  const [sessionError, setSessionError] = useState("");

  const handleCheckSession = () => {
    setSessionError("");
    
    if (!sessionIdInput.trim()) {
      setSessionError("Please enter a session ID");
      return;
    }

    const cachedSession = session as any;
    if (cachedSession && cachedSession.userId === sessionIdInput.trim()) {
      console.log("Session ID matches! Redirecting to dashboard...");
      onNavigateToDashboard();
    } else {
      setSessionError("Invalid session ID. Please sign in.");
    }
  };

  return (
    <div className="session-checker">
      <p className="session-checker-label">
        Or check existing session:
      </p>
      <div className="session-checker-input-group">
        <input
          type="text"
          placeholder="Enter session ID"
          value={sessionIdInput}
          onChange={(e) => setSessionIdInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheckSession()}
          className="session-input"
        />
        <button onClick={handleCheckSession}>
          Check Session
        </button>
      </div>
      {sessionError && (
        <p className="error-message session-error">
          {sessionError}
        </p>
      )}
    </div>
  );
}
