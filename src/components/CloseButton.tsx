import { getCurrentWindow } from "@tauri-apps/api/window";
import { XIcon } from "@/components/ui/x";

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
      <XIcon size={16} />
    </button>
  );
}
