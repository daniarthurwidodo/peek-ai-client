# Deep Link OAuth Setup for Tauri

## What Changed

Your Tauri app now uses a custom protocol scheme (`peek-ai://`) for OAuth callbacks instead of `http://localhost:3000`. This allows the browser to redirect back to your desktop app after authentication.

## Setup Steps

### 1. Update Clerk Dashboard

1. Go to your Clerk Dashboard: https://dashboard.clerk.com
2. Select your application
3. Navigate to **User & Authentication** → **Social Connections** → **Google**
4. In the **Authorized redirect URIs** section, add:
   ```
   peek-ai://oauth-callback
   ```
5. Save the changes

### 2. Rebuild Your Tauri App

Since we modified Rust dependencies and Tauri configuration, you need to rebuild:

```bash
npm run tauri dev
```

Or for production build:
```bash
npm run tauri build
```

## How It Works

1. User clicks "Sign In with Google" in your Tauri app
2. System browser opens with Google OAuth page
3. User authenticates with Google
4. Google redirects to Clerk's callback URL
5. Clerk processes the authentication
6. Clerk redirects to `peek-ai://oauth-callback?created_session_id=...`
7. Operating system recognizes the `peek-ai://` protocol and opens your Tauri app
8. Your app receives the deep link event with the session ID
9. App navigates to `/oauth-callback` route internally
10. OAuth callback component processes the session and redirects to dashboard

## Testing

1. Start your app: `npm run tauri dev`
2. Click "Sign In with Google"
3. Complete authentication in the browser
4. The browser should automatically redirect back to your Tauri app
5. You should be redirected to the dashboard

## Troubleshooting

### Deep link not working on Windows
- Make sure you've built the app at least once (not just dev mode)
- The protocol registration happens during installation/first run

### Deep link not working on macOS
- Check that the app is properly signed
- Try running a production build

### Deep link not working on Linux
- Ensure the `.desktop` file is properly installed
- Check system logs for protocol handler registration

### Still redirecting to browser
- Verify the redirect URL in Clerk dashboard is exactly: `peek-ai://oauth-callback`
- Check browser console for any errors
- Ensure the deep-link plugin is properly initialized (check Tauri logs)

## Files Modified

- `src-tauri/tauri.conf.json` - Added deep link configuration
- `src-tauri/Cargo.toml` - Added deep-link plugin dependency
- `src-tauri/src/lib.rs` - Registered deep-link plugin
- `src-tauri/capabilities/default.json` - Added deep-link permissions
- `src/lib/auth.ts` - Changed redirect URL to custom protocol
- `src/main.tsx` - Added deep link event handler
- `package.json` - Added @tauri-apps/plugin-deep-link
