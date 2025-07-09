export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  services: {
    database: 'ok' | 'down';
    websocket: 'ok' | 'down';
    llm: 'ok' | 'down';
  };
}

export interface SystemStats {
  totalGames: number;
  activeGames: number;
  totalPlayers: number;
  activePlayers: number;
  totalLobbies: number;
  publicLobbies: number;
  privateLobbies: number;
  serverUptime: number;
  memoryUsage: {
    used: number;
    total: number;
    percentage: number;
  };
}

export interface ConfigResponse {
  maintenance: boolean;
  registrationEnabled: boolean;
  maxPlayersPerLobby: number;
  maxActiveGames: number;
  rateLimit: {
    lobbyCreation: number;
    joinAttempts: number;
    websocketMessages: number;
  };
  gameSettings: {
    defaultMaxRounds: number;
    questionTimeLimit: number;
    roundBreakDuration: number;
  };
}

export interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
} 