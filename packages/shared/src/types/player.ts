export enum PlayerStatus {
  ONLINE = 'online',
  READY = 'ready',
  IN_GAME = 'in_game',
  ANSWERING = 'answering',
  DISCONNECTED = 'disconnected',
  PENALIZED = 'penalized',
}

export enum ConnectionQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  DISCONNECTED = 'disconnected',
}

export interface Player {
  id: string;
  nickname: string;
  sessionId: string;
  currentLobby?: string;
  currentGame?: string;
  status: PlayerStatus;
  isReady: boolean;
  isOwner: boolean;
  joinTime: Date;
  lastActivity: Date;
  penalties: Penalty[];
  settings: PlayerSettings;
  connectionQuality: ConnectionQuality;
  ping: number;
}

export interface PlayerSettings {
  soundEnabled: boolean;
  volume: number;
  animationsEnabled: boolean;
  reducedMotion: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export interface Penalty {
  id: string;
  type: PenaltyType;
  reason: string;
  startTime: Date;
  endTime: Date;
  isActive: boolean;
}

export enum PenaltyType {
  QUIT_GAME = 'quit_game',
  INAPPROPRIATE_BEHAVIOR = 'inappropriate_behavior',
  CHEATING = 'cheating',
  EXCESSIVE_DISCONNECTIONS = 'excessive_disconnections',
}

export interface PlayerInfo {
  id: string;
  nickname: string;
  score: number;
  status: PlayerStatus;
  connectionQuality: ConnectionQuality;
  joinTime: Date;
  lastActivity: Date;
  isReady: boolean;
  isOwner: boolean;
}

export interface PlayerCreationRequest {
  nickname: string;
  settings?: Partial<PlayerSettings>;
}

export interface PlayerUpdateRequest {
  nickname?: string;
  settings?: Partial<PlayerSettings>;
  isReady?: boolean;
}

export const PLAYER_CONSTRAINTS = {
  NICKNAME_MIN_LENGTH: 3,
  NICKNAME_MAX_LENGTH: 20,
  NICKNAME_REGEX: /^[a-zA-Z0-9\s]+$/,
  MAX_PENALTIES: 3,
  DEFAULT_PENALTY_DURATION: 300000, // 5 minutes
} as const;

export const DEFAULT_PLAYER_SETTINGS: PlayerSettings = {
  soundEnabled: true,
  volume: 0.7,
  animationsEnabled: true,
  reducedMotion: false,
  theme: 'auto',
  language: 'en',
}; 