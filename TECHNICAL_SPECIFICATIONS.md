# TrivAI Gaming Platform - Technical Specifications

## 🏗️ System Architecture

### Overview
The TrivAI platform follows a modern web application architecture with real-time multiplayer capabilities, serverless mindset, and modular design principles.

### Architecture Principles
- **Stateless Design:** No persistent database, session-based data storage
- **Real-time Communication:** WebSocket for instant multiplayer updates
- **Modular Components:** Easily extensible for future games
- **Security First:** Input validation, rate limiting, secure connections
- **Performance Oriented:** Optimized for low latency gaming experience

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    TrivAI Platform Architecture             │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React/Next.js)                                  │
│  ├── Landing Page                                          │
│  ├── Game Interface                                        │
│  ├── Lobby System                                          │
│  └── Admin Panel                                           │
├─────────────────────────────────────────────────────────────┤
│  WebSocket Layer                                           │
│  ├── Connection Management                                 │
│  ├── Event Broadcasting                                    │
│  └── Real-time Synchronization                            │
├─────────────────────────────────────────────────────────────┤
│  Backend API (Express.js)                                  │
│  ├── Game Engine                                           │
│  ├── Lobby Management                                      │
│  ├── Session Management                                    │
│  └── LLM Integration                                       │
├─────────────────────────────────────────────────────────────┤
│  External Services                                         │
│  ├── Ollama (LLM API)                                      │
│  └── Future: Additional AI Services                        │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Technical Stack

### Frontend
- **Framework:** Next.js 14+ with React 18+
- **Language:** TypeScript for type safety
- **Styling:** Tailwind CSS + Custom CSS for glassmorphism
- **State Management:** Zustand for client state
- **WebSocket Client:** Socket.io-client
- **Build Tool:** Vite for fast development
- **Testing:** Jest + React Testing Library

### Backend
- **Runtime:** Node.js 18+ with TypeScript
- **Framework:** Express.js with TypeScript
- **WebSocket:** Socket.io for real-time communication
- **Session Management:** In-memory with Redis-compatible interface
- **LLM Client:** OpenAI SDK (compatible with Ollama)
- **Security:** Helmet.js, CORS, Rate limiting
- **Testing:** Jest + Supertest

### Development Tools
- **Package Manager:** pnpm for fast, efficient installs
- **Linting:** ESLint + Prettier for code quality
- **Git Hooks:** Husky for pre-commit checks
- **Documentation:** TypeDoc for API docs
- **Monitoring:** Custom metrics and logging

## 🎮 Game Engine Architecture

### Core Components

#### 1. Game State Manager
```typescript
interface GameState {
  id: string;
  lobbyId: string;
  players: Player[];
  currentRound: number;
  totalRounds: number;
  roundState: RoundState;
  scores: PlayerScore[];
  gameStatus: GameStatus;
  settings: GameSettings;
}

interface RoundState {
  roundNumber: number;
  topic: string;
  questions: Question[];
  currentQuestionIndex: number;
  questionStartTime: number;
  roundMultiplier: number;
  playerAnswers: Map<string, number>;
}
```

#### 2. Question Generation System
```typescript
interface Question {
  id: string;
  text: string;
  answers: Answer[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: DifficultyLevel;
  topic: string;
  timeLimit: number;
}

interface Answer {
  text: string;
  isCorrect: boolean;
}
```

#### 3. Scoring System
```typescript
interface ScoringRule {
  basePoints: number;
  roundMultiplier: number;
  timeBonus: boolean;
  finalRoundWheelMultiplier?: number;
}

interface PlayerScore {
  playerId: string;
  roundScores: number[];
  totalScore: number;
  correctAnswers: number;
  averageResponseTime: number;
}
```

## 🌐 API Design

### RESTful Endpoints

#### Game Management
```
GET    /api/health              - Health check
GET    /api/lobbies             - List public lobbies
POST   /api/lobbies             - Create new lobby
GET    /api/lobbies/:id         - Get lobby details
PUT    /api/lobbies/:id         - Update lobby
DELETE /api/lobbies/:id         - Delete lobby
POST   /api/lobbies/:id/join    - Join lobby
```

#### Admin Panel
```
GET    /api/admin/stats         - System statistics
GET    /api/admin/config        - Get configuration
PUT    /api/admin/config        - Update configuration
GET    /api/admin/games         - Active games
POST   /api/admin/games/:id/end - Force end game
```

### WebSocket Events

#### Client → Server
```typescript
// Lobby Management
'create-lobby': { name: string, isPrivate: boolean }
'join-lobby': { lobbyId: string, joinCode?: string }
'leave-lobby': { lobbyId: string }
'start-game': { lobbyId: string }

// Game Events
'submit-answer': { questionId: string, answerIndex: number }
'select-topic': { topic: string }
'quit-game': { gameId: string }
'spin-wheel': { gameId: string }
```

#### Server → Client
```typescript
// Lobby Updates
'lobby-created': { lobby: Lobby }
'lobby-updated': { lobby: Lobby }
'player-joined': { player: Player, lobby: Lobby }
'player-left': { playerId: string, lobby: Lobby }

// Game Updates
'game-started': { gameState: GameState }
'question-displayed': { question: Question, timeRemaining: number }
'answer-submitted': { playerId: string, isCorrect: boolean }
'question-ended': { correctAnswer: Answer, explanation: string, scores: PlayerScore[] }
'round-ended': { roundSummary: RoundSummary, nextRoundPreview?: string }
'game-ended': { finalScores: PlayerScore[], gameStats: GameStats }
```

## 🗄️ Data Models

### Session Storage (In-Memory)

