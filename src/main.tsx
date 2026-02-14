import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { router } from "./lib/router";
import { queryClient } from "./lib/queryClient";
import { cleanup, registerCleanupHandlers } from "./lib/cleanup";
import { 
  isTauriApp, 
  positionWindowBottomRight, 
  setupCloseHandler, 
  setupDeepLinkHandler 
} from "./lib/tauri";
import "./App.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key - check your .env file");
  throw new Error("Missing Clerk Publishable Key");
}

registerCleanupHandlers(cleanup);

if (isTauriApp()) {
  positionWindowBottomRight();
  setupCloseHandler(cleanup);
  setupDeepLinkHandler();
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools 
        initialIsOpen={false}
        buttonPosition="bottom-right"
        position="bottom"
      />
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <RouterProvider router={router} />
      </ClerkProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
