import { z } from 'zod';
import { LOBBY_CONSTRAINTS } from './types/lobby';
import { PLAYER_CONSTRAINTS } from './types/player';
import { QUESTION_CONSTRAINTS } from './types/question';

// Player schemas
export const PlayerCreationSchema = z.object({
  nickname: z.string()
    .min(PLAYER_CONSTRAINTS.NICKNAME_MIN_LENGTH, 'Nickname too short')
    .max(PLAYER_CONSTRAINTS.NICKNAME_MAX_LENGTH, 'Nickname too long')
    .regex(PLAYER_CONSTRAINTS.NICKNAME_REGEX, 'Nickname contains invalid characters'),
  settings: z.object({
    soundEnabled: z.boolean().optional(),
    volume: z.number().min(0).max(1).optional(),
    animationsEnabled: z.boolean().optional(),
    reducedMotion: z.boolean().optional(),
    theme: z.enum(['light', 'dark', 'auto']).optional(),
    language: z.string().optional(),
  }).optional(),
});

export const PlayerUpdateSchema = z.object({
  nickname: z.string()
    .min(PLAYER_CONSTRAINTS.NICKNAME_MIN_LENGTH)
    .max(PLAYER_CONSTRAINTS.NICKNAME_MAX_LENGTH)
    .regex(PLAYER_CONSTRAINTS.NICKNAME_REGEX)
    .optional(),
  settings: z.object({
    soundEnabled: z.boolean().optional(),
    volume: z.number().min(0).max(1).optional(),
    animationsEnabled: z.boolean().optional(),
    reducedMotion: z.boolean().optional(),
    theme: z.enum(['light', 'dark', 'auto']).optional(),
    language: z.string().optional(),
  }).partial().optional(),
  isReady: z.boolean().optional(),
});

// Lobby schemas
export const LobbyCreationSchema = z.object({
  name: z.string()
    .min(LOBBY_CONSTRAINTS.NAME_MIN_LENGTH, 'Lobby name too short')
    .max(LOBBY_CONSTRAINTS.NAME_MAX_LENGTH, 'Lobby name too long')
    .trim(),
  isPrivate: z.boolean(),
  maxPlayers: z.number()
    .min(LOBBY_CONSTRAINTS.MIN_PLAYERS)
    .max(LOBBY_CONSTRAINTS.MAX_PLAYERS)
    .optional(),
  gameSettings: z.object({
    maxRounds: z.number().min(1).max(10).optional(),
    questionsPerRound: z.number().min(5).max(20).optional(),
    questionTimeLimit: z.number().min(10000).max(120000).optional(),
    customTopics: z.array(z.string()).optional(),
    allowLateJoin: z.boolean().optional(),
    autoStart: z.boolean().optional(),
  }).optional(),
});

export const LobbyJoinSchema = z.object({
  lobbyId: z.string().uuid('Invalid lobby ID'),
  joinCode: z.string()
    .length(LOBBY_CONSTRAINTS.JOIN_CODE_LENGTH, 'Invalid join code')
    .optional(),
  nickname: z.string()
    .min(PLAYER_CONSTRAINTS.NICKNAME_MIN_LENGTH)
    .max(PLAYER_CONSTRAINTS.NICKNAME_MAX_LENGTH)
    .regex(PLAYER_CONSTRAINTS.NICKNAME_REGEX),
});

export const LobbyUpdateSchema = z.object({
  name: z.string()
    .min(LOBBY_CONSTRAINTS.NAME_MIN_LENGTH)
    .max(LOBBY_CONSTRAINTS.NAME_MAX_LENGTH)
    .trim()
    .optional(),
  gameSettings: z.object({
    maxRounds: z.number().min(1).max(10).optional(),
    questionsPerRound: z.number().min(5).max(20).optional(),
    questionTimeLimit: z.number().min(10000).max(120000).optional(),
    customTopics: z.array(z.string()).optional(),
    allowLateJoin: z.boolean().optional(),
    autoStart: z.boolean().optional(),
  }).partial().optional(),
});

