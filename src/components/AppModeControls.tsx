interface AppModeControlsProps {
  isFullscreen: boolean;
  isScreenshotMode: boolean;
  onToggleFullscreen: () => void;
  onToggleScreenshotMode: () => void;
}

export function AppModeControls({
  isFullscreen,
  isScreenshotMode,
  onToggleFullscreen,
  onToggleScreenshotMode,
}: AppModeControlsProps) {
  return (
    <div className="app-mode-controls">
      <button 
        onClick={onToggleFullscreen}
        className={`mode-button ${isFullscreen ? 'mode-button-active' : ''}`}
      >
        {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      </button>
      
      <button 
        onClick={onToggleScreenshotMode}
        className={`mode-button mode-button-screenshot ${isScreenshotMode ? 'mode-button-active' : ''}`}
      >
        {isScreenshotMode ? 'Disable Screenshot Mode' : 'Enable Screenshot Mode'}
      </button>
    </div>
  );
}
