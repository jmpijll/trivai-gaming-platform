import { Lobby, LobbyCreationRequest, LobbyJoinRequest } from './lobby';
import { Player, PlayerInfo, PlayerCreationRequest } from './player';
import { GameState, PlayerScore, RoundSummary, GameStats } from './game';
import { Question, AnswerResult } from './question';

// Client to Server Events
export interface ClientToServerEvents {
  // Connection events
  'join': (data: PlayerCreationRequest) => void;
  'disconnect': () => void;
  'ping': () => void;
  
  // Lobby events
  'create-lobby': (data: LobbyCreationRequest) => void;
  'join-lobby': (data: LobbyJoinRequest) => void;
  'leave-lobby': (data: { lobbyId: string }) => void;
  'update-lobby': (data: { lobbyId: string; updates: any }) => void;
  'kick-player': (data: { lobbyId: string; playerId: string }) => void;
  'start-game': (data: { lobbyId: string }) => void;
  'ready-toggle': (data: { lobbyId: string; isReady: boolean }) => void;

  // Game events
  'submit-answer': (data: { questionId: string; answerIndex: number; responseTime: number }) => void;
  'select-topic': (data: { topic: string }) => void;
  'quit-game': (data: { gameId: string }) => void;
  'spin-wheel': (data: { gameId: string }) => void;
  'request-reconnect': (data: { gameId: string }) => void;

  // Admin events
  'admin-login': (data: { username: string; password: string; totpCode?: string }) => void;
  'admin-logout': () => void;
  'admin-action': (data: AdminActionRequest) => void;
}

// Server to Client Events
export interface ServerToClientEvents {
  // Connection events
  'connected': (data: { playerId: string; sessionId: string }) => void;
  'error': (data: ErrorResponse) => void;
  'pong': () => void;

  // Lobby events
  'lobby-created': (data: { lobby: Lobby }) => void;
  'lobby-updated': (data: { lobby: Lobby }) => void;
  'lobby-joined': (data: { lobby: Lobby; player: PlayerInfo }) => void;
  'lobby-left': (data: { lobbyId: string; playerId: string }) => void;
  'player-joined': (data: { player: PlayerInfo; lobby: Lobby }) => void;
  'player-left': (data: { playerId: string; lobby: Lobby }) => void;
  'player-updated': (data: { player: PlayerInfo; lobby: Lobby }) => void;
  'lobby-closed': (data: { lobbyId: string; reason: string }) => void;

  // Game events
  'game-started': (data: { gameState: GameState }) => void;
  'game-updated': (data: { gameState: GameState }) => void;
  'round-started': (data: { roundNumber: number; topic: string; totalRounds: number }) => void;
  'question-displayed': (data: { question: QuestionDisplay; timeRemaining: number }) => void;
  'answer-submitted': (data: { playerId: string; isCorrect: boolean }) => void;
  'question-ended': (data: { results: AnswerResult[]; explanation: string; scores: PlayerScore[] }) => void;
  'round-ended': (data: { roundSummary: RoundSummary; nextRoundPreview?: string }) => void;
  'game-ended': (data: { finalScores: PlayerScore[]; gameStats: GameStats; winner: string }) => void;
  'game-paused': (data: { reason: string; resumeTime?: Date }) => void;
  'game-resumed': () => void;

  // Real-time updates
  'player-status-changed': (data: { playerId: string; status: string }) => void;
  'lobby-list-updated': (data: { lobbies: any[] }) => void;
  'system-message': (data: { message: string; type: 'info' | 'warning' | 'error' }) => void;

  // Admin events
  'admin-authenticated': (data: { permissions: string[] }) => void;
  'admin-data': (data: AdminDataResponse) => void;
  'admin-action-result': (data: { success: boolean; message: string; data?: any }) => void;
}

export interface QuestionDisplay {
  id: string;
  text: string;
  answers: string[];
  timeLimit: number;
  roundNumber: number;
  questionNumber: number;
}

export interface ErrorResponse {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: Date;
  code?: string;
}

export enum ErrorType {
  VALIDATION_ERROR = 'validation_error',
  AUTHENTICATION_ERROR = 'authentication_error',
  AUTHORIZATION_ERROR = 'authorization_error',
  LOBBY_FULL = 'lobby_full',
  LOBBY_NOT_FOUND = 'lobby_not_found',
  GAME_NOT_FOUND = 'game_not_found',
  PLAYER_NOT_FOUND = 'player_not_found',
  INVALID_GAME_STATE = 'invalid_game_state',
  LLM_API_ERROR = 'llm_api_error',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  NETWORK_ERROR = 'network_error',
  SYSTEM_ERROR = 'system_error',
}

export interface AdminActionRequest {
  action: AdminAction;
  target?: string;
  data?: any;
}

export enum AdminAction {
  GET_SYSTEM_STATUS = 'get_system_status',
  GET_ACTIVE_GAMES = 'get_active_games',
  GET_PLAYERS = 'get_players',
  END_GAME = 'end_game',
  KICK_PLAYER = 'kick_player',
  UPDATE_CONFIG = 'update_config',
  GET_LOGS = 'get_logs',
  CLEAR_CACHE = 'clear_cache',
}

export interface AdminDataResponse {
  type: AdminDataType;
  data: any;
  timestamp: Date;
}

export enum AdminDataType {
  SYSTEM_STATUS = 'system_status',
  ACTIVE_GAMES = 'active_games',
  PLAYERS = 'players',
  CONFIGURATION = 'configuration',
  LOGS = 'logs',
  METRICS = 'metrics',
} 