#### Player Model
```typescript
interface Player {
  id: string;
  nickname: string;
  sessionId: string;
  currentLobby?: string;
  currentGame?: string;
  isReady: boolean;
  joinTime: Date;
  lastActivity: Date;
  penalties: Penalty[];
  settings: PlayerSettings;
}
```

#### Lobby Model
```typescript
interface Lobby {
  id: string;
  name: string;
  isPrivate: boolean;
  joinCode?: string;
  ownerId: string;
  players: Player[];
  maxPlayers: number;
  gameSettings: GameSettings;
  status: LobbyStatus;
  createdAt: Date;
  lastActivity: Date;
}
```

#### Game Model
```typescript
interface Game {
  id: string;
  lobbyId: string;
  players: Player[];
  gameState: GameState;
  rounds: Round[];
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  currentRound: number;
  settings: GameSettings;
}
```

## 🔒 Security Specifications

### Input Validation
- **Nickname:** 3-20 characters, alphanumeric + spaces
- **Lobby Name:** 3-32 characters, alphanumeric + spaces
- **Join Code:** 6-digit alphanumeric code
- **Topic:** 3-50 characters, filtered for appropriateness
- **Question Answers:** Index validation (0-3)

### Rate Limiting
- **Lobby Creation:** 3 per minute per IP
- **Join Attempts:** 10 per minute per IP
- **Answer Submission:** 1 per question per player
- **WebSocket Messages:** 100 per minute per connection
- **Admin Actions:** 50 per minute per session

### Security Headers
```typescript
// Helmet.js configuration
{
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "wss:", "https:"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}
```

## 🤖 LLM Integration

### OpenAI-Compatible API Integration
```typescript
interface LLMClient {
  generateQuestions(topic: string, count: number, difficulty: DifficultyLevel): Promise<Question[]>;
  validateContent(text: string): Promise<boolean>;
  generateExplanation(question: string, correctAnswer: string): Promise<string>;
}

interface LLMConfig {
  baseURL: string;
  apiKey?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  timeout: number;
}
```

### Prompt Templates
```typescript
const QUESTION_PROMPT = `
Generate {count} fun, humorous trivia questions about {topic}.
Each question should have 4 multiple choice answers with exactly 1 correct answer.
Make the questions appropriate for all ages and enjoyable.
Difficulty level: {difficulty}

Return in JSON format:
{
  "questions": [
    {
      "text": "Question text",
      "answers": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}
`;

const FINAL_ROUND_PROMPT = `
Generate {count} extremely difficult trivia questions on random topics.
These should be challenging even for trivia experts.
Each question should have 4 multiple choice answers with exactly 1 correct answer.
Make them challenging but fair, with clear explanations.
`;
```

## 📊 Performance Requirements

### Response Time Targets
- **Page Load:** < 2 seconds initial load
- **WebSocket Connection:** < 100ms establishment
- **Question Generation:** < 3 seconds per batch
- **Answer Submission:** < 50ms processing
- **Real-time Updates:** < 100ms latency

### Capacity Planning
- **Concurrent Users:** 1000+ simultaneous players
- **Concurrent Games:** 250+ active games
- **Memory Usage:** < 2GB for 1000 users
- **CPU Usage:** < 70% under normal load
- **Network Bandwidth:** < 1MB/s per 100 users

### Scalability Considerations
- **Session Storage:** Redis-compatible for horizontal scaling
- **WebSocket Scaling:** Socket.io with Redis adapter
- **LLM Caching:** Cache common questions and topics
- **CDN Integration:** Static asset delivery optimization

## 🔄 Error Handling

### Error Types
```typescript
enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  LOBBY_FULL = 'LOBBY_FULL',
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND',
  INVALID_GAME_STATE = 'INVALID_GAME_STATE',
  LLM_API_ERROR = 'LLM_API_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SYSTEM_ERROR = 'SYSTEM_ERROR'
}
```

### Error Response Format
```typescript
interface ErrorResponse {
  error: ErrorType;
  message: string;
  details?: any;
  timestamp: Date;
  requestId: string;
}
```

### Fallback Mechanisms
- **LLM Failure:** Pre-generated question bank
- **WebSocket Failure:** Automatic reconnection with exponential backoff
- **Session Loss:** Game state recovery from last known state
- **Server Overload:** Graceful degradation with waiting queues

## 🧪 Testing Strategy

### Unit Testing
- **Game Engine:** Core logic and state management
- **LLM Integration:** API calls and response parsing
- **Scoring System:** Point calculation and validation
- **WebSocket Events:** Message handling and broadcasting

### Integration Testing
- **API Endpoints:** Request/response validation
- **Database Operations:** Session management
- **Real-time Communication:** WebSocket event flow
- **External Services:** LLM API integration

### End-to-End Testing
- **Complete Game Flow:** From lobby creation to game end
- **Multiplayer Scenarios:** 2-4 player interactions
- **Error Scenarios:** Connection drops, timeouts, failures
- **Performance Testing:** Load testing with simulated users

## 📈 Monitoring & Logging

### Metrics Collection
- **Game Metrics:** Games started, completed, abandoned
- **Player Metrics:** Active users, session duration, engagement
- **Performance Metrics:** Response times, error rates, throughput
- **System Metrics:** CPU, memory, network usage

### Logging Strategy
```typescript
interface LogEvent {
  timestamp: Date;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  userId?: string;
  gameId?: string;
  requestId?: string;
}
```

### Health Checks
- **Application Health:** API responsiveness
- **Database Health:** Session storage connectivity
- **External Service Health:** LLM API availability
- **WebSocket Health:** Connection pool status

---

**Last Updated:** [Current Date]  
**Version:** 1.0  
**Status:** Planning Phase 