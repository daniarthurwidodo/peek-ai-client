import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function useWindowDrag(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;
    
    const appWindow = getCurrentWindow();
    
    const handleMouseDown = (e: MouseEvent) => {
      // Don't drag if clicking on interactive elements
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' ||
        target.closest('[data-tanstack-query-devtools]') || // TanStack Query DevTools
        target.closest('button') // Any button element
      ) {
        return;
      }
      appWindow.startDragging();
    };

    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [enabled]);
}
