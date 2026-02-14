# Google OAuth Setup Guide

## What Changed

The sign-in flow now opens Google OAuth in your default browser instead of using a modal. When users click "Sign In with Google", it will:

1. Open their default browser with Google's OAuth page
2. After authentication, redirect back to the Tauri app
3. Complete the sign-in process automatically

## Clerk Configuration Required

To enable Google OAuth, you need to configure it in your Clerk dashboard:

1. Go to https://dashboard.clerk.com
2. Select your application
3. Navigate to "User & Authentication" → "Social Connections"
4. Enable "Google" as a social provider
5. Add the following redirect URL:
   - `http://localhost:1420/oauth-callback` (for development)
   - Your production URL + `/oauth-callback` (for production)

## Files Modified

- `src/App.tsx` - Updated sign-in button to use custom Google OAuth flow
- `src/lib/auth.ts` - New file with Google OAuth logic
- `src/routes/oauth-callback.tsx` - New route to handle OAuth callback

## Testing

1. Run your Tauri app: `bun run tauri dev`
2. Click "Sign In with Google"
3. Your browser should open with Google's sign-in page
4. After signing in, you'll be redirected back to the app
5. The app should show you as signed in

## Notes

- The `@tauri-apps/plugin-opener` is already configured in your project
- Make sure Google OAuth is enabled in your Clerk dashboard
- The redirect URL must match exactly what's configured in Clerk
