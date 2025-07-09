export interface AdminUser {
  id: string;
  username: string;
  permissions: AdminPermission[];
  lastLogin: Date;
  loginAttempts: number;
  isActive: boolean;
  totpEnabled: boolean;
  ipWhitelist: string[];
}

export enum AdminPermission {
  SYSTEM_CONFIG = 'system_config',
  GAME_MONITOR = 'game_monitor',
  CONTENT_MANAGE = 'content_manage',
  SECURITY_MANAGE = 'security_manage',
  PERFORMANCE_MONITOR = 'performance_monitor',
  SUPER_ADMIN = 'super_admin',
}

export interface AdminSession {
  id: string;
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
}

export interface SystemStatus {
  status: 'online' | 'degraded' | 'offline';
  uptime: number;
  version: string;
  environment: string;
  activeConnections: number;
  activeGames: number;
  activePlayers: number;
  memoryUsage: MemoryUsage;
  cpuUsage: number;
  diskUsage: DiskUsage;
  lastHealthCheck: Date;
}

export interface MemoryUsage {
  used: number;
  total: number;
  percentage: number;
  heap: {
    used: number;
    total: number;
  };
}

export interface DiskUsage {
  used: number;
  total: number;
  percentage: number;
}

export interface AdminConfig {
  // Game settings
  gameSettings: {
    maxRounds: number;
    questionsPerRound: number;
    questionTimeLimit: number;
    basePoints: number;
    quitGamePenalty: number;
  };

  // LLM settings
  llmSettings: {
    provider: string;
    model: string;
    temperature: number;
    maxTokens: number;
    timeout: number;
    enableContentFilter: boolean;
    enableCaching: boolean;
  };

  // Security settings
  securitySettings: {
    rateLimitWindow: number;
    rateLimitMax: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableIpWhitelist: boolean;
  };

  // System settings
  systemSettings: {
    maxConcurrentGames: number;
    maxPlayersPerGame: number;
    logLevel: string;
    enableMetrics: boolean;
    enableDebug: boolean;
  };
}

export interface AdminLog {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: Date;
  userId?: string;
  action?: string;
  target?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface GameMonitorData {
  id: string;
  lobbyName: string;
  players: AdminPlayerInfo[];
  currentRound: number;
  totalRounds: number;
  status: string;
  startTime: Date;
  estimatedEndTime?: Date;
  performance: GamePerformance;
}

export interface AdminPlayerInfo {
  id: string;
  nickname: string;
  score: number;
  status: string;
  connectionQuality: string;
  joinTime: Date;
  lastActivity: Date;
  ipAddress: string;
}

export interface GamePerformance {
  averageResponseTime: number;
  questionsGenerated: number;
  llmRequests: number;
  errors: number;
  warningsCount: number;
}

export interface AdminMetrics {
  totalUsers: number;
  totalGames: number;
  totalQuestions: number;
  averageGameDuration: number;
  mostPopularTopics: string[];
  errorRate: number;
  uptime: number;
  performanceScore: number;
}

export interface SecurityAlert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  resolved: boolean;
  metadata: Record<string, any>;
}

export enum AlertType {
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  FAILED_LOGIN = 'failed_login',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  SYSTEM_ERROR = 'system_error',
  PERFORMANCE_DEGRADATION = 'performance_degradation',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
} 