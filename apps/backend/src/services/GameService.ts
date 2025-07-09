import { v4 as uuidv4 } from 'uuid';
import { llmService, Question, DifficultyLevel } from './LLMService';

// Local game types (will be moved to shared package later)
export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
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
    extreme: number;
  };
  finalRoundMultiplier: {
    min: number;
    max: number;
  };
  quitGamePenalty: number;
  reconnectionTimeout: number;
}

export interface PlayerScore {
  playerId: string;
  nickname: string;
  roundScores: number[];
  totalScore: number;
  correctAnswers: number;
  averageResponseTime: number;
  streak: number;
  isActive: boolean;
}

export interface RoundState {
  roundNumber: number;
  topic: string;
  questions: Question[];
  currentQuestionIndex: number;
  questionStartTime: number;
  roundMultiplier: number;
  playerAnswers: Map<string, { answerIndex: number; responseTime: number; isCorrect: boolean }>;
  isComplete: boolean;
  difficulty: DifficultyLevel;
}

export interface GameState {
  id: string;
  lobbyId: string;
  players: string[]; // Player IDs
  currentRound: number;
  totalRounds: number;
  roundState?: RoundState;
  scores: PlayerScore[];
  gameStatus: GameStatus;
  settings: GameSettings;
  startTime: Date;
  endTime?: Date;
  availableTopics: string[];
  questionHistory: string[]; // Track used questions
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
  difficulty: DifficultyLevel;
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
    extreme: 3.0,
  },
  finalRoundMultiplier: {
    min: 1,
    max: 10,
  },
  quitGamePenalty: 300000, // 5 minutes
  reconnectionTimeout: 60000, // 60 seconds
};

export class GameService {
  private games: Map<string, GameState> = new Map();
  private gameTimers: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Create a new game
   */
  async createGame(lobbyId: string, playerIds: string[], playerNicknames: Map<string, string>): Promise<GameState> {
    const gameId = uuidv4();
    
    // Initialize player scores
    const scores: PlayerScore[] = playerIds.map(playerId => ({
      playerId,
      nickname: playerNicknames.get(playerId) || 'Unknown',
      roundScores: [],
      totalScore: 0,
      correctAnswers: 0,
      averageResponseTime: 0,
      streak: 0,
      isActive: true
    }));

    // Generate available topics
    const availableTopics = await llmService.generateTopics(15);

    const gameState: GameState = {
      id: gameId,
      lobbyId,
      players: [...playerIds],
      currentRound: 0,
      totalRounds: DEFAULT_GAME_SETTINGS.maxRounds,
      scores,
      gameStatus: GameStatus.WAITING,
      settings: { ...DEFAULT_GAME_SETTINGS },
      startTime: new Date(),
      availableTopics,
      questionHistory: []
    };

    this.games.set(gameId, gameState);
    return gameState;
  }

  /**
   * Start a game
   */
  async startGame(gameId: string): Promise<GameState | null> {
    const game = this.games.get(gameId);
    if (!game || game.gameStatus !== GameStatus.WAITING) {
      return null;
    }

    game.gameStatus = GameStatus.IN_PROGRESS;
    game.startTime = new Date();
    
    this.games.set(gameId, game);
    return game;
  }

  /**
   * Start a new round with topic selection
   */
  async startRound(gameId: string, topic: string): Promise<RoundState | null> {
    const game = this.games.get(gameId);
    if (!game || game.gameStatus !== GameStatus.IN_PROGRESS) {
      return null;
    }

    game.currentRound += 1;
    
    // Determine difficulty based on round number
    const difficulty = this.getDifficultyForRound(game.currentRound, game.totalRounds);
    
    // Generate questions for this round
    const questions = await llmService.generateQuestions({
      topic,
      difficulty,
      count: game.settings.questionsPerRound,
      previousQuestions: game.questionHistory
    });

    // Update question history
    game.questionHistory.push(...questions.map(q => q.text));

    // Create round state
    const roundState: RoundState = {
      roundNumber: game.currentRound,
      topic,
      questions,
      currentQuestionIndex: 0,
      questionStartTime: Date.now(),
      roundMultiplier: game.currentRound, // 1x, 2x, 3x, 4x, 5x
      playerAnswers: new Map(),
      isComplete: false,
      difficulty
    };

    game.roundState = roundState;
    this.games.set(gameId, game);

    // Start question timer
    this.startQuestionTimer(gameId, questions[0].timeLimit);

    return roundState;
  }

