# 🎮 TrivAI Gaming Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socketdotio&logoColor=white)](https://socket.io/)

> **An open-source AI-driven gaming platform starting with TrivAI - a multiplayer trivia game powered by Large Language Models**

## 🌟 Project Overview

TrivAI is an innovative gaming platform that combines artificial intelligence with multiplayer gaming to create engaging, educational, and entertaining experiences. Our flagship game, TrivAI, is a real-time multiplayer trivia game where AI generates questions dynamically, making each game unique and challenging.

**Current Status:** Phase 6 Complete - Advanced game features with comprehensive game mode selection, solo play with AI opponents, enhanced audio system, and polished user experience.

### 🎯 Mission Statement
To create the world's most advanced open-source AI gaming platform that makes learning fun, accessible, and social for players of all ages.

### 🚀 Key Features
- **AI-Powered Questions**: Dynamic question generation using Large Language Models
- **Multiple Game Modes**: Singleplayer with AI opponents and multiplayer lobbies
- **Real-time Multiplayer**: Up to 4 players per game with instant synchronization
- **Advanced Scoring System**: Animated scores, multipliers, and bonus wheels
- **Audio System**: 30+ sound effects and audio feedback
- **No Registration Required**: Jump right into games with just a nickname
- **Glassmorphism Design**: Modern, beautiful UI with gaming aesthetics
- **Open Source**: Completely open and extensible platform
- **Mobile Responsive**: Optimized for desktop and mobile devices

## 🎮 Game Features

### TrivAI Game Mechanics
- **Multi-round Gameplay**: Up to 5 rounds with increasing difficulty
- **Game Mode Selection**: Choose between singleplayer or multiplayer
- **Dynamic Topics**: Players choose topics for each round
- **Progressive Scoring**: Points multiply with each round (2x, 3x, 4x, 5x)
- **Final Round Challenge**: Extreme difficulty with bonus wheel multipliers (1x-10x)
- **Educational Value**: Detailed explanations for every answer
- **Penalty System**: 5-minute timeout for quitting mid-game

### Advanced Features
- **Bonus Wheel**: 8 different bonus segments with points, multipliers, and special rewards
- **Multiplier System**: Streak bonuses, speed bonuses, and wheel bonuses
- **Score Animations**: Spring-based animations with celebration effects
- **Audio Feedback**: Comprehensive sound system with 30+ effects
- **Loading States**: Smooth transitions and loading indicators
- **AI Opponents**: Three unique AI personalities for solo play

### Lobby System
- **Public & Private Lobbies**: Join public games or create private rooms with join codes
- **Flexible Player Count**: 2-4 players per game
- **Custom Lobby Names**: Up to 32 characters
- **Game Settings**: Customizable rounds, time limits, and difficulty
- **Real-time Updates**: Instant lobby status updates

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **State Management**: Zustand
- **Real-time**: Socket.io Client
- **Animations**: Framer Motion
- **Audio**: Web Audio API
- **Forms**: React Hook Form + Zod

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **WebSocket**: Socket.io
- **LLM Integration**: OpenAI SDK (Ollama compatible)
- **Session Management**: Express Session + Memory Store
- **Security**: Helmet.js + Rate Limiting

### Development Tools
- **Package Manager**: pnpm
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky
- **Documentation**: TypeDoc

## 📚 Documentation

### Core Documentation
- **[Project Plan](PROJECT_PLAN.md)** - Complete development roadmap with phases and steps
- **[Technical Specifications](TECHNICAL_SPECIFICATIONS.md)** - System architecture and API design
- **[UI/UX Guidelines](UI_UX_GUIDELINES.md)** - Design system and user experience standards
- **[Technology Stack](TECH_STACK.md)** - Detailed technology choices and justifications

### Development Documentation
- **[Development Workflow](DEVELOPMENT_WORKFLOW.md)** - Git workflow and development practices
- **[Admin Panel Specifications](ADMIN_PANEL_SPECS.md)** - Admin interface requirements
- **[Changelog](CHANGELOG.md)** - Project progress and version history

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- pnpm package manager
- Git
- Ollama (for local LLM during development)

### Installation
```bash
# Clone the repository
git clone https://github.com/username/trivai-platform.git
cd trivai-platform

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development servers
pnpm dev
```

### Development Environment
```bash
# Frontend (Next.js)
cd apps/frontend
pnpm dev
# Available at http://localhost:3000

# Backend (Express.js)
cd apps/backend
pnpm dev
# Available at http://localhost:3001

# Or run both simultaneously
pnpm dev
```

## 🎯 Project Roadmap

### Phase 1: Foundation & Setup ✅ COMPLETED
- [x] Project documentation and GitHub setup
- [x] Development environment configuration
- [x] Basic project structure and tooling

