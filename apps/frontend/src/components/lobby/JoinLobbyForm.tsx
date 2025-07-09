'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LOBBY_CONSTRAINTS } from '@/../../packages/shared/src/types/lobby'

interface JoinLobbyFormProps {
  onJoinLobby: (lobbyId: string, nickname: string, joinCode?: string) => void
  isConnected: boolean
}

export function JoinLobbyForm({ onJoinLobby, isConnected }: JoinLobbyFormProps) {
  const [joinCode, setJoinCode] = useState('')
  const [nickname, setNickname] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinCode.trim() || !nickname.trim()) return
    
    setIsSubmitting(true)
    
    try {
      // For private lobbies, we use the join code as the lobby ID for now
      // The backend will handle the mapping
      await onJoinLobby('', nickname.trim(), joinCode.trim())
      // Reset form on success
      setJoinCode('')
      setNickname('')
    } catch (error) {
      console.error('Failed to join lobby:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatJoinCode = (value: string) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
    // Limit to 6 characters
    return cleaned.slice(0, LOBBY_CONSTRAINTS.JOIN_CODE_LENGTH)
  }

  const handleJoinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJoinCode(formatJoinCode(e.target.value))
  }

  return (
    <Card className="glass-card p-6">
      <h2 className="text-xl font-semibold mb-6">Join Private Lobby</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="joinCode" className="block text-sm font-medium mb-2">
            Join Code
          </label>
          <input
            id="joinCode"
            type="text"
            value={joinCode}
            onChange={handleJoinCodeChange}
            placeholder="Enter 6-character join code"
            required
            maxLength={LOBBY_CONSTRAINTS.JOIN_CODE_LENGTH}
            className="w-full px-4 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg tracking-widest font-mono"
          />
          <p className="text-xs text-neutral-400 mt-1">
            Enter the {LOBBY_CONSTRAINTS.JOIN_CODE_LENGTH}-character code provided by the lobby host
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

        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-blue-400 mb-1">Private Lobby</h3>
              <p className="text-sm text-blue-300">
                You'll need a join code from the lobby host to enter this lobby. 
                The code is case-insensitive and consists of 6 characters.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-neutral-800/30 p-4 rounded-lg">
          <h3 className="font-medium mb-3">How to Get a Join Code</h3>
          <ul className="text-sm text-neutral-400 space-y-1">
            <li>• Ask the lobby host for the join code</li>
            <li>• The host can find the code in their lobby settings</li>
            <li>• Codes are automatically generated for private lobbies</li>
            <li>• Join codes expire when the lobby is closed</li>
          </ul>
        </div>

        <Button
          type="submit"
          disabled={
            !joinCode.trim() || 
            !nickname.trim() || 
            !isConnected || 
            isSubmitting ||
            joinCode.length !== LOBBY_CONSTRAINTS.JOIN_CODE_LENGTH
          }
          className="w-full"
        >
          {isSubmitting ? 'Joining...' : 'Join Lobby'}
        </Button>
      </form>
    </Card>
  )
} 