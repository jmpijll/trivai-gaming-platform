'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LobbyList } from '../../components/lobby/LobbyList'
import { CreateLobbyForm } from '../../components/lobby/CreateLobbyForm'
import { JoinLobbyForm } from '../../components/lobby/JoinLobbyForm'
import { GameSettingsForm } from '../../components/lobby/GameSettingsForm'
import { io, Socket } from 'socket.io-client'
import { Lobby, Player } from '@/../../packages/shared/src/types/lobby'
import { GameSettings } from '@/../../packages/shared/src/types/game'

export default function LobbyPage() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [lobbies, setLobbies] = useState<Lobby[]>([])
  const [currentLobby, setCurrentLobby] = useState<Lobby | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'join'>('browse')
  const [isConnected, setIsConnected] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001')
    
    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to server')
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from server')
    })

    // Lobby event listeners
    newSocket.on('lobby-created', (data: { lobby: Lobby; player: Player }) => {
      setCurrentLobby(data.lobby)
      setCurrentPlayer(data.player)
      setLobbies(prev => [data.lobby, ...prev])
    })

    newSocket.on('lobby-updated', (data: { lobby: Lobby }) => {
      setLobbies(prev => prev.map(l => l.id === data.lobby.id ? data.lobby : l))
      if (currentLobby?.id === data.lobby.id) {
        setCurrentLobby(data.lobby)
      }
    })

    newSocket.on('player-joined', (data: { player: Player; lobby: Lobby }) => {
      setCurrentLobby(data.lobby)
      setLobbies(prev => prev.map(l => l.id === data.lobby.id ? data.lobby : l))
    })

    newSocket.on('player-left', (data: { playerId: string; lobby: Lobby }) => {
      setCurrentLobby(data.lobby)
      setLobbies(prev => prev.map(l => l.id === data.lobby.id ? data.lobby : l))
    })

    newSocket.on('lobby-error', (data: { message: string }) => {
      console.error('Lobby error:', data.message)
      // TODO: Show error toast
    })

    newSocket.on('game-started', (data: { game: any }) => {
      console.log('Game started:', data.game)
      router.push(`/game/${data.game.id}`)
    })

    setSocket(newSocket)

    // Fetch initial lobbies
    fetch('/api/lobbies')
      .then(res => res.json())
      .then(data => {
        if (data.lobbies) {
          setLobbies(data.lobbies)
        }
      })
      .catch(err => console.error('Failed to fetch lobbies:', err))

    return () => {
      newSocket.close()
    }
  }, [router])

  const handleCreateLobby = (name: string, isPrivate: boolean, nickname: string) => {
    if (!socket) return
    
    socket.emit('create-lobby', { name, isPrivate, nickname })
  }

  const handleJoinLobby = (lobbyId: string, nickname: string, joinCode?: string) => {
    if (!socket) return
    
    socket.emit('join-lobby', { lobbyId, nickname, joinCode })
  }

  const handleLeaveLobby = () => {
    if (!socket || !currentLobby) return
    
    socket.emit('leave-lobby', { lobbyId: currentLobby.id })
    setCurrentLobby(null)
    setCurrentPlayer(null)
  }

  const handleToggleReady = () => {
    if (!socket || !currentLobby) return
    
    socket.emit('toggle-ready', { lobbyId: currentLobby.id })
  }

  const handleStartGame = () => {
    if (!socket || !currentLobby) return
    
    socket.emit('start-game', { lobbyId: currentLobby.id })
  }

  const handleUpdateGameSettings = (settings: GameSettings) => {
    if (!socket || !currentLobby) return
    
    socket.emit('update-game-settings', { lobbyId: currentLobby.id, settings })
  }

  if (currentLobby) {
    return (
      <Container className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {currentLobby.name}
                </h1>
                <p className="text-neutral-400 mt-2">
                  {currentLobby.isPrivate ? 'Private' : 'Public'} Lobby
                  {currentLobby.isPrivate && currentLobby.joinCode && (
                    <span className="ml-2 text-green-400">
                      Join Code: {currentLobby.joinCode}
                    </span>
                  )}
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={handleLeaveLobby}
                className="glass-button"
              >
                Leave Lobby
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Players ({currentLobby.players.length}/{currentLobby.maxPlayers})</h2>
                <div className="space-y-3">
                  {currentLobby.players.map(player => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        player.isReady
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-neutral-800/50 border-neutral-700/50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          player.isReady ? 'bg-green-500' : 'bg-yellow-500'
                        }`} />
                        <span className="font-medium">{player.nickname}</span>
                        {player.id === currentLobby.ownerId && (
                          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                            Host
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-neutral-400">
                        {player.isReady ? 'Ready' : 'Not Ready'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <GameSettingsForm
                  currentSettings={currentLobby.gameSettings}
                  isHost={currentPlayer?.id === currentLobby.ownerId}
                  onUpdateSettings={handleUpdateGameSettings}
                  disabled={!isConnected}
                />

                <div className="space-y-3">
                  <Button
                    onClick={handleToggleReady}
                    className={`w-full ${
                      currentPlayer?.isReady
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-yellow-500 hover:bg-yellow-600'
                    }`}
                  >
                    {currentPlayer?.isReady ? 'Ready!' : 'Not Ready'}
                  </Button>

                  {currentPlayer?.id === currentLobby.ownerId && (
                    <Button
                      onClick={handleStartGame}
                      disabled={
                        currentLobby.players.length < 1 ||
                        (currentLobby.players.length > 1 && !currentLobby.players.every(p => p.isReady))
                      }
                      className="w-full glass-button"
                    >
                      Start Game
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    )
  }

  return (
    <Container className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            Game Lobbies
          </h1>
          <p className="text-neutral-400 text-lg">
            Join a lobby to start playing TrivAI with your friends
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex space-x-1 bg-neutral-800/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'browse'
                  ? 'bg-purple-500 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Browse Lobbies
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'create'
                  ? 'bg-purple-500 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Create Lobby
            </button>
            <button
              onClick={() => setActiveTab('join')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'join'
                  ? 'bg-purple-500 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Join with Code
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'browse' && (
              <LobbyList
                lobbies={lobbies}
                onJoinLobby={handleJoinLobby}
                isConnected={isConnected}
              />
            )}
            {activeTab === 'create' && (
              <CreateLobbyForm
                onCreateLobby={handleCreateLobby}
                isConnected={isConnected}
              />
            )}
            {activeTab === 'join' && (
              <JoinLobbyForm
                onJoinLobby={handleJoinLobby}
                isConnected={isConnected}
              />
            )}
          </div>

          <div className="space-y-6">
            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-3">Connection Status</h3>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </Card>

            <Card className="glass-card p-6">
              <h3 className="font-semibold mb-3">How to Play</h3>
              <ul className="text-sm space-y-2 text-neutral-400">
                <li>• Create or join a lobby</li>
                <li>• Wait for 2-4 players</li>
                <li>• Everyone marks ready</li>
                <li>• Host starts the game</li>
                <li>• Answer trivia questions</li>
                <li>• Score points and have fun!</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  )
} 