  /**
   * Submit a player's answer
   */
  submitAnswer(gameId: string, playerId: string, answerIndex: number): boolean {
    const game = this.games.get(gameId);
    if (!game || !game.roundState || game.roundState.isComplete) {
      return false;
    }

    const currentQuestion = game.roundState.questions[game.roundState.currentQuestionIndex];
    if (!currentQuestion) {
      return false;
    }

    const responseTime = Date.now() - game.roundState.questionStartTime;
    const isCorrect = answerIndex === currentQuestion.correctAnswerIndex;

    // Store answer
    game.roundState.playerAnswers.set(playerId, {
      answerIndex,
      responseTime,
      isCorrect
    });

    // Update player score
    this.updatePlayerScore(game, playerId, isCorrect, responseTime);

    this.games.set(gameId, game);
    return true;
  }

  /**
   * Move to next question
   */
  nextQuestion(gameId: string): Question | null {
    const game = this.games.get(gameId);
    if (!game || !game.roundState) {
      return null;
    }

    // Clear current question timer
    this.clearQuestionTimer(gameId);

    game.roundState.currentQuestionIndex += 1;
    
    if (game.roundState.currentQuestionIndex >= game.roundState.questions.length) {
      // Round is complete
      this.completeRound(gameId);
      return null;
    }

    // Start next question
    const nextQuestion = game.roundState.questions[game.roundState.currentQuestionIndex];
    game.roundState.questionStartTime = Date.now();
    game.roundState.playerAnswers.clear();

    this.games.set(gameId, game);

    // Start question timer
    this.startQuestionTimer(gameId, nextQuestion.timeLimit);

    return nextQuestion;
  }

  /**
   * Complete current round
   */
  completeRound(gameId: string): RoundSummary | null {
    const game = this.games.get(gameId);
    if (!game || !game.roundState) {
      return null;
    }

    game.roundState.isComplete = true;
    this.clearQuestionTimer(gameId);

    const summary: RoundSummary = {
      roundNumber: game.roundState.roundNumber,
      topic: game.roundState.topic,
      questionsAnswered: game.roundState.currentQuestionIndex + 1,
      scores: [...game.scores],
      topPlayer: this.getTopPlayer(game.scores),
      roundDuration: Date.now() - game.roundState.questionStartTime,
      difficulty: game.roundState.difficulty
    };

    // Check if game is complete
    if (game.currentRound >= game.totalRounds) {
      this.completeGame(gameId);
    }

    this.games.set(gameId, game);
    return summary;
  }

  /**
   * Complete the game
   */
  completeGame(gameId: string): GameStats | null {
    const game = this.games.get(gameId);
    if (!game) {
      return null;
    }

    game.gameStatus = GameStatus.COMPLETED;
    game.endTime = new Date();

    this.clearQuestionTimer(gameId);

    const stats: GameStats = {
      totalQuestions: game.questionHistory.length,
      totalCorrectAnswers: game.scores.reduce((sum, score) => sum + score.correctAnswers, 0),
      averageResponseTime: this.calculateAverageResponseTime(game.scores),
      questionsGenerated: game.questionHistory.length,
      gameStartTime: game.startTime,
      gameEndTime: game.endTime,
      gameDuration: game.endTime.getTime() - game.startTime.getTime(),
      playersJoined: game.players.length,
      playersCompleted: game.scores.filter(s => s.isActive).length
    };

    this.games.set(gameId, game);
    return stats;
  }

