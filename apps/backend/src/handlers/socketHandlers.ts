import { Server, Socket } from 'socket.io';
import { sessionStore } from '../models/SessionStore';
import { gameService, GameState, RoundState } from '../services/GameService';
import { llmService, Question } from '../services/LLMService';

// Enhanced event interfaces for game functionality
interface ClientToServerEvents {
  'create-lobby': (data: { name: string; isPrivate: boolean; nickname: string }) => void;
  'join-lobby': (data: { lobbyId: string; joinCode?: string; nickname: string }) => void;
  'leave-lobby': (data: { lobbyId: string }) => void;
  'toggle-ready': (data: { lobbyId: string }) => void;
  'start-game': (data: { lobbyId: string }) => void;
  
  // Game events
  'select-topic': (data: { gameId: string; topic: string }) => void;
  'submit-answer': (data: { gameId: string; answerIndex: number }) => void;
  'request-next-question': (data: { gameId: string }) => void;
  'quit-game': (data: { gameId: string }) => void;
  'get-game-state': (data: { gameId: string }) => void;
  
  // Testing events
  'test-llm': () => void;
  'generate-sample-questions': (data: { topic: string; count: number }) => void;
  
  ping: () => void;
}

interface ServerToClientEvents {
  // Lobby events
  'lobby-created': (data: { lobby: any; player: any }) => void;
  'lobby-updated': (data: { lobby: any }) => void;
  'lobby-error': (data: { message: string; lobbyId?: string }) => void;
  'player-joined': (data: { player: any; lobby: any }) => void;
  'player-left': (data: { playerId: string; lobby: any }) => void;
  
  // Game events
  'game-created': (data: { game: GameState }) => void;
  'game-started': (data: { game: GameState }) => void;
  'game-error': (data: { message: string; gameId?: string }) => void;
  'topic-selection': (data: { availableTopics: string[]; gameId: string }) => void;
  'round-started': (data: { roundState: RoundState; gameId: string }) => void;
  'question-displayed': (data: { question: Question; timeRemaining: number; gameId: string }) => void;
  'answer-submitted': (data: { playerId: string; isCorrect: boolean; gameId: string }) => void;
  'question-ended': (data: { question: Question; correctAnswerIndex: number; explanation: string; scores: any[]; gameId: string }) => void;
  'round-ended': (data: { summary: any; gameId: string; isGameComplete: boolean }) => void;
  'game-completed': (data: { stats: any; finalScores: any[]; gameId: string }) => void;
  'game-state-updated': (data: { game: GameState }) => void;
  
  // Testing events
  'llm-test-result': (data: { success: boolean; message: string }) => void;
  'sample-questions': (data: { questions: Question[] }) => void;
  
  pong: () => void;
}

type SocketWithData = Socket<ClientToServerEvents, ServerToClientEvents> & {
  playerId?: string;
  gameId?: string;
};

