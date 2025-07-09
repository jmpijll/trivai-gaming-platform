export enum LobbyStatus {
  WAITING = 'waiting',
  STARTING = 'starting',
  IN_GAME = 'in_game',
  COMPLETED = 'completed',
  CLOSED = 'closed',
}

export interface Lobby {
  id: string;
  name: string;
  isPrivate: boolean;
  joinCode?: string;
  ownerId: string;
  players: string[]; // Player IDs
  maxPlayers: number;
  currentPlayerCount: number;
  gameSettings: LobbyGameSettings;
  status: LobbyStatus;
  createdAt: Date;
  lastActivity: Date;
  gameId?: string;
}

export interface LobbyGameSettings {
  maxRounds?: number;
  questionsPerRound?: number;
  questionTimeLimit?: number;
  customTopics?: string[];
  allowLateJoin?: boolean;
  autoStart?: boolean;
}

export interface LobbyCreationRequest {
  name: string;
  isPrivate: boolean;
  maxPlayers?: number;
  gameSettings?: LobbyGameSettings;
}

export interface LobbyJoinRequest {
  lobbyId: string;
  joinCode?: string;
  nickname: string;
}

export interface LobbyUpdateRequest {
  name?: string;
  gameSettings?: Partial<LobbyGameSettings>;
}

export interface LobbyListItem {
  id: string;
  name: string;
  currentPlayerCount: number;
  maxPlayers: number;
  status: LobbyStatus;
  isPrivate: boolean;
  createdAt: Date;
}

export const LOBBY_CONSTRAINTS = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 32,
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 4,
  JOIN_CODE_LENGTH: 6,
  MAX_LOBBIES_PER_USER: 3,
} as const; 