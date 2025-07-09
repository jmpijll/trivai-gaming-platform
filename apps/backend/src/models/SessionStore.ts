import { v4 as uuidv4 } from 'uuid';

// Temporary type definitions until module resolution is fixed
enum LobbyStatus {
  WAITING = 'waiting',
  IN_GAME = 'in-game',
  FINISHED = 'finished',
}

enum GameStatus {
  NOT_STARTED = 'not-started',
  ACTIVE = 'active',
  PAUSED = 'paused',
  FINISHED = 'finished',
}

interface Player {
  id: string;
  nickname: string;
  sessionId: string;
  isReady: boolean;
  joinTime: Date;
  lastActivity: Date;
  currentLobby?: string;
  penalties: any[];
  settings: {
    enableSoundEffects: boolean;
    enableNotifications: boolean;
    preferredDifficulty: string;
    gameTheme: string;
  };
}

interface Lobby {
  id: string;
  name: string;
  isPrivate: boolean;
  joinCode?: string;
  ownerId: string;
  players: Player[];
  maxPlayers: number;
  gameSettings: any;
  status: LobbyStatus;
  createdAt: Date;
  lastActivity: Date;
}

interface GameState {
  id: string;
  lobbyId: string;
  players: string[];
  status: GameStatus;
  currentRound: number;
  maxRounds: number;
  currentQuestion?: any;
  questionStartTime?: Date;
  scores: any[];
  roundHistory: any[];
  settings: any;
  createdAt: Date;
  lastActivity: Date;
}

export class SessionStore {
  private players: Map<string, Player> = new Map();
  private lobbies: Map<string, Lobby> = new Map();
  private games: Map<string, GameState> = new Map();
  private sessionToPlayer: Map<string, string> = new Map();

  // Player management
  addPlayer(sessionId: string, nickname: string): Player {
    const playerId = uuidv4();
    const player: Player = {
      id: playerId,
      nickname,
      sessionId,
      isReady: false,
      joinTime: new Date(),
      lastActivity: new Date(),
      penalties: [],
      settings: {
        enableSoundEffects: true,
        enableNotifications: true,
        preferredDifficulty: 'medium',
        gameTheme: 'default',
      },
    };

    this.players.set(playerId, player);
    this.sessionToPlayer.set(sessionId, playerId);
    return player;
  }

  getPlayerBySession(sessionId: string): Player | undefined {
    const playerId = this.sessionToPlayer.get(sessionId);
    return playerId ? this.players.get(playerId) : undefined;
  }

  getPlayer(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }

  updatePlayer(playerId: string, updates: Partial<Player>): Player | undefined {
    const player = this.players.get(playerId);
    if (!player) return undefined;

    const updatedPlayer = { ...player, ...updates, lastActivity: new Date() };
    this.players.set(playerId, updatedPlayer);
    return updatedPlayer;
  }

  removePlayer(playerId: string): void {
    const player = this.players.get(playerId);
    if (player) {
      this.sessionToPlayer.delete(player.sessionId);
      this.players.delete(playerId);
    }
  }

  // Lobby management
  createLobby(name: string, ownerId: string, isPrivate: boolean): Lobby {
    const lobbyId = uuidv4();
    const lobby: Lobby = {
      id: lobbyId,
      name,
      isPrivate,
      joinCode: isPrivate ? this.generateJoinCode() : undefined,
      ownerId,
      players: [],
      maxPlayers: 4,
      gameSettings: {
        maxRounds: 5,
        questionsPerRound: 10,
        questionTimeLimit: 30000,
        roundBreakDuration: 15000,
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
        quitGamePenalty: 300000,
        reconnectionTimeout: 60000,
      },
      status: LobbyStatus.WAITING,
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.lobbies.set(lobbyId, lobby);
    return lobby;
  }

  getLobby(lobbyId: string): Lobby | undefined {
    return this.lobbies.get(lobbyId);
  }

  getPublicLobbies(): Lobby[] {
    return Array.from(this.lobbies.values()).filter(
      lobby => !lobby.isPrivate && lobby.status === LobbyStatus.WAITING
    );
  }

  addPlayerToLobby(lobbyId: string, player: Player): Lobby | undefined {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby || lobby.players.length >= lobby.maxPlayers) {
      return undefined;
    }

    const updatedPlayer = { ...player, currentLobby: lobbyId };
    this.players.set(player.id, updatedPlayer);

    lobby.players.push(updatedPlayer);
    lobby.lastActivity = new Date();
    this.lobbies.set(lobbyId, lobby);

    return lobby;
  }

