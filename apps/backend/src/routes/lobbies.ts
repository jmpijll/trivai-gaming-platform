import express from 'express';
import { sessionStore } from '../models/SessionStore';

// Temporary type definitions until module resolution is fixed
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

interface LobbyListResponse {
  lobbies: any[];
  total: number;
}

const router: express.Router = express.Router();

// GET /api/lobbies - List public lobbies
router.get('/', (req, res) => {
  try {
    const publicLobbies = sessionStore.getPublicLobbies();
    
    const response: ApiResponse<LobbyListResponse> = {
      success: true,
      data: {
        lobbies: publicLobbies,
        total: publicLobbies.length,
      },
      timestamp: new Date().toISOString(),
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching lobbies:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch lobbies',
      timestamp: new Date().toISOString(),
    };
    res.status(500).json(response);
  }
});

// GET /api/lobbies/:id - Get specific lobby info  
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const lobby = sessionStore.getLobby(id);
    
    if (!lobby) {
      const response: ApiResponse = {
        success: false,
        error: 'Lobby not found',
        timestamp: new Date().toISOString(),
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse = {
      success: true,
      data: lobby,
      timestamp: new Date().toISOString(),
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching lobby:', error);
    const response: ApiResponse = {
      success: false,
      error: 'Failed to fetch lobby',
      timestamp: new Date().toISOString(),
    };
    res.status(500).json(response);
  }
});

// POST /api/lobbies/:id/join - Join lobby via REST (for validation)
router.post('/:id/join', (req, res) => {
  try {
    const { id } = req.params;
    const { joinCode, nickname } = req.body;

    // Basic validation
    if (!nickname || nickname.trim().length < 3 || nickname.trim().length > 20) {
      return res.status(400).json({
        success: false,
        error: 'Nickname must be between 3 and 20 characters',
        timestamp: new Date().toISOString(),
      });
    }

    const lobby = sessionStore.getLobby(id);
    if (!lobby) {
      return res.status(404).json({
        success: false,
        error: 'The requested lobby does not exist',
        timestamp: new Date().toISOString(),
      });
    }

    // Check if lobby is private and requires join code
    if (lobby.isPrivate && lobby.joinCode !== joinCode) {
      return res.status(403).json({
        success: false,
        error: 'The provided join code is incorrect',
        timestamp: new Date().toISOString(),
      });
    }

    // Check if lobby is full
    if (lobby.players.length >= lobby.maxPlayers) {
      return res.status(409).json({
        success: false,
        error: 'This lobby is already full',
        timestamp: new Date().toISOString(),
      });
    }

    // Check if lobby is in game
    if (lobby.status !== 'waiting') {
      return res.status(409).json({
        success: false,
        error: 'Cannot join lobby while game is in progress',
        timestamp: new Date().toISOString(),
      });
    }

    const response: ApiResponse = {
      success: true,
      data: { canJoin: true, lobby },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    console.error('Error validating lobby join:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate lobby join',
      timestamp: new Date().toISOString(),
    });
  }
});

// DELETE /api/lobbies/:id - Delete lobby (owner only)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { playerId } = req.body;

    const lobby = sessionStore.getLobby(id);
    if (!lobby) {
      return res.status(404).json({
        success: false,
        error: 'The requested lobby does not exist',
        timestamp: new Date().toISOString(),
      });
    }

    // Check if player is the owner
    if (lobby.ownerId !== playerId) {
      return res.status(403).json({
        success: false,
        error: 'Only the lobby owner can delete the lobby',
        timestamp: new Date().toISOString(),
      });
    }

    sessionStore.deleteLobby(id);

    const response: ApiResponse = {
      success: true,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting lobby:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete lobby',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router; 