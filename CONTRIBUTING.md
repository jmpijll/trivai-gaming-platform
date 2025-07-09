# Contributing to TrivAI Gaming Platform

Thank you for your interest in contributing to the TrivAI Gaming Platform! This document provides guidelines and information for contributors.

## 🌟 Welcome

TrivAI is an open-source AI-driven gaming platform, and we welcome contributions from developers, designers, testers, and documentation enthusiasts. Whether you're fixing bugs, adding features, improving documentation, or providing feedback, your contributions help make TrivAI better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Process](#contributing-process)
- [Types of Contributions](#types-of-contributions)
- [Development Guidelines](#development-guidelines)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

## 📜 Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code. Please report any unacceptable behavior to jamie@trivai.nl.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Git
- Basic knowledge of TypeScript, React, and Node.js
- For AI features: Ollama or OpenAI API access

### Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/trivai-gaming-platform.git
   cd trivai-gaming-platform
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

6. **Verify setup**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 🔄 Contributing Process

### 1. Find or Create an Issue

- Check existing [issues](https://github.com/jmpijll/trivai-gaming-platform/issues)
- For new features, create an issue first to discuss the approach
- For bugs, provide reproduction steps and system information

### 2. Create a Branch

Follow our branching strategy from [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md):

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b bugfix/issue-description
```

### 3. Make Changes

- Follow our coding standards (see below)
- Write tests for new functionality
- Update documentation as needed
- Ensure all tests pass
- Follow commit message conventions

### 4. Test Your Changes

```bash
# Run all tests
pnpm test

# Run linting
pnpm lint

# Run type checking
pnpm type-check

# Test in development mode
pnpm dev
```

### 5. Submit a Pull Request

- Push your changes to your fork
- Create a pull request from your feature branch to `main`
- Use our PR template
- Link to related issues
- Wait for review and address feedback

## 🎯 Types of Contributions

### 🐛 Bug Reports

- Use the bug report template
- Include reproduction steps
- Provide system information
- Include error messages and logs
- Add screenshots if applicable

### ✨ Feature Requests

- Use the feature request template
- Explain the use case and benefits
- Propose implementation approach
- Consider backward compatibility
- Discuss with maintainers first

### 🔧 Code Contributions

- **Frontend**: React components, UI/UX improvements, animations
- **Backend**: API endpoints, game logic, WebSocket events
- **AI Integration**: LLM prompts, question generation, content filtering
- **Testing**: Unit tests, integration tests, E2E tests
- **Performance**: Optimization, caching, monitoring

### 📚 Documentation

- **Code Documentation**: JSDoc comments, README updates
- **User Documentation**: Setup guides, API documentation
- **Developer Documentation**: Architecture, workflows, best practices
- **Examples**: Code examples, tutorials, demos

## 📏 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled, proper type definitions
- **ESLint**: Follow configured rules
- **Prettier**: Auto-format code
- **Naming**: Use descriptive names, follow conventions

### Frontend (Next.js/React)

```typescript
// Use TypeScript interfaces for props
interface ComponentProps {
  title: string;
  onClick: () => void;
}

// Use proper React patterns
const Component: React.FC<ComponentProps> = ({ title, onClick }) => {
  return (
    <button onClick={onClick} className="glass-button">
      {title}
    </button>
  );
};
```

### Backend (Express.js)

```typescript
// Use proper error handling
app.post('/api/endpoint', async (req, res) => {
  try {
    const result = await service.performAction(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in endpoint:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
type(scope): description

# Examples
feat(game): add bonus wheel component
fix(lobby): resolve connection timeout issue
docs(readme): update installation instructions
test(api): add integration tests for game endpoints
```

### Component Structure

```
src/components/
├── ui/           # Reusable UI components
├── game/         # Game-specific components
├── layout/       # Layout components
└── sections/     # Page sections
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
pnpm test

# Integration tests
pnpm test:integration

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

### Writing Tests

```typescript
// Component tests
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});

// API tests
import request from 'supertest';
import app from '../app';

describe('API Endpoints', () => {
  it('should create a lobby', async () => {
    const response = await request(app)
      .post('/api/lobbies')
      .send({ name: 'Test Lobby' });
    
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test Lobby');
  });
});
```

## 📖 Documentation

### Code Documentation

- Use JSDoc for functions and classes
- Include examples for complex functions
- Document API endpoints and parameters
- Update README for new features

### Markdown Documentation

- Use proper headings and formatting
- Include code examples
- Add images and diagrams when helpful
- Keep documentation up to date

## 🤝 Community

### Getting Help

- **GitHub Issues**: For bug reports and feature requests
- **Discussions**: For questions and general discussion
- **Email**: jamie@trivai.nl for direct contact

### Communication Guidelines

- Be respectful and inclusive
- Provide clear and detailed information
- Search existing issues before creating new ones
- Use English for all communication
- Be patient with responses

### Code Review Process

- All PRs require review before merging
- Reviews focus on code quality, functionality, and maintainability
- Address feedback promptly and professionally
- Ask questions if feedback is unclear

## 🏆 Recognition

Contributors are recognized in several ways:

- **Contributors section** in README
- **Changelog entries** for significant contributions
- **GitHub contributors** page
- **Special mentions** in release notes

## 📝 Development Phases

We follow a structured development approach:

- **Phase 6**: ✅ Advanced Game Features (Current)
- **Phase 7**: User Experience & Quality
- **Phase 8**: Admin Panel & Configuration
- **Phase 9**: Security & Deployment
- **Phase 10**: Testing & Launch

See [PROJECT_PLAN.md](PROJECT_PLAN.md) for detailed roadmap.

## 📊 Project Statistics

- **Language**: TypeScript (Frontend & Backend)
- **Framework**: Next.js 14 + Express.js
- **Architecture**: Monorepo with pnpm workspaces
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions (coming soon)

## 🔍 Resources

- [Project Plan](PROJECT_PLAN.md) - Development roadmap
- [Technical Specifications](TECHNICAL_SPECIFICATIONS.md) - System architecture
- [Development Workflow](DEVELOPMENT_WORKFLOW.md) - Git workflow and processes
- [UI/UX Guidelines](UI_UX_GUIDELINES.md) - Design system and standards
- [Technology Stack](TECH_STACK.md) - Technology choices and justifications

## 📞 Contact

**Lead Developer**: Jamie Matthew van der Pijll  
**Email**: jamie@trivai.nl  
**GitHub**: [@jmpijll](https://github.com/jmpijll)  
**Project**: [TrivAI Gaming Platform](https://github.com/jmpijll/trivai-gaming-platform)

---

Thank you for contributing to TrivAI Gaming Platform! Together, we're building the future of AI-driven gaming. 🎮✨ 