  removePlayerFromLobby(lobbyId: string, playerId: string): Lobby | undefined {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return undefined;

    lobby.players = lobby.players.filter((p: Player) => p.id !== playerId);
    lobby.lastActivity = new Date();

    // Update player
    const player = this.players.get(playerId);
    if (player) {
      const updatedPlayer = { ...player, currentLobby: undefined, isReady: false };
      this.players.set(playerId, updatedPlayer);
    }

    // Remove lobby if empty
    if (lobby.players.length === 0) {
      this.lobbies.delete(lobbyId);
      return undefined;
    }

    // Transfer ownership if needed
    if (lobby.ownerId === playerId && lobby.players.length > 0) {
      lobby.ownerId = lobby.players[0].id;
    }

    this.lobbies.set(lobbyId, lobby);
    return lobby;
  }

  togglePlayerReady(lobbyId: string, playerId: string): Lobby | undefined {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return undefined;

    const playerIndex = lobby.players.findIndex((p: Player) => p.id === playerId);
    if (playerIndex === -1) return undefined;

    lobby.players[playerIndex].isReady = !lobby.players[playerIndex].isReady;
    lobby.lastActivity = new Date();

    // Update in main player store
    const player = this.players.get(playerId);
    if (player) {
      player.isReady = lobby.players[playerIndex].isReady;
      this.players.set(playerId, player);
    }

    this.lobbies.set(lobbyId, lobby);
    return lobby;
  }

  deleteLobby(lobbyId: string): void {
    const lobby = this.lobbies.get(lobbyId);
    if (lobby) {
      // Clear lobby reference from all players
      lobby.players.forEach((player: Player) => {
        const fullPlayer = this.players.get(player.id);
        if (fullPlayer) {
          fullPlayer.currentLobby = undefined;
          fullPlayer.isReady = false;
          this.players.set(player.id, fullPlayer);
        }
      });
      this.lobbies.delete(lobbyId);
    }
  }

  // Game management
  createGame(lobbyId: string): GameState | undefined {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return undefined;

    const gameId = uuidv4();
    const game: GameState = {
      id: gameId,
      lobbyId,
      players: lobby.players.map((p: Player) => p.id),
      status: GameStatus.NOT_STARTED,
      currentRound: 0,
      maxRounds: lobby.gameSettings.maxRounds,
      scores: lobby.players.map((p: Player) => ({
        playerId: p.id,
        totalScore: 0,
        roundScores: [],
        correctAnswers: 0,
        averageResponseTime: 0,
        achievements: [],
      })),
      roundHistory: [],
      settings: lobby.gameSettings,
      createdAt: new Date(),
      lastActivity: new Date(),
    };

    this.games.set(gameId, game);
    return game;
  }

  getGame(gameId: string): GameState | undefined {
    return this.games.get(gameId);
  }

  updateGame(gameId: string, updates: Partial<GameState>): GameState | undefined {
    const game = this.games.get(gameId);
    if (!game) return undefined;

    const updatedGame = { ...game, ...updates, lastActivity: new Date() };
    this.games.set(gameId, updatedGame);
    return updatedGame;
  }

  deleteGame(gameId: string): void {
    this.games.delete(gameId);
  }

  // Utility methods
  private generateJoinCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  getLobbyByJoinCode(joinCode: string): Lobby | undefined {
    return Array.from(this.lobbies.values()).find(lobby => lobby.joinCode === joinCode);
  }

  getActiveGames(): GameState[] {
    return Array.from(this.games.values()).filter(
      game => game.status === GameStatus.ACTIVE
    );
  }

  getStats() {
    return {
      players: this.players.size,
      lobbies: this.lobbies.size,
      games: this.games.size,
      activeGames: this.getActiveGames().length,
    };
  }

  cleanup(): void {
    const now = new Date();
    const timeout = 30 * 60 * 1000; // 30 minutes

    // Clean up inactive lobbies
    for (const [lobbyId, lobby] of this.lobbies.entries()) {
      if (now.getTime() - lobby.lastActivity.getTime() > timeout) {
        this.deleteLobby(lobbyId);
      }
    }

    // Clean up finished games
    for (const [gameId, game] of this.games.entries()) {
      if (game.status === GameStatus.FINISHED && 
          now.getTime() - game.lastActivity.getTime() > timeout) {
        this.deleteGame(gameId);
      }
    }
  }
}

export const sessionStore = new SessionStore(); 