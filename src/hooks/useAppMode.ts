import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCurrentWindow } from '@tauri-apps/api/window';
import type { AppModeState } from '../lib/types/app';

const APP_MODE_KEY = ['appMode'];

// Get initial state
const getAppMode = (): AppModeState => {
  return {
    isFullscreen: false,
    isScreenshotMode: false,
  };
};

export function useAppMode() {
  const queryClient = useQueryClient();

  // Query for app mode state
  const { data: appMode } = useQuery({
    queryKey: APP_MODE_KEY,
    queryFn: getAppMode,
    staleTime: Infinity,
  });

  // Mutation to toggle fullscreen
  const toggleFullscreenMutation = useMutation({
    mutationFn: async () => {
      const window = getCurrentWindow();
      const currentState = queryClient.getQueryData<AppModeState>(APP_MODE_KEY);
      const newFullscreenState = !currentState?.isFullscreen;
      await window.setFullscreen(newFullscreenState);
      return newFullscreenState;
    },
    onSuccess: (newFullscreenState) => {
      queryClient.setQueryData<AppModeState>(APP_MODE_KEY, (old) => ({
        ...old!,
        isFullscreen: newFullscreenState,
      }));
    },
    onError: (error) => {
      console.error('Failed to toggle fullscreen:', error);
    },
  });

  // Mutation to toggle screenshot mode
  const toggleScreenshotModeMutation = useMutation({
    mutationFn: async () => {
      const currentState = queryClient.getQueryData<AppModeState>(APP_MODE_KEY);
      return !currentState?.isScreenshotMode;
    },
    onSuccess: (newScreenshotMode) => {
      queryClient.setQueryData<AppModeState>(APP_MODE_KEY, (old) => ({
        ...old!,
        isScreenshotMode: newScreenshotMode,
      }));
    },
  });

  return {
    isFullscreen: appMode?.isFullscreen ?? false,
    isScreenshotMode: appMode?.isScreenshotMode ?? false,
    toggleFullscreen: toggleFullscreenMutation.mutate,
    toggleScreenshotMode: toggleScreenshotModeMutation.mutate,
    isTogglingFullscreen: toggleFullscreenMutation.isPending,
    isTogglingScreenshotMode: toggleScreenshotModeMutation.isPending,
  };
}
