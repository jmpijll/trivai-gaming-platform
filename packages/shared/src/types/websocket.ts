import { Lobby, Player } from './lobby';
import { GameState, PlayerScore } from './game';

// Client to Server Events
export interface ClientToServerEvents {
  // Lobby Management
  'create-lobby': (data: { name: string; isPrivate: boolean; nickname: string }) => void;
  'join-lobby': (data: { lobbyId: string; joinCode?: string; nickname: string }) => void;
  'leave-lobby': (data: { lobbyId: string }) => void;
  'start-game': (data: { lobbyId: string }) => void;
  'toggle-ready': (data: { lobbyId: string }) => void;
  
  // Game Events
  'submit-answer': (data: { questionId: string; answerIndex: number; responseTime: number }) => void;
  'select-topic': (data: { topic: string }) => void;
  'quit-game': (data: { gameId: string }) => void;
  'spin-wheel': (data: { gameId: string }) => void;
  
  // Connection Events
  'ping': () => void;
  'disconnect': () => void;
}

// Server to Client Events
export interface ServerToClientEvents {
  // Lobby Updates
  'lobby-created': (data: { lobby: Lobby; player: Player }) => void;
  'lobby-updated': (data: { lobby: Lobby }) => void;
  'player-joined': (data: { player: Player; lobby: Lobby }) => void;
  'player-left': (data: { playerId: string; lobby: Lobby }) => void;
  'player-ready-changed': (data: { playerId: string; isReady: boolean; lobby: Lobby }) => void;
  
  // Game Updates
  'game-started': (data: { gameState: GameState }) => void;
  'question-displayed': (data: { question: Question; timeRemaining: number; roundNumber: number }) => void;
  'answer-submitted': (data: { playerId: string; isCorrect: boolean; responseTime: number }) => void;
  'question-ended': (data: { correctAnswer: Answer; explanation: string; scores: PlayerScore[] }) => void;
  'round-ended': (data: { roundSummary: RoundSummary; nextRoundPreview?: string }) => void;
  'game-ended': (data: { finalScores: PlayerScore[]; gameStats: GameStats }) => void;
  
  // Error Events
  'error': (data: { message: string; code?: string }) => void;
  'lobby-error': (data: { message: string; lobbyId?: string }) => void;
  'game-error': (data: { message: string; gameId?: string }) => void;
  
  // Connection Events
  'pong': () => void;
  'reconnected': (data: { lobby?: Lobby; game?: GameState }) => void;
}

// Import required types
import { Question, Answer, RoundSummary, GameStats } from './game'; 