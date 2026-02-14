import { cleanupQueryClient } from "./queryClient";
import { closeDatabase } from "./database";

export const cleanup = async () => {
  try {
    await cleanupQueryClient();
    await closeDatabase();
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};

export const registerCleanupHandlers = (cleanupFn: () => Promise<void>) => {
  window.addEventListener("beforeunload", () => {
    cleanupFn();
  });
};
