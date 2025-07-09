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
  pointsDoubled: number; // Track how many times points have been doubled
  bonusWheelSpins: number; // Track bonus wheel spins earned
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
      isActive: true,
      pointsDoubled: 0,
      bonusWheelSpins: 0
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
    
    // Generate questions for this round with validation and filtering
    const questions = await llmService.generateValidatedQuestions({
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
   * Activate point doubling for a player
   */
  activatePointDoubling(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || !game.roundState) {
      return false;
    }

    const playerScore = game.scores.find(s => s.playerId === playerId);
    if (!playerScore) {
      return false;
    }

    // Players can only double points once per round
    if (playerScore.pointsDoubled >= game.currentRound) {
      return false;
    }

    playerScore.pointsDoubled += 1;
    this.games.set(gameId, game);
    return true;
  }

  /**
   * Spin bonus wheel for final round
   */
  spinBonusWheel(gameId: string, playerId: string): {
    multiplier: number;
    message: string;
  } | null {
    const game = this.games.get(gameId);
    if (!game || game.currentRound !== game.totalRounds) {
      return null; // Bonus wheel only available in final round
    }

    const playerScore = game.scores.find(s => s.playerId === playerId);
    if (!playerScore || playerScore.bonusWheelSpins >= 1) {
      return null; // Only one spin per player per game
    }

    // Bonus wheel outcomes (weighted probabilities)
    const wheelOutcomes = [
      { multiplier: 1.5, message: "Lucky spin! +50% bonus!", weight: 30 },
      { multiplier: 2.0, message: "Great spin! Double points!", weight: 20 },
      { multiplier: 3.0, message: "Amazing! Triple points!", weight: 10 },
      { multiplier: 5.0, message: "JACKPOT! 5x multiplier!", weight: 5 },
      { multiplier: 10.0, message: "LEGENDARY! 10x multiplier!", weight: 1 },
      { multiplier: 0.5, message: "Oops! Half points...", weight: 15 },
      { multiplier: 1.0, message: "No change. Better luck next time!", weight: 19 }
    ];

    // Select outcome based on weighted probability
    const totalWeight = wheelOutcomes.reduce((sum, outcome) => sum + outcome.weight, 0);
    const random = Math.random() * totalWeight;
    let currentWeight = 0;

    const selectedOutcome = wheelOutcomes.find(outcome => {
      currentWeight += outcome.weight;
      return random <= currentWeight;
    }) || wheelOutcomes[wheelOutcomes.length - 1];

    playerScore.bonusWheelSpins += 1;
    
    // Apply multiplier to final round score
    if (playerScore.roundScores[game.currentRound - 1]) {
      const originalScore = playerScore.roundScores[game.currentRound - 1];
      const bonusScore = Math.round(originalScore * (selectedOutcome.multiplier - 1));
      playerScore.roundScores[game.currentRound - 1] = originalScore + bonusScore;
      playerScore.totalScore = playerScore.roundScores.reduce((sum, score) => sum + (score || 0), 0);
    }

    this.games.set(gameId, game);
    return selectedOutcome;
  }

  /**
   * Check if player can use point doubling
   */
  canUsePointDoubling(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || !game.roundState) {
      return false;
    }

    const playerScore = game.scores.find(s => s.playerId === playerId);
    if (!playerScore) {
      return false;
    }

    // Players can use point doubling once per round, max 3 times per game
    return playerScore.pointsDoubled < Math.min(game.currentRound, 3);
  }

  /**
   * Check if player can spin bonus wheel
   */
  canSpinBonusWheel(gameId: string, playerId: string): boolean {
    const game = this.games.get(gameId);
    if (!game || game.currentRound !== game.totalRounds) {
      return false;
    }

    const playerScore = game.scores.find(s => s.playerId === playerId);
    if (!playerScore) {
      return false;
    }

    return playerScore.bonusWheelSpins < 1;
  }

  /**
   * Get detailed answer explanation
   */
  getAnswerExplanation(gameId: string, questionIndex: number): {
    question: Question;
    explanation: string;
    correctAnswer: string;
    playerAnswers: Array<{
      playerId: string;
      nickname: string;
      selectedAnswer: string;
      isCorrect: boolean;
      responseTime: number;
    }>;
  } | null {
    const game = this.games.get(gameId);
    if (!game || !game.roundState) {
      return null;
    }

    const question = game.roundState.questions[questionIndex];
    if (!question) {
      return null;
    }

    const playerAnswers = Array.from(game.roundState.playerAnswers.entries()).map(([playerId, answer]) => {
      const playerScore = game.scores.find(s => s.playerId === playerId);
      return {
        playerId,
        nickname: playerScore?.nickname || 'Unknown',
        selectedAnswer: question.answers[answer.answerIndex]?.text || 'No answer',
        isCorrect: answer.isCorrect,
        responseTime: answer.responseTime
      };
    });

    return {
      question,
      explanation: question.explanation,
      correctAnswer: question.answers[question.correctAnswerIndex].text,
      playerAnswers
    };
  }

  /**
   * Check game end conditions
   */
  checkGameEndConditions(gameId: string): {
    shouldEnd: boolean;
    reason: string;
    winner?: string;
  } {
    const game = this.games.get(gameId);
    if (!game) {
      return { shouldEnd: true, reason: 'Game not found' };
    }

    // Check if all players have disconnected
    const activePlayers = game.scores.filter(s => s.isActive).length;
    if (activePlayers === 0) {
      return { shouldEnd: true, reason: 'All players disconnected' };
    }

    // Check if only one player remains
    if (activePlayers === 1) {
      const winner = game.scores.find(s => s.isActive)?.nickname || 'Unknown';
      return { shouldEnd: true, reason: 'Only one player remaining', winner };
    }

    // Check if maximum rounds reached
    if (game.currentRound >= game.totalRounds && game.roundState?.isComplete) {
      const topPlayer = this.getTopPlayer(game.scores);
      return { shouldEnd: true, reason: 'Maximum rounds completed', winner: topPlayer };
    }

    // Check if there's a decisive leader (50% more points than second place)
    const sortedScores = [...game.scores].sort((a, b) => b.totalScore - a.totalScore);
    if (sortedScores.length >= 2 && sortedScores[0].totalScore > sortedScores[1].totalScore * 1.5) {
      const leadMargin = sortedScores[0].totalScore - sortedScores[1].totalScore;
      const maxPossiblePoints = game.settings.basePoints * game.totalRounds * 3; // Rough estimate
      if (leadMargin > maxPossiblePoints * 0.3) { // 30% of max possible points
        return { shouldEnd: true, reason: 'Decisive leader', winner: sortedScores[0].nickname };
      }
    }

    return { shouldEnd: false, reason: 'Game continues' };
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
      
      // Point doubling bonus (if activated this round)
      if (playerScore.pointsDoubled >= game.currentRound) {
        points *= 2;
      }
      
      // Streak bonus (every 3 correct answers in a row)
      if (playerScore.streak > 0 && playerScore.streak % 3 === 0) {
        points *= 1.25; // 25% bonus for streak
      }
      
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