// Helper function to handle moving to next question
function handleNextQuestion(gameId: string, io: Server) {
  const game = gameService.getGame(gameId);
  if (!game || !game.roundState) {
    return;
  }

  const currentQuestion = game.roundState.questions[game.roundState.currentQuestionIndex];
  
  // Show question results first
  io.to(gameId).emit('question-ended', {
    question: currentQuestion,
    correctAnswerIndex: currentQuestion.correctAnswerIndex,
    explanation: currentQuestion.explanation,
    scores: game.scores,
    gameId
  });

  // Move to next question or complete round
  const nextQuestion = gameService.nextQuestion(gameId);
  
  if (nextQuestion) {
    // Show next question
    setTimeout(() => {
      io.to(gameId).emit('question-displayed', {
        question: nextQuestion,
        timeRemaining: nextQuestion.timeLimit,
        gameId
      });
    }, 3000); // 3 second delay to show results
  } else {
    // Round completed
    const summary = gameService.completeRound(gameId);
    if (summary) {
      const updatedGame = gameService.getGame(gameId);
      const isGameComplete = updatedGame?.gameStatus === 'completed';
      
      io.to(gameId).emit('round-ended', {
        summary,
        gameId,
        isGameComplete
      });

      if (isGameComplete) {
        const stats = gameService.completeGame(gameId);
        io.to(gameId).emit('game-completed', {
          stats,
          finalScores: updatedGame?.scores || [],
          gameId
        });
      } else {
        // Show topic selection for next round
        setTimeout(() => {
          io.to(gameId).emit('topic-selection', {
            availableTopics: updatedGame?.availableTopics || [],
            gameId
          });
        }, 5000); // 5 second delay between rounds
      }
    }
  }
}

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: SocketWithData) => {
    console.log('Client connected:', socket.id);

    // Connection handlers
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Testing handlers
    socket.on('test-llm', async () => {
      try {
        const isConnected = await llmService.testConnection();
        socket.emit('llm-test-result', {
          success: isConnected,
          message: isConnected ? 'LLM service is working!' : 'LLM service connection failed'
        });
      } catch (error) {
        socket.emit('llm-test-result', {
          success: false,
          message: `LLM test error: ${error}`
        });
      }
    });

    socket.on('generate-sample-questions', async (data) => {
      try {
        const questions = await llmService.generateQuestions({
          topic: data.topic,
          difficulty: 'medium' as any,
          count: data.count || 3
        });
        socket.emit('sample-questions', { questions });
      } catch (error) {
        socket.emit('game-error', {
          message: `Failed to generate questions: ${error}`,
        });
      }
    });

    // Existing lobby management handlers (keeping them as they were)
    socket.on('create-lobby', async (data) => {
      try {
        const { name, isPrivate, nickname } = data;

        // Validate input
        if (!name || name.trim().length < 3 || name.trim().length > 32) {
          socket.emit('lobby-error', {
            message: 'Lobby name must be between 3 and 32 characters',
          });
          return;
        }

        if (!nickname || nickname.trim().length < 3 || nickname.trim().length > 20) {
          socket.emit('lobby-error', {
            message: 'Nickname must be between 3 and 20 characters',
          });
          return;
        }

        // Create or get player
        let player = sessionStore.getPlayerBySession(socket.id);
        if (!player) {
          player = sessionStore.addPlayer(socket.id, nickname.trim());
        } else {
          player = sessionStore.updatePlayer(player.id, { nickname: nickname.trim() });
        }

        if (!player) {
          socket.emit('lobby-error', { message: 'Failed to create player' });
          return;
        }

        // Create lobby
        const lobby = sessionStore.createLobby(name.trim(), player.id, isPrivate);
        
        // Add player to lobby
        const updatedLobby = sessionStore.addPlayerToLobby(lobby.id, player);
        if (!updatedLobby) {
          socket.emit('lobby-error', { message: 'Failed to join created lobby' });
          return;
        }

        // Join socket room
        socket.join(lobby.id);
        socket.playerId = player.id;

        // Emit success
        socket.emit('lobby-created', { lobby: updatedLobby, player });
        
        console.log(`Player ${player.nickname} created lobby: ${lobby.name}`);
      } catch (error) {
        console.error('Error creating lobby:', error);
        socket.emit('lobby-error', { message: 'Failed to create lobby' });
      }
    });

    socket.on('join-lobby', async (data) => {
      try {
        const { lobbyId, joinCode, nickname } = data;

        // Validate input
        if (!nickname || nickname.trim().length < 3 || nickname.trim().length > 20) {
          socket.emit('lobby-error', {
            message: 'Nickname must be between 3 and 20 characters',
            lobbyId,
          });
          return;
        }

        // Find lobby
        let lobby = sessionStore.getLobby(lobbyId);
        
        // If not found by ID, try by join code
        if (!lobby && joinCode) {
          lobby = sessionStore.getLobbyByJoinCode(joinCode);
        }

        if (!lobby) {
          socket.emit('lobby-error', {
            message: 'Lobby not found',
            lobbyId,
          });
          return;
        }

        // Check if lobby is private and requires join code
        if (lobby.isPrivate && lobby.joinCode !== joinCode) {
          socket.emit('lobby-error', {
            message: 'Invalid join code',
            lobbyId: lobby.id,
          });
          return;
        }

        // Check if lobby is full
        if (lobby.players.length >= lobby.maxPlayers) {
          socket.emit('lobby-error', {
            message: 'Lobby is full',
            lobbyId: lobby.id,
          });
          return;
        }

        // Check if lobby is in game
        if (lobby.status !== 'waiting') {
          socket.emit('lobby-error', {
            message: 'Cannot join lobby while game is in progress',
            lobbyId: lobby.id,
          });
          return;
        }

        // Create or get player
        let player = sessionStore.getPlayerBySession(socket.id);
        if (!player) {
          player = sessionStore.addPlayer(socket.id, nickname.trim());
        } else {
          player = sessionStore.updatePlayer(player.id, { nickname: nickname.trim() });
        }

        if (!player) {
          socket.emit('lobby-error', { message: 'Failed to create player' });
          return;
        }

        // Add player to lobby
        const updatedLobby = sessionStore.addPlayerToLobby(lobby.id, player);
        if (!updatedLobby) {
          socket.emit('lobby-error', {
            message: 'Failed to join lobby',
            lobbyId: lobby.id,
          });
          return;
        }

        // Join socket room
        socket.join(lobby.id);
        socket.playerId = player.id;

        // Notify all players in the lobby
        socket.to(lobby.id).emit('player-joined', { player, lobby: updatedLobby });
        socket.emit('lobby-updated', { lobby: updatedLobby });
        
        console.log(`Player ${player.nickname} joined lobby: ${lobby.name}`);
      } catch (error) {
        console.error('Error joining lobby:', error);
        socket.emit('lobby-error', { message: 'Failed to join lobby' });
      }
    });

    socket.on('leave-lobby', async (data) => {
      try {
        const { lobbyId } = data;
        
        if (!socket.playerId) {
          socket.emit('lobby-error', { message: 'Player not found' });
          return;
        }

        const lobby = sessionStore.removePlayerFromLobby(lobbyId, socket.playerId);
        if (!lobby) {
          socket.emit('lobby-error', { message: 'Failed to leave lobby' });
          return;
        }

        // Leave socket room
        socket.leave(lobbyId);
        
        // Notify remaining players
        socket.to(lobbyId).emit('player-left', { playerId: socket.playerId, lobby });
        
        console.log(`Player ${socket.playerId} left lobby: ${lobbyId}`);
      } catch (error) {
        console.error('Error leaving lobby:', error);
        socket.emit('lobby-error', { message: 'Failed to leave lobby' });
      }
    });

    socket.on('toggle-ready', async (data) => {
      try {
        const { lobbyId } = data;
        
        if (!socket.playerId) {
          socket.emit('lobby-error', { message: 'Player not found' });
          return;
        }

        const lobby = sessionStore.togglePlayerReady(lobbyId, socket.playerId);
        if (!lobby) {
          socket.emit('lobby-error', { message: 'Failed to toggle ready status' });
          return;
        }

        // Notify all players in the lobby
        io.to(lobbyId).emit('lobby-updated', { lobby });
        
        console.log(`Player ${socket.playerId} toggled ready in lobby: ${lobbyId}`);
      } catch (error) {
        console.error('Error toggling ready:', error);
        socket.emit('lobby-error', { message: 'Failed to toggle ready status' });
      }
    });

    // Enhanced start-game handler with game creation
    socket.on('start-game', async (data) => {
      try {
        const { lobbyId } = data;
        
        if (!socket.playerId) {
          socket.emit('lobby-error', { message: 'Player not found' });
          return;
        }

        const lobby = sessionStore.getLobby(lobbyId);
        if (!lobby) {
          socket.emit('lobby-error', { message: 'Lobby not found' });
          return;
        }

        // Check if player is lobby owner
        if (lobby.ownerId !== socket.playerId) {
          socket.emit('lobby-error', { message: 'Only lobby owner can start the game' });
          return;
        }

        // Check if all players are ready
        const allReady = lobby.players.every((player: any) => player.isReady);
        if (!allReady) {
          socket.emit('lobby-error', { message: 'All players must be ready to start' });
          return;
        }

        // Check minimum players
        if (lobby.players.length < 2) {
          socket.emit('lobby-error', { message: 'Need at least 2 players to start' });
          return;
        }

        // Create game
        const playerIds = lobby.players.map((p: any) => p.id);
        const playerNicknames = new Map(lobby.players.map((p: any) => [p.id, p.nickname]));
        
        const game = await gameService.createGame(lobbyId, playerIds, playerNicknames);
        
        // Update lobby status
        lobby.status = 'in-game' as any;
        sessionStore.updateLobby(lobbyId, lobby);

        // Start the game
        const startedGame = await gameService.startGame(game.id);
        if (!startedGame) {
          socket.emit('game-error', { message: 'Failed to start game' });
          return;
        }

        // Join all players to game room
        lobby.players.forEach((player: any) => {
          io.sockets.sockets.forEach((playerSocket) => {
            if ((playerSocket as SocketWithData).playerId === player.id) {
              playerSocket.join(game.id);
              (playerSocket as SocketWithData).gameId = game.id;
            }
          });
        });

        // Notify all players
        io.to(lobbyId).emit('game-created', { game: startedGame });
        io.to(game.id).emit('game-started', { game: startedGame });
        io.to(game.id).emit('topic-selection', { 
          availableTopics: startedGame.availableTopics, 
          gameId: game.id 
        });
        
        console.log(`Game started for lobby: ${lobbyId}, game ID: ${game.id}`);
      } catch (error) {
        console.error('Error starting game:', error);
        socket.emit('game-error', { message: 'Failed to start game' });
      }
    });

    // New game event handlers
    socket.on('select-topic', async (data) => {
      try {
        const { gameId, topic } = data;
        
        if (!socket.playerId || socket.gameId !== gameId) {
          socket.emit('game-error', { message: 'Invalid game access' });
          return;
        }

        const game = gameService.getGame(gameId);
        if (!game) {
          socket.emit('game-error', { message: 'Game not found', gameId });
          return;
        }

        // Only allow lobby owner to select topic
        const lobby = sessionStore.getLobby(game.lobbyId);
        if (!lobby || lobby.ownerId !== socket.playerId) {
          socket.emit('game-error', { message: 'Only lobby owner can select topic' });
          return;
        }

        // Start round with selected topic
        const roundState = await gameService.startRound(gameId, topic);
        if (!roundState) {
          socket.emit('game-error', { message: 'Failed to start round' });
          return;
        }

        // Notify all players
        io.to(gameId).emit('round-started', { roundState, gameId });
        
        // Show first question
        const firstQuestion = roundState.questions[0];
        if (firstQuestion) {
          io.to(gameId).emit('question-displayed', {
            question: firstQuestion,
            timeRemaining: firstQuestion.timeLimit,
            gameId
          });
        }

        console.log(`Round ${roundState.roundNumber} started for game ${gameId} with topic: ${topic}`);
      } catch (error) {
        console.error('Error selecting topic:', error);
        socket.emit('game-error', { message: 'Failed to select topic' });
      }
    });

    socket.on('submit-answer', async (data) => {
      try {
        const { gameId, answerIndex } = data;
        
        if (!socket.playerId || socket.gameId !== gameId) {
          socket.emit('game-error', { message: 'Invalid game access' });
          return;
        }

        const success = gameService.submitAnswer(gameId, socket.playerId, answerIndex);
        if (!success) {
          socket.emit('game-error', { message: 'Failed to submit answer' });
          return;
        }

        const game = gameService.getGame(gameId);
        if (!game || !game.roundState) {
          return;
        }

        const playerAnswer = game.roundState.playerAnswers.get(socket.playerId);
        if (!playerAnswer) {
          return;
        }

        // Notify all players that this player submitted an answer
        io.to(gameId).emit('answer-submitted', {
          playerId: socket.playerId,
          isCorrect: playerAnswer.isCorrect,
          gameId
        });

        // Check if all players have answered
        const allPlayersAnswered = game.players.every(playerId => 
          game.roundState!.playerAnswers.has(playerId)
        );

        if (allPlayersAnswered) {
          // Move to next question automatically
          setTimeout(() => {
            handleNextQuestion(gameId, io);
          }, 2000); // 2 second delay before showing results
        }

        console.log(`Player ${socket.playerId} submitted answer for game ${gameId}`);
      } catch (error) {
        console.error('Error submitting answer:', error);
        socket.emit('game-error', { message: 'Failed to submit answer' });
      }
    });

    socket.on('request-next-question', async (data) => {
      try {
        const { gameId } = data;
        handleNextQuestion(gameId, io);
      } catch (error) {
        console.error('Error moving to next question:', error);
        socket.emit('game-error', { message: 'Failed to move to next question' });
      }
    });

    socket.on('get-game-state', async (data) => {
      try {
        const { gameId } = data;
        
        if (!socket.playerId) {
          socket.emit('game-error', { message: 'Player not found' });
          return;
        }

        const game = gameService.getGame(gameId);
        if (!game) {
          socket.emit('game-error', { message: 'Game not found', gameId });
          return;
        }

        socket.emit('game-state-updated', { game });
      } catch (error) {
        console.error('Error getting game state:', error);
        socket.emit('game-error', { message: 'Failed to get game state' });
      }
    });

    socket.on('quit-game', async (data) => {
      try {
        const { gameId } = data;
        
        if (!socket.playerId) {
          socket.emit('game-error', { message: 'Player not found' });
          return;
        }

        const success = gameService.removePlayer(gameId, socket.playerId);
        if (success) {
          socket.leave(gameId);
          socket.gameId = undefined;

          const game = gameService.getGame(gameId);
          if (game) {
            io.to(gameId).emit('game-state-updated', { game });
          }
        }

        console.log(`Player ${socket.playerId} quit game ${gameId}`);
      } catch (error) {
        console.error('Error quitting game:', error);
        socket.emit('game-error', { message: 'Failed to quit game' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      if (socket.playerId && socket.gameId) {
        // Handle game disconnection
        gameService.removePlayer(socket.gameId, socket.playerId);
        
        const game = gameService.getGame(socket.gameId);
        if (game) {
          io.to(socket.gameId).emit('game-state-updated', { game });
        }
      }
      
      // Clean up player session (existing logic)
      const player = sessionStore.getPlayerBySession(socket.id);
      if (player && player.currentLobby) {
        const lobby = sessionStore.removePlayerFromLobby(player.currentLobby, player.id);
        if (lobby) {
          socket.to(player.currentLobby).emit('player-left', { playerId: player.id, lobby });
        }
      }
    });
  });
} 