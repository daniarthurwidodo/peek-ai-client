# AI Interview Assistant

A desktop application that helps users prepare for interviews by capturing screenshots of interview questions and providing AI-powered explanations and feedback.

## Features

- **Google OAuth Authentication** - Secure login using your Google account
- **Screen Capture** - Capture full screen or selected regions with hotkey support
- **AI-Powered Analysis** - Send screenshots to OpenRouter for intelligent explanations
- **Interview Preparation** - Get detailed feedback and explanations for interview questions
- **Cross-Platform** - Works on Windows, macOS, and Linux
- **Secure & Private** - Screenshots are not persisted, tokens stored securely in OS keychain

## Tech Stack

- **Frontend**: React 19 + TypeScript 5.8 + Vite
- **Backend**: Tauri 2.x + Rust
- **Authentication**: Google OAuth 2.0
- **AI Platform**: OpenRouter API

## Getting Started

### Prerequisites

- Node.js and npm/bun
- Rust toolchain
- Google OAuth credentials
- OpenRouter API key

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

### Configuration

Set up the following environment variables:

- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
- `OPENROUTER_API_KEY` - Your OpenRouter API key

## Development

See `.kiro/specs/ai-interview-assistant/` for detailed requirements, design, and implementation tasks.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