// Question schemas
export const QuestionRequestSchema = z.object({
  topic: z.string()
    .min(2, 'Topic too short')
    .max(100, 'Topic too long'),
  difficulty: z.enum(['easy', 'medium', 'hard', 'extreme']),
  count: z.number()
    .min(1, 'Must request at least 1 question')
    .max(50, 'Too many questions requested'),
  excludeIds: z.array(z.string().uuid()).optional(),
  customPrompt: z.string().max(1000).optional(),
});

export const AnswerSubmissionSchema = z.object({
  questionId: z.string().uuid('Invalid question ID'),
  answerIndex: z.number()
    .min(0, 'Answer index must be 0 or greater')
    .max(3, 'Answer index must be 3 or less'),
  responseTime: z.number()
    .min(0, 'Response time cannot be negative')
    .max(120000, 'Response time too long'),
});

// Game schemas
export const GameActionSchema = z.object({
  action: z.enum(['start', 'pause', 'resume', 'end', 'kick-player']),
  target: z.string().optional(),
  data: z.any().optional(),
});

export const TopicSelectionSchema = z.object({
  topic: z.string()
    .min(2, 'Topic too short')
    .max(100, 'Topic too long'),
});

// Admin schemas
export const AdminLoginSchema = z.object({
  username: z.string()
    .min(3, 'Username too short')
    .max(50, 'Username too long'),
  password: z.string()
    .min(8, 'Password too short'),
  totpCode: z.string()
    .length(6, 'TOTP code must be 6 digits')
    .regex(/^\d+$/, 'TOTP code must be numeric')
    .optional(),
});

export const AdminConfigSchema = z.object({
  gameSettings: z.object({
    maxRounds: z.number().min(1).max(10),
    questionsPerRound: z.number().min(5).max(20),
    questionTimeLimit: z.number().min(10000).max(120000),
    basePoints: z.number().min(1).max(1000),
    quitGamePenalty: z.number().min(0).max(3600000),
  }).optional(),
  llmSettings: z.object({
    provider: z.string(),
    model: z.string(),
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().min(100).max(4000),
    timeout: z.number().min(5000).max(120000),
    enableContentFilter: z.boolean(),
    enableCaching: z.boolean(),
  }).optional(),
  securitySettings: z.object({
    rateLimitWindow: z.number().min(60000).max(3600000),
    rateLimitMax: z.number().min(10).max(1000),
    sessionTimeout: z.number().min(300000).max(86400000),
    maxLoginAttempts: z.number().min(3).max(20),
    enableIpWhitelist: z.boolean(),
  }).optional(),
  systemSettings: z.object({
    maxConcurrentGames: z.number().min(1).max(1000),
    maxPlayersPerGame: z.number().min(2).max(10),
    logLevel: z.enum(['error', 'warn', 'info', 'debug']),
    enableMetrics: z.boolean(),
    enableDebug: z.boolean(),
  }).optional(),
});

// WebSocket message schemas
export const WebSocketMessageSchema = z.object({
  event: z.string(),
  data: z.any(),
  timestamp: z.date().optional(),
  id: z.string().uuid().optional(),
});

// Common validation schemas
export const UUIDSchema = z.string().uuid('Invalid UUID format');
export const TimestampSchema = z.date().or(z.string().datetime());

// Type inference
export type PlayerCreationInput = z.infer<typeof PlayerCreationSchema>;
export type PlayerUpdateInput = z.infer<typeof PlayerUpdateSchema>;
export type LobbyCreationInput = z.infer<typeof LobbyCreationSchema>;
export type LobbyJoinInput = z.infer<typeof LobbyJoinSchema>;
export type LobbyUpdateInput = z.infer<typeof LobbyUpdateSchema>;
export type QuestionRequestInput = z.infer<typeof QuestionRequestSchema>;
export type AnswerSubmissionInput = z.infer<typeof AnswerSubmissionSchema>;
export type GameActionInput = z.infer<typeof GameActionSchema>;
export type TopicSelectionInput = z.infer<typeof TopicSelectionSchema>;
export type AdminLoginInput = z.infer<typeof AdminLoginSchema>;
export type AdminConfigInput = z.infer<typeof AdminConfigSchema>;
export type WebSocketMessageInput = z.infer<typeof WebSocketMessageSchema>; 