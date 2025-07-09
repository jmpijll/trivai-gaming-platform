'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Lobby } from '@/../../packages/shared/src/types/lobby'

interface LobbyListProps {
  lobbies: Lobby[]
  onJoinLobby: (lobbyId: string, nickname: string, joinCode?: string) => void
  isConnected: boolean
}

export function LobbyList({ lobbies, onJoinLobby, isConnected }: LobbyListProps) {
  const [selectedLobby, setSelectedLobby] = useState<Lobby | null>(null)
  const [nickname, setNickname] = useState('')
  const [isJoining, setIsJoining] = useState(false)

  const handleJoinClick = (lobby: Lobby) => {
    setSelectedLobby(lobby)
    setIsJoining(true)
  }

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLobby || !nickname.trim()) return
    
    onJoinLobby(selectedLobby.id, nickname.trim())
    setIsJoining(false)
    setSelectedLobby(null)
    setNickname('')
  }

  const handleCancel = () => {
    setIsJoining(false)
    setSelectedLobby(null)
    setNickname('')
  }

  const publicLobbies = lobbies.filter(lobby => !lobby.isPrivate)

  if (isJoining && selectedLobby) {
    return (
      <Card className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Join "{selectedLobby.name}"</h2>
        <form onSubmit={handleJoinSubmit} className="space-y-4">
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium mb-2">
              Your Nickname
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname"
              required
              minLength={3}
              maxLength={20}
              className="w-full px-4 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" disabled={!nickname.trim() || !isConnected}>
              Join Lobby
            </Button>
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Public Lobbies</h2>
        <span className="text-sm text-neutral-400">
          {publicLobbies.length} lobby{publicLobbies.length !== 1 ? 's' : ''} available
        </span>
      </div>

      {publicLobbies.length === 0 ? (
        <Card className="glass-card p-8 text-center">
          <div className="text-neutral-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium mb-2">No lobbies available</h3>
            <p className="text-sm">Be the first to create a lobby!</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {publicLobbies.map((lobby) => (
            <Card key={lobby.id} className="glass-card p-6 hover:bg-white/5 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{lobby.name}</h3>
                  <p className="text-sm text-neutral-400">
                    {lobby.players.length}/{lobby.maxPlayers} players
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    lobby.status === 'waiting' ? 'bg-green-500' :
                    lobby.status === 'in_game' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span className="text-xs text-neutral-400 capitalize">
                    {lobby.status === 'waiting' ? 'Waiting' :
                     lobby.status === 'in_game' ? 'In Game' :
                     'Completed'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Rounds:</span>
                  <span>{lobby.gameSettings.maxRounds}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Questions per Round:</span>
                  <span>{lobby.gameSettings.questionsPerRound}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Time Limit:</span>
                  <span>{lobby.gameSettings.questionTimeLimit / 1000}s</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-neutral-400">Players:</p>
                <div className="flex flex-wrap gap-1">
                  {lobby.players.map((player) => (
                    <span
                      key={player.id}
                      className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded"
                    >
                      {player.nickname}
                    </span>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => handleJoinClick(lobby)}
                disabled={
                  !isConnected ||
                  lobby.status !== 'waiting' ||
                  lobby.players.length >= lobby.maxPlayers
                }
                className="w-full"
              >
                {lobby.status !== 'waiting' ? 'Game in Progress' :
                 lobby.players.length >= lobby.maxPlayers ? 'Full' :
                 'Join Lobby'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 