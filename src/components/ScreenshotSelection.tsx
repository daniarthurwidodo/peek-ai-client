import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

interface SelectionBox {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

interface ScreenshotSelectionProps {
  isActive: boolean;
}

export function ScreenshotSelection({ isActive }: ScreenshotSelectionProps) {
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);

  useEffect(() => {
    if (!isActive) {
      setSelectionBox(null);
      return;
    }

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'INPUT') {
        return;
      }

      setSelectionBox({
        startX: e.clientX,
        startY: e.clientY,
        currentX: e.clientX,
        currentY: e.clientY,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (selectionBox) {
        setSelectionBox({
          ...selectionBox,
          currentX: e.clientX,
          currentY: e.clientY,
        });
      }
    };

    const handleMouseUp = async () => {
      if (selectionBox) {
        const x = Math.min(selectionBox.startX, selectionBox.currentX);
        const y = Math.min(selectionBox.startY, selectionBox.currentY);
        const width = Math.abs(selectionBox.currentX - selectionBox.startX);
        const height = Math.abs(selectionBox.currentY - selectionBox.startY);
        
        setSelectionBox(null);
        
        if (width > 10 && height > 10) {
          try {
            const filepath = await invoke<string>('capture_screenshot', {
              x,
              y,
              width,
              height,
            });
            console.log('✓ Screenshot saved to:', filepath);
            alert(`Screenshot saved to:\n${filepath}`);
          } catch (err) {
            console.error('✗ Failed to capture screenshot:', err);
            alert('Failed to capture screenshot');
          }
        }
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isActive, selectionBox]);

  useEffect(() => {
    if (isActive) {
      document.body.style.cursor = 'crosshair';
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
      document.body.style.webkitUserSelect = 'auto';
    }
  }, [isActive]);

  if (!selectionBox) return null;

  return (
    <div
      className="screenshot-selection-box"
      style={{
        left: Math.min(selectionBox.startX, selectionBox.currentX),
        top: Math.min(selectionBox.startY, selectionBox.currentY),
        width: Math.abs(selectionBox.currentX - selectionBox.startX),
        height: Math.abs(selectionBox.currentY - selectionBox.startY),
      }}
    />
  );
}