  /**
   * Get game state
   */
  getGame(gameId: string): GameState | undefined {
    return this.games.get(gameId);
  }

  /**
   * Remove player from game
   */
  removePlayer(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game) {
      return false;
    }

    // Mark player as inactive
    const playerScore = game.scores.find(s => s.playerId === playerId);
    if (playerScore) {
      playerScore.isActive = false;
    }

    // Check if game should be cancelled
    const activePlayers = game.scores.filter(s => s.isActive).length;
    if (activePlayers < 2) {
      game.gameStatus = GameStatus.CANCELLED;
      this.clearQuestionTimer(gameId);
    }

    this.games.set(gameId, game);
    return true;
  }

  /**
   * Delete game
   */
  deleteGame(gameId: string): void {
    this.clearQuestionTimer(gameId);
    this.games.delete(gameId);
  }

  /**
   * Get active games
   */
  getActiveGames(): GameState[] {
    return Array.from(this.games.values()).filter(
      game => game.gameStatus === GameStatus.IN_PROGRESS || game.gameStatus === GameStatus.WAITING
    );
  }

  // Private helper methods

  private getDifficultyForRound(round: number, totalRounds: number): DifficultyLevel {
    if (round === totalRounds) return DifficultyLevel.EXTREME; // Final round
    if (round >= totalRounds - 1) return DifficultyLevel.HARD;
    if (round >= totalRounds / 2) return DifficultyLevel.MEDIUM;
    return DifficultyLevel.EASY;
  }

  private updatePlayerScore(game: GameState, playerId: string, isCorrect: boolean, responseTime: number): void {
    const playerScore = game.scores.find(s => s.playerId === playerId);
    if (!playerScore || !game.roundState) return;

    if (isCorrect) {
      playerScore.correctAnswers += 1;
      
      // Calculate points with multipliers
      let points = game.settings.basePoints * game.roundState.roundMultiplier;
      
      // Time bonus
      if (game.settings.timeBonus) {
        const timeBonus = Math.max(0, 1 - (responseTime / game.settings.questionTimeLimit));
        points *= (1 + timeBonus * 0.5); // Up to 50% bonus for fast answers
      }
      
      // Difficulty multiplier
      points *= game.settings.difficultyMultiplier[game.roundState.difficulty];
      
      playerScore.roundScores[game.roundState.roundNumber - 1] = 
        (playerScore.roundScores[game.roundState.roundNumber - 1] || 0) + Math.round(points);
      
      playerScore.streak += 1;
    } else {
      playerScore.streak = 0;
    }

    // Update total score
    playerScore.totalScore = playerScore.roundScores.reduce((sum, score) => sum + (score || 0), 0);
    
    // Update average response time
    const totalAnswers = playerScore.correctAnswers + 
      (game.roundState.playerAnswers.size - playerScore.correctAnswers);
    playerScore.averageResponseTime = 
      (playerScore.averageResponseTime * (totalAnswers - 1) + responseTime) / totalAnswers;
  }

  private getTopPlayer(scores: PlayerScore[]): string {
    const topPlayer = scores.reduce((top, current) => 
      current.totalScore > top.totalScore ? current : top
    );
    return topPlayer.nickname;
  }

  private calculateAverageResponseTime(scores: PlayerScore[]): number {
    const totalTime = scores.reduce((sum, score) => sum + score.averageResponseTime, 0);
    return totalTime / scores.length;
  }

  private startQuestionTimer(gameId: string, timeLimit: number): void {
    this.clearQuestionTimer(gameId);
    
    const timer = setTimeout(() => {
      this.nextQuestion(gameId);
    }, timeLimit);
    
    this.gameTimers.set(gameId, timer);
  }

  private clearQuestionTimer(gameId: string): void {
    const timer = this.gameTimers.get(gameId);
    if (timer) {
      clearTimeout(timer);
      this.gameTimers.delete(gameId);
    }
  }
}

// Export singleton instance
export const gameService = new GameService(); 