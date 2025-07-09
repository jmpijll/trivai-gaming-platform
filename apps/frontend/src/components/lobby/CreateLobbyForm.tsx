'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LOBBY_CONSTRAINTS } from '@/../../packages/shared/src/types/lobby'

interface CreateLobbyFormProps {
  onCreateLobby: (name: string, isPrivate: boolean, nickname: string) => void
  isConnected: boolean
}

export function CreateLobbyForm({ onCreateLobby, isConnected }: CreateLobbyFormProps) {
  const [lobbyName, setLobbyName] = useState('')
  const [nickname, setNickname] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [maxPlayers, setMaxPlayers] = useState(4)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!lobbyName.trim() || !nickname.trim()) return
    
    setIsSubmitting(true)
    
    try {
      await onCreateLobby(lobbyName.trim(), isPrivate, nickname.trim())
      // Reset form on success
      setLobbyName('')
      setNickname('')
      setIsPrivate(false)
      setMaxPlayers(4)
    } catch (error) {
      console.error('Failed to create lobby:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-6">Create New Lobby</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="lobbyName" className="block text-sm font-medium mb-2">
            Lobby Name
          </label>
          <input
            id="lobbyName"
            type="text"
            value={lobbyName}
            onChange={(e) => setLobbyName(e.target.value)}
            placeholder="Enter lobby name"
            required
            minLength={LOBBY_CONSTRAINTS.NAME_MIN_LENGTH}
            maxLength={LOBBY_CONSTRAINTS.NAME_MAX_LENGTH}
            className="w-full px-4 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-neutral-400 mt-1">
            {LOBBY_CONSTRAINTS.NAME_MIN_LENGTH}-{LOBBY_CONSTRAINTS.NAME_MAX_LENGTH} characters
          </p>
        </div>

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

        <div>
          <label htmlFor="maxPlayers" className="block text-sm font-medium mb-2">
            Maximum Players
          </label>
          <select
            id="maxPlayers"
            value={maxPlayers}
            onChange={(e) => setMaxPlayers(Number(e.target.value))}
            className="w-full px-4 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value={2}>2 Players</option>
            <option value={3}>3 Players</option>
            <option value={4}>4 Players</option>
          </select>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Lobby Privacy</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  checked={!isPrivate}
                  onChange={() => setIsPrivate(false)}
                  className="mr-3 text-purple-500 focus:ring-purple-500"
                />
                <div>
                  <div className="font-medium">Public</div>
                  <div className="text-sm text-neutral-400">Anyone can see and join this lobby</div>
                </div>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(true)}
                  className="mr-3 text-purple-500 focus:ring-purple-500"
                />
                <div>
                  <div className="font-medium">Private</div>
                  <div className="text-sm text-neutral-400">Only players with the join code can join</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800/30 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Game Settings</h3>
          <div className="space-y-2 text-sm text-neutral-400">
            <div className="flex justify-between">
              <span>Rounds:</span>
              <span>5</span>
            </div>
            <div className="flex justify-between">
              <span>Questions per Round:</span>
              <span>10</span>
            </div>
            <div className="flex justify-between">
              <span>Time per Question:</span>
              <span>30 seconds</span>
            </div>
            <div className="flex justify-between">
              <span>Scoring:</span>
              <span>Progressive multiplier</span>
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Game settings can be customized in the admin panel
          </p>
        </div>

        <Button
          type="submit"
          disabled={!lobbyName.trim() || !nickname.trim() || !isConnected || isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Creating...' : 'Create Lobby'}
        </Button>
      </form>
    </Card>
  )
} 