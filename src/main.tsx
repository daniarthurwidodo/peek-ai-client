import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { closeDatabase } from "./lib/database";
import "./App.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log("🚀 Application starting...");
console.log("Environment variables:", import.meta.env);
console.log("Clerk Publishable Key:", PUBLISHABLE_KEY);

if (!PUBLISHABLE_KEY) {
  console.error("❌ Missing Clerk Publishable Key - check your .env file");
  throw new Error("Missing Clerk Publishable Key");
}

console.log("✓ Initializing Clerk with key:", PUBLISHABLE_KEY);

const router = createRouter({ routeTree });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Graceful shutdown handler
const cleanup = async () => {
  console.log("🔄 Application shutting down gracefully...");
  
  try {
    // Cancel all ongoing queries
    await queryClient.cancelQueries();
    
    // Clear query cache
    queryClient.clear();
    
    // Close database connection
    await closeDatabase();
    
    console.log("✓ Cleanup completed successfully");
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  }
};

// Register cleanup handlers
window.addEventListener("beforeunload", () => {
  cleanup();
});

// Handle Tauri-specific close event
if ((window as any).__TAURI__) {
  import("@tauri-apps/api/event").then(({ listen }) => {
    listen("tauri://close-requested", async () => {
      await cleanup();
    });
  });
}

console.log("✓ Application initialized successfully");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <RouterProvider router={router} />
      </ClerkProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
