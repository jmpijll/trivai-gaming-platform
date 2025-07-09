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

### 🎯 Mission Statement
To create the world's most advanced open-source AI gaming platform that makes learning fun, accessible, and social for players of all ages.

### 🚀 Key Features
- **AI-Powered Questions**: Dynamic question generation using Large Language Models
- **Real-time Multiplayer**: Up to 4 players per game with instant synchronization
- **No Registration Required**: Jump right into games with just a nickname
- **Glassmorphism Design**: Modern, beautiful UI with gaming aesthetics
- **Open Source**: Completely open and extensible platform
- **Secure & Scalable**: Built with security and performance in mind

## 🎮 Game Features

### TrivAI Game Mechanics
- **Multi-round Gameplay**: Up to 5 rounds with increasing difficulty
- **Dynamic Topics**: Players choose topics for each round
- **Progressive Scoring**: Points multiply with each round (2x, 3x, 4x, 5x)
- **Final Round Challenge**: Extreme difficulty with bonus wheel multipliers (1x-10x)
- **Educational Value**: Detailed explanations for every answer
- **Penalty System**: 5-minute timeout for quitting mid-game

### Lobby System
- **Public & Private Lobbies**: Join public games or create private rooms with join codes
- **Flexible Player Count**: 2-4 players per game
- **Custom Lobby Names**: Up to 32 characters
- **Real-time Updates**: Instant lobby status updates

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **State Management**: Zustand
- **Real-time**: Socket.io Client
- **Animations**: Framer Motion
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

### Phase 1: Foundation & Setup ✅
- [x] Project documentation
- [ ] GitHub repository setup
- [ ] Development environment
- [ ] Basic project structure

### Phase 2: Landing Page Development
- [ ] Glassmorphism design system
- [ ] Hero section with branding
- [ ] Mission statement section
- [ ] Developer profile section

### Phase 3: Core Game Infrastructure
- [ ] Express.js server setup
- [ ] WebSocket implementation
- [ ] Session management
- [ ] LLM integration

### Phase 4: Lobby System
- [ ] Public/private lobbies
- [ ] Join code system
- [ ] Player management
- [ ] Real-time updates

### Phase 5: Core Game Engine
- [ ] Question generation
- [ ] Game flow management
- [ ] Scoring system
- [ ] Round progression

### Phase 6: Advanced Game Features
- [ ] Final round mechanics
- [ ] Bonus wheel
- [ ] Answer explanations
- [ ] Score animations

### Phase 7: User Experience & Quality
- [ ] Help system
- [ ] Error handling
- [ ] Performance optimization
- [ ] Accessibility

### Phase 8: Admin Panel
- [ ] Authentication system
- [ ] Configuration interface
- [ ] Monitoring dashboard
- [ ] Security management

### Phase 9: Security & Deployment
- [ ] Production hardening
- [ ] Performance optimization
- [ ] Monitoring setup
- [ ] CI/CD pipeline

### Phase 10: Testing & Launch
- [ ] Comprehensive testing
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
- Glass morphism cards and panels
- Gradient buttons and interactive elements
- Real-time progress indicators
- Animated score displays
- Responsive gaming interface

## 🔐 Security Features

### Game Security
- Input validation and sanitization
- Rate limiting on all endpoints
- Real-time cheat detection
- Session-based authentication
- Secure WebSocket connections

### Admin Security
- Hidden admin panel routes
- Multi-factor authentication
- Role-based access control
- Activity logging and monitoring
- Security headers and CSRF protection

## 🤖 AI Integration

### LLM Configuration
- **Development**: Ollama for local testing
- **Production**: OpenAI, Claude, or custom models
- **Flexibility**: OpenAI-compatible API interface
- **Features**: Content filtering, caching, fallback questions

### Question Generation
- Dynamic topic-based generation
- Difficulty scaling per round
- Humor and entertainment focus
- Age-appropriate content
- Detailed answer explanations

## 📊 Performance

### Targets
- **Page Load**: < 2 seconds
- **WebSocket Latency**: < 100ms
- **Question Generation**: < 3 seconds
- **Concurrent Users**: 1000+ players
- **Uptime**: 99.9%

### Optimization
- Code splitting and lazy loading
- Image optimization
- CDN integration
- Efficient state management
- Memory leak prevention

## 🧪 Testing Strategy

### Test Coverage
- **Unit Tests**: Core game logic
- **Integration Tests**: API endpoints
- **E2E Tests**: Complete user flows
- **Performance Tests**: Load testing
- **Security Tests**: Vulnerability scanning

### Quality Assurance
- Automated testing pipeline
- Code review process
- Performance monitoring
- Security audits
- Accessibility testing

## 🌐 Deployment

### Development
- Local development with hot reloading
- Staging environment for testing
- Preview deployments for features

### Production
- **Frontend**: Vercel deployment
- **Backend**: Railway or DigitalOcean
- **CDN**: Global content delivery
- **Monitoring**: Real-time performance tracking
- **SSL**: Full HTTPS encryption

## 🤝 Contributing

We welcome contributions from the community! Please read our contribution guidelines before getting started.

### Development Process
1. Fork the repository
2. Create a feature branch
3. Follow our coding standards
4. Add tests for new features
5. Update documentation
6. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for formatting
- Conventional commits
- Comprehensive testing
- Documentation updates

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

### Lead Developer & CEO
**Jamie Matthew van der Pijll**
- Project Vision & Leadership
- Full-stack Development
- AI Integration
- Open Source Advocacy

### Community
This is an open-source project welcoming contributions from developers worldwide.

## 🔗 Links

- **Website**: https://trivai.nl
- **Repository**: https://github.com/username/trivai-platform
- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/username/trivai-platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/username/trivai-platform/discussions)

## 📧 Contact

For questions, suggestions, or collaboration opportunities:
- **Email**: jamie@trivai.nl
- **GitHub**: [@username](https://github.com/username)
- **Website**: https://trivai.nl

## 🏆 Acknowledgments

- Open source community for inspiration
- AI/LLM providers for making this possible
- Contributors and testers
- Gaming communities for feedback

## 📈 Project Status

- **Current Phase**: 1 - Foundation & Setup
- **Progress**: 20% (1/5 Phase 1 steps completed)
- **Next Milestone**: GitHub repository setup
- **Target Launch**: Q2 2024

---

**Built with ❤️ by the TrivAI Team**

*Making AI gaming accessible, fun, and educational for everyone* 