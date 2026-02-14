# Selenium Tests

## Setup

Dependencies are already installed. Tests use Chrome in headless mode.

## Running Tests

1. Start your Tauri app in dev mode:
   ```bash
   npm run tauri dev
   ```

2. In another terminal, run the tests:
   ```bash
   npm run test:selenium
   ```

## Test Files

- `app.test.ts` - Test suite with Jest-like syntax (for reference)
- `run-tests.ts` - Standalone test runner (currently used)
- `setup.ts` - Test utilities and helpers

## What's Tested

- App loads and displays welcome message
- Sign in button is visible when not authenticated
- Page structure is correct

## Notes

- Tests run against `http://localhost:1420` (Tauri dev server)
- Chrome runs in headless mode for CI/CD compatibility
- Make sure the app is running before executing tests