### Phase 2: Landing Page Development ✅ COMPLETED
- [x] Glassmorphism design system
- [x] Hero section with TrivAI branding
- [x] Mission statement and developer sections
- [x] Responsive design and animations

### Phase 3: Core Game Infrastructure ✅ COMPLETED
- [x] Express.js server with WebSocket support
- [x] Session management and game state
- [x] LLM integration with Ollama
- [x] Real-time multiplayer foundation

### Phase 4: Lobby System ✅ COMPLETED
- [x] Public and private lobby creation
- [x] Join code system for private games
- [x] Player management and game settings
- [x] Real-time lobby updates

### Phase 5: Core Game Engine ✅ COMPLETED
- [x] AI-powered question generation
- [x] Game flow management and scoring
- [x] Point doubling and bonus mechanics
- [x] Answer validation and explanations

### Phase 6: Advanced Game Features ✅ COMPLETED
- [x] Animated scoring system with celebrations
- [x] Bonus wheel with 8 reward segments
- [x] Comprehensive audio system (30+ sounds)
- [x] Game mode selection (singleplayer/multiplayer)
- [x] Solo play with AI opponents
- [x] Enhanced loading states and transitions

### Phase 7: User Experience & Quality
- [ ] Help system and tutorials
- [ ] Enhanced error handling
- [ ] Performance optimization
- [ ] Accessibility improvements

### Phase 8: Admin Panel
- [ ] Admin authentication system
- [ ] Configuration interface
- [ ] Monitoring dashboard
- [ ] System management tools

### Phase 9: Security & Deployment
- [ ] Production hardening
- [ ] Performance optimization
- [ ] CI/CD pipeline
- [ ] Monitoring setup

### Phase 10: Testing & Launch
- [ ] Comprehensive testing suite
- [ ] Performance benchmarks
- [ ] Security audit
- [ ] Public launch

## 🎨 Design System

### Visual Identity
- **Primary Colors**: Purple (#8B5CF6), Blue (#3B82F6), Green (#10B981)
- **Design Language**: Glassmorphism with gaming aesthetics
- **Typography**: Inter (primary), Poppins (headers)
- **Animations**: Smooth, performant, gaming-oriented

### UI Components
- **Glass morphism cards and panels**: Consistent design language
- **Gradient buttons and interactive elements**: Engaging user interactions
- **Real-time progress indicators**: Clear game state feedback
- **Animated score displays**: Celebration effects and smooth transitions
- **Audio feedback**: Comprehensive sound system integration

### Game Interface
- **Score animations**: Spring-based physics with celebration effects
- **Bonus wheel**: Interactive spinning wheel with 8 segments
- **Multiplier visualization**: Real-time countdown and effect display
- **Loading states**: Smooth transitions with themed animations
- **Mobile optimization**: Touch-friendly interface design

## 🔧 Development Status

### Recently Completed (Phase 6)
- **GameModeRouter**: Comprehensive game mode selection with settings
- **Solo Game Mode**: AI opponents with different personalities
- **Audio System**: 30+ sound effects with category management
- **Enhanced Scoring**: Animated scores with celebration effects
- **Bonus Wheel**: Interactive wheel with 8 different rewards
- **Loading States**: Polished loading experience throughout

### Current Architecture
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Express.js with Socket.io for real-time communication
- **Game Engine**: Comprehensive game state management
- **AI Integration**: OpenAI SDK with Ollama for question generation
- **Audio**: Web Audio API with sound categorization
- **Animations**: Framer Motion for smooth user interactions

### Performance Metrics
- **Load Time**: < 2 seconds for initial game load
- **Real-time Latency**: < 50ms for multiplayer actions
- **Mobile Performance**: 60fps animations on modern devices
- **Memory Usage**: Efficient session management with cleanup

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to get started.

### Ways to Contribute
- **Code Contributions**: Features, bug fixes, and improvements
- **Documentation**: Help improve our documentation
- **Testing**: Report bugs and test new features
- **Design**: UI/UX improvements and design suggestions
- **Community**: Help other users and spread the word

### Development Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI**: For providing the AI technology that powers our question generation
- **Ollama**: For local LLM support during development
- **Next.js Team**: For the excellent React framework
- **Socket.io Team**: For real-time communication capabilities
- **Framer Motion**: For beautiful animations and transitions
- **Tailwind CSS**: For the utility-first styling approach

## 📞 Contact

**Lead Developer**: Jamie Matthew van der Pijll  
**Email**: jamie@trivai.nl  
**GitHub**: [@username](https://github.com/username)  
**Website**: [trivai.nl](https://trivai.nl)

---

**Built with ❤️ by the TrivAI team** 