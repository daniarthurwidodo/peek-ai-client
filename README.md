# AI Interview Assistant

A privacy-first desktop application that helps you prepare for technical interviews by capturing screenshots of interview questions and providing instant AI-powered explanations and feedback.

## Overview

AI Interview Assistant combines intelligent screen capture with state-of-the-art AI models to transform your interview preparation experience. Capture any interview question from your screen, send it to OpenRouter's AI platform, and receive detailed explanations, solution approaches, and learning insights—all while maintaining your privacy with no persistent data storage.

## Key Features

### Core Functionality
- **Secure Authentication** - One-click Google OAuth login with secure token storage
- **Smart Screen Capture** - Capture full screen or selected regions with keyboard shortcuts
- **AI-Powered Analysis** - Leverage multiple AI models (GPT-4, Claude, etc.) via OpenRouter
- **Intelligent Explanations** - Get step-by-step solutions, complexity analysis, and alternative approaches
- **Privacy-First Design** - Screenshots never persist to disk, all credentials stored in OS keychain

### Technical Highlights
- **Cross-Platform** - Native support for Windows, macOS, and Linux
- **Fast & Responsive** - Sub-second screen capture, <5s AI responses
- **Secure by Default** - HTTPS-only communication, OS-level credential encryption
- **Modern Stack** - Built with Tauri 2.x, React 19, TypeScript 5.8, and Rust

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript 5.8, Vite 7, TanStack Router & Query |
| Backend | Tauri 2.x, Rust |
| Authentication | Clerk (Google OAuth 2.0) |
| Database | Tauri SQL Plugin (SQLite) |
| AI Platform | OpenRouter API |
| UI Components | Lucide React Icons |
| Testing | Selenium WebDriver, Vitest |

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm/bun
- **Rust** toolchain (install via [rustup](https://rustup.rs/))
- **Google OAuth** credentials ([setup guide](./GOOGLE_OAUTH_SETUP.md))
- **OpenRouter** API key ([get one here](https://openrouter.ai/))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-interview-assistant.git
cd ai-interview-assistant

# Install dependencies
npm install

# Set up environment variables (see Configuration below)
cp .env.example .env
# Edit .env with your credentials

# Run in development mode
npm run tauri dev

# Build for production
npm run tauri build
```

### Configuration

Create a `.env` file in the project root with the following variables:

```env
# Google OAuth (Clerk)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# OpenRouter API
VITE_OPENROUTER_API_KEY=sk-or-v1-...

# Application
VITE_APP_ENV=development
```

See [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md) for detailed OAuth configuration instructions.

## Project Structure

```
ai-interview-assistant/
├── src/                      # React frontend source
│   ├── components/           # React components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities and services
│   ├── routes/               # TanStack Router routes
│   └── main.tsx              # Application entry point
├── src-tauri/                # Tauri backend source
│   ├── src/                  # Rust source code
│   ├── capabilities/         # Tauri permissions
│   └── tauri.conf.json       # Tauri configuration
├── tests/                    # Selenium integration tests
├── docs/                     # Documentation
│   └── prd.md                # Product Requirements Document
├── .kiro/                    # Kiro AI specifications
│   └── specs/ai-interview-assistant/
│       ├── requirements.md   # Functional requirements
│       ├── design.md         # Technical design
│       └── tasks.md          # Implementation tasks
└── README.md                 # This file
```

## Development

### Running Tests

```bash
# Run Selenium integration tests
npm run test:selenium

# Run Rust tests
cd src-tauri
cargo test

# Run frontend tests (when implemented)
npm test
```

### Development Workflow

1. Start the development server: `npm run tauri dev`
2. Make changes to frontend code in `src/`
3. Make changes to backend code in `src-tauri/src/`
4. Hot reload applies automatically for frontend changes
5. Rebuild required for Rust changes (automatic in dev mode)

### Building for Production

```bash
# Build for current platform
npm run tauri build

# Output locations:
# - Windows: src-tauri/target/release/bundle/msi/
# - macOS: src-tauri/target/release/bundle/dmg/
# - Linux: src-tauri/target/release/bundle/appimage/
```

## Documentation

- **[Product Requirements Document](./docs/prd.md)** - Product vision, features, and roadmap
- **[Requirements Specification](./kiro/specs/ai-interview-assistant/requirements.md)** - Detailed functional requirements
- **[Technical Design](./kiro/specs/ai-interview-assistant/design.md)** - Architecture and component design
- **[Implementation Tasks](./kiro/specs/ai-interview-assistant/tasks.md)** - Development roadmap and task breakdown
- **[Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md)** - OAuth configuration guide
- **[Deep Link Setup](./DEEP_LINK_SETUP.md)** - Deep linking configuration

## Features Roadmap

### Phase 1: MVP (Current)
- ✅ Google OAuth authentication
- ✅ Full screen capture
- ✅ OpenRouter AI integration
- ✅ Basic response display
- ✅ Cross-platform support

### Phase 2: Enhanced Experience
- [ ] Region selection for partial capture
- [ ] Multiple AI model selection
- [ ] Response history (session-based)
- [ ] Keyboard shortcut customization
- [ ] Dark mode support

### Phase 3: Advanced Features
- [ ] Persistent response history (opt-in)
- [ ] Response export (PDF, Markdown)
- [ ] Custom AI prompts
- [ ] Collaborative features
- [ ] Mobile companion app

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows existing style conventions
- Tests pass (`npm run test:selenium`)
- Documentation is updated as needed
- Commit messages are clear and descriptive

## Security

This application prioritizes user privacy and security:

- **No Persistent Storage** - Screenshots are never saved to disk
- **Encrypted Credentials** - OAuth tokens stored in OS keychain
- **HTTPS Only** - All API communication over secure connections
- **Open Source** - Full transparency of code and practices

If you discover a security vulnerability, please email security@example.com instead of using the issue tracker.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Tauri](https://tauri.app/) - Rust-powered desktop framework
- AI powered by [OpenRouter](https://openrouter.ai/) - Multi-model AI platform
- Authentication via [Clerk](https://clerk.com/) - Modern auth platform
- Icons from [Lucide](https://lucide.dev/) - Beautiful icon library

## Support

- **Documentation**: See `docs/` and `.kiro/specs/` directories
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-interview-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-interview-assistant/discussions)

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

---

Made with ❤️ for interview preparation
