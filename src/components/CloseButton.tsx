import { getCurrentWindow } from "@tauri-apps/api/window";

export function CloseButton() {
  const handleClose = async () => {
    const appWindow = getCurrentWindow();
    await appWindow.close();
  };

  return (
    <button
      onClick={handleClose}
      className="close-button"
      aria-label="Close window"
      title="Close"
    >
      ✕
    </button>
  );
}
