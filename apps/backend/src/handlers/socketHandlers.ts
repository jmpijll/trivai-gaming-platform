import { Server, Socket } from 'socket.io';
import { sessionStore } from '../models/SessionStore';

// Temporary type definitions until module resolution is fixed
interface ClientToServerEvents {
  'create-lobby': (data: { name: string; isPrivate: boolean; nickname: string }) => void;
  'join-lobby': (data: { lobbyId: string; joinCode?: string; nickname: string }) => void;
  'leave-lobby': (data: { lobbyId: string }) => void;
  'toggle-ready': (data: { lobbyId: string }) => void;
  'start-game': (data: { lobbyId: string }) => void;
  'submit-answer': (data: { lobbyId: string; answer: string }) => void;
  'select-topic': (data: { lobbyId: string; topic: string }) => void;
  'quit-game': (data: { lobbyId: string }) => void;
  'spin-wheel': (data: { lobbyId: string }) => void;
  ping: () => void;
}

interface ServerToClientEvents {
  'lobby-created': (data: { lobby: any; player: any }) => void;
  'lobby-updated': (data: { lobby: any }) => void;
  'lobby-error': (data: { message: string; lobbyId?: string }) => void;
  'player-joined': (data: { player: any; lobby: any }) => void;
  'player-left': (data: { playerId: string; lobby: any }) => void;
  pong: () => void;
}

type SocketWithData = Socket<ClientToServerEvents, ServerToClientEvents> & {
  playerId?: string;
};

export function setupSocketHandlers(io: Server) {
  io.on('connection', (socket: SocketWithData) => {
    console.log('Client connected:', socket.id);

    // Connection handlers
    socket.on('ping', () => {
      socket.emit('pong');
    });

    // Lobby management handlers
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
        
        // Leave socket room
        socket.leave(lobbyId);

        if (lobby) {
          // Notify remaining players
          socket.to(lobbyId).emit('player-left', { playerId: socket.playerId, lobby });
        }

        socket.playerId = undefined;
        console.log(`Player left lobby: ${lobbyId}`);
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

        const lobby = sessionStore.getLobby(lobbyId);
        if (!lobby) {
          socket.emit('lobby-error', { message: 'Lobby not found' });
          return;
        }

        const player = lobby.players.find((p: any) => p.id === socket.playerId);
        if (!player) {
          socket.emit('lobby-error', { message: 'Player not in lobby' });
          return;
        }

        // Toggle ready status
        const updatedLobby = sessionStore.togglePlayerReady(lobbyId, socket.playerId);
        if (!updatedLobby) {
          socket.emit('lobby-error', { message: 'Failed to update ready status' });
          return;
        }

        io.to(lobbyId).emit('lobby-updated', { lobby: updatedLobby });
      } catch (error) {
        console.error('Error toggling ready:', error);
        socket.emit('lobby-error', { message: 'Failed to toggle ready status' });
      }
    });

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

        // Only host can start game
        if (lobby.ownerId !== socket.playerId) {
          socket.emit('lobby-error', { message: 'Only host can start the game' });
          return;
        }

        // Check if all players are ready
        const allReady = lobby.players.every((p: any) => p.isReady);
        if (!allReady) {
          socket.emit('lobby-error', { message: 'All players must be ready to start' });
          return;
        }

        // Start the game - for now just notify players (game logic will be added in later phases)
        io.to(lobbyId).emit('lobby-updated', { lobby });
        // TODO: Create actual game session in later phases
        console.log(`Game started in lobby: ${lobby.name}`);
      } catch (error) {
        console.error('Error starting game:', error);
        socket.emit('lobby-error', { message: 'Failed to start game' });
      }
    });

    // Game handlers (placeholders)
    socket.on('submit-answer', async (data) => {
      // TODO: Implement answer submission logic
    });

    socket.on('select-topic', async (data) => {
      // TODO: Implement topic selection logic
    });

    socket.on('quit-game', async (data) => {
      // TODO: Implement quit game logic
    });

    socket.on('spin-wheel', async (data) => {
      // TODO: Implement spin wheel logic
    });

    // Disconnection handler
    socket.on('disconnect', (reason) => {
      console.log('Client disconnected:', socket.id, 'Reason:', reason);
      
      if (socket.playerId) {
        // Handle cleanup when player disconnects
        const player = sessionStore.getPlayer(socket.playerId);
        if (player && player.currentLobby) {
          const updatedLobby = sessionStore.removePlayerFromLobby(player.currentLobby, socket.playerId);
          if (updatedLobby) {
            socket.to(player.currentLobby).emit('player-left', { playerId: socket.playerId, lobby: updatedLobby });
          }
        }
      }
    });
  });
} 