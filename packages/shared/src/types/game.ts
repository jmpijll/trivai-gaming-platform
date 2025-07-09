export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXTREME = 'extreme',
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: DifficultyLevel;
  topic: string;
  timeLimit: number;
}

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface GameSettings {
  maxRounds: number;
  questionsPerRound: number;
  questionTimeLimit: number;
  roundBreakDuration: number;
  basePoints: number;
  timeBonus: boolean;
  difficultyMultiplier: {
    easy: number;
    medium: number;
    hard: number;
  };
  finalRoundMultiplier: {
    min: number;
    max: number;
  };
  quitGamePenalty: number;
  reconnectionTimeout: number;
}

export interface GameState {
  id: string;
  lobbyId: string;
  players: string[]; // Player IDs
  currentRound: number;
  totalRounds: number;
  roundState: RoundState;
  scores: PlayerScore[];
  gameStatus: GameStatus;
  settings: GameSettings;
  startTime: Date;
  endTime?: Date;
}

export interface RoundState {
  roundNumber: number;
  topic: string;
  questions: string[]; // Question IDs
  currentQuestionIndex: number;
  questionStartTime: number;
  roundMultiplier: number;
  playerAnswers: Map<string, number>;
  isComplete: boolean;
}

export interface PlayerScore {
  playerId: string;
  roundScores: number[];
  totalScore: number;
  correctAnswers: number;
  averageResponseTime: number;
  streak: number;
}

export interface ScoringRule {
  basePoints: number;
  roundMultiplier: number;
  timeBonus: boolean;
  finalRoundWheelMultiplier?: number;
}

export interface GameStats {
  totalQuestions: number;
  totalCorrectAnswers: number;
  averageResponseTime: number;
  questionsGenerated: number;
  gameStartTime: Date;
  gameEndTime: Date;
  gameDuration: number;
  playersJoined: number;
  playersCompleted: number;
}

export interface RoundSummary {
  roundNumber: number;
  topic: string;
  questionsAnswered: number;
  scores: PlayerScore[];
  topPlayer: string;
  roundDuration: number;
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  maxRounds: 5,
  questionsPerRound: 10,
  questionTimeLimit: 30000, // 30 seconds
  roundBreakDuration: 15000, // 15 seconds
  basePoints: 100,
  timeBonus: true,
  difficultyMultiplier: {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
  },
  finalRoundMultiplier: {
    min: 1,
    max: 10,
  },
  quitGamePenalty: 300000, // 5 minutes
  reconnectionTimeout: 60000, // 60 seconds
}; 