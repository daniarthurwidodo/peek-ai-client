import { getCurrentWindow } from "@tauri-apps/api/window";
import { listen } from "@tauri-apps/api/event";
import { onOpenUrl } from "@tauri-apps/plugin-deep-link";

export const isTauriApp = () => !!(window as any).__TAURI__;

export const positionWindowBottomRight = async () => {
  try {
    const appWindow = getCurrentWindow();
    const windowSize = await appWindow.outerSize();
    
    if (window.screen) {
      const screenWidth = window.screen.availWidth;
      const screenHeight = window.screen.availHeight;
      const screenX = window.screen.availLeft || 0;
      const screenY = window.screen.availTop || 0;
      
      const padding = 20;
      const x = screenX + screenWidth - windowSize.width - padding;
      const y = screenY + screenHeight - windowSize.height - padding;
      
      await appWindow.setPosition({ x, y });
    }
  } catch (error) {
    console.error("Failed to position window:", error);
  }
};

export const setupCloseHandler = async (onClose: () => Promise<void>) => {
  try {
    await listen("tauri://close-requested", onClose);
  } catch (error) {
    console.error("Failed to setup close handler:", error);
  }
};

export const setupDeepLinkHandler = async () => {
  try {
    onOpenUrl((urls) => {
      urls.forEach((url) => {
        if (url.startsWith("peek-ai://oauth-callback")) {
          const urlObj = new URL(url);
          const params = new URLSearchParams(urlObj.search);
          const queryString = params.toString();
          window.location.href = `/oauth-callback${queryString ? '?' + queryString : ''}`;
        }
      });
    });
  } catch (error) {
    console.error("Failed to setup deep link handler:", error);
  }
};

export const closeApp = async (onCleanup?: () => Promise<void>) => {
  try {
    // Run cleanup operations if provided
    if (onCleanup) {
      await onCleanup();
    }
    
    // Close the window
    const appWindow = getCurrentWindow();
    await appWindow.close();
  } catch (error) {
    console.error("Failed to close app:", error);
  }
};
