export enum LobbyStatus {
  WAITING = 'waiting',
  STARTING = 'starting',
  IN_GAME = 'in_game',
  COMPLETED = 'completed',
}

export interface Player {
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

export interface Penalty {
  id: string;
  type: 'quit_game' | 'timeout' | 'inappropriate_behavior';
  startTime: Date;
  endTime: Date;
  reason: string;
}

export interface PlayerSettings {
  enableSoundEffects: boolean;
  enableNotifications: boolean;
  preferredDifficulty: string;
  gameTheme: string;
}

export interface Lobby {
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

export interface CreateLobbyRequest {
  name: string;
  isPrivate: boolean;
  maxPlayers?: number;
}

export interface JoinLobbyRequest {
  lobbyId: string;
  joinCode?: string;
  nickname: string;
}

export interface LobbyListResponse {
  lobbies: Lobby[];
  total: number;
}

// Import GameSettings from game types
import { GameSettings } from './game';

export const LOBBY_CONSTRAINTS = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 32,
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 4,
  JOIN_CODE_LENGTH: 6,
  MAX_LOBBIES_PER_USER: 3,
} as const; 