import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { GameModeSelection, GameMode } from '@/components/game/GameModeSelection'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LoadingOverlay } from '@/components/ui/LoadingStates'
import { useGameSounds } from '@/hooks/useAudio'

// Game mode context
interface GameModeContext {
  selectedMode: GameMode | null
  playerSettings: {
    nickname: string
    preferredDifficulty: 'easy' | 'medium' | 'hard'
    enableTutorial: boolean
  }
  gameSettings: {
    roundCount: number
    questionCount: number
    timeLimit: number
    topicPreferences: string[]
  }
}

interface GameModeRouterProps {
  onModeConfirm: (context: GameModeContext) => void
  className?: string
}

export const GameModeRouter: React.FC<GameModeRouterProps> = ({
  onModeConfirm,
  className = ''
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [playerSettings, setPlayerSettings] = useState({
    nickname: '',
    preferredDifficulty: 'medium' as const,
    enableTutorial: true
  })
  const [gameSettings, setGameSettings] = useState({
    roundCount: 5,
    questionCount: 10,
    timeLimit: 30,
    topicPreferences: []
  })
  
  const router = useRouter()
  const { playButtonClick, playSound } = useGameSounds()

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('trivai-player-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setPlayerSettings(prev => ({ ...prev, ...parsed }))
      } catch (error) {
        console.error('Failed to parse saved settings:', error)
      }
    }
  }, [])

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode)
    setShowSettings(true)
    playSound('topic_selected')
  }

  const handleBack = () => {
    playButtonClick()
    setShowSettings(false)
    setSelectedMode(null)
  }

  const handleConfirm = async () => {
    if (!selectedMode) return
    
    setIsLoading(true)
    playButtonClick()
    
    // Save settings to localStorage
    localStorage.setItem('trivai-player-settings', JSON.stringify(playerSettings))
    
    // Create context
    const context: GameModeContext = {
      selectedMode,
      playerSettings,
      gameSettings
    }
    
    // Route based on selected mode
    if (selectedMode.id === 'singleplayer') {
      // For singleplayer, we'll create a solo game
      router.push('/game/solo')
    } else {
      // For multiplayer, go to lobby
      router.push('/lobby')
    }
    
    // Notify parent component
    onModeConfirm(context)
  }

  const handleDirectLobby = () => {
    playButtonClick()
    router.push('/lobby')
  }

  return (
    <Container className={`min-h-screen py-8 ${className}`}>
      <AnimatePresence mode="wait">
        {!showSettings ? (
          <motion.div
            key="mode-selection"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <GameModeSelection
              onModeSelect={handleModeSelect}
              selectedMode={selectedMode?.id}
            />
            
            {/* Quick Access */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="glass-card p-6 max-w-md mx-auto">
                <p className="text-neutral-400 mb-4">
                  Already know what you want?
                </p>
                <Button
                  variant="secondary"
                  onClick={handleDirectLobby}
                  className="w-full"
                >
                  Go to Lobby →
                </Button>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="game-settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GameModeSettings
              mode={selectedMode!}
              playerSettings={playerSettings}
              gameSettings={gameSettings}
              onPlayerSettingsChange={setPlayerSettings}
              onGameSettingsChange={setGameSettings}
              onBack={handleBack}
              onConfirm={handleConfirm}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isLoading}
        title="Preparing Game"
        message={`Setting up your ${selectedMode?.name || 'game'} experience...`}
        variant="game"
      />
    </Container>
  )
}

// Game mode settings component
interface GameModeSettingsProps {
  mode: GameMode
  playerSettings: {
    nickname: string
    preferredDifficulty: 'easy' | 'medium' | 'hard'
    enableTutorial: boolean
  }
  gameSettings: {
    roundCount: number
    questionCount: number
    timeLimit: number
    topicPreferences: string[]
  }
  onPlayerSettingsChange: (settings: any) => void
  onGameSettingsChange: (settings: any) => void
  onBack: () => void
  onConfirm: () => void
}

const GameModeSettings: React.FC<GameModeSettingsProps> = ({
  mode,
  playerSettings,
  gameSettings,
  onPlayerSettingsChange,
  onGameSettingsChange,
  onBack,
  onConfirm
}) => {
  const popularTopics = [
    'Science & Technology',
    'History',
    'Sports',
    'Entertainment',
    'Geography',
    'Literature',
    'Music',
    'Art & Culture',
    'Food & Cooking',
    'Animals & Nature'
  ]

  const handleTopicToggle = (topic: string) => {
    const currentPreferences = gameSettings.topicPreferences
    const newPreferences = currentPreferences.includes(topic)
      ? currentPreferences.filter(t => t !== topic)
      : [...currentPreferences, topic]
    
    onGameSettingsChange({
      ...gameSettings,
      topicPreferences: newPreferences
    })
  }

  const isFormValid = playerSettings.nickname.trim().length >= 3

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">
          {mode.icon} {mode.name} Settings
        </h1>
        <p className="text-neutral-400">
          Customize your game experience
        </p>
      </motion.div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Player Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              👤 Player Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Nickname
                </label>
                <input
                  type="text"
                  value={playerSettings.nickname}
                  onChange={(e) => onPlayerSettingsChange({
                    ...playerSettings,
                    nickname: e.target.value
                  })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your nickname"
                  maxLength={20}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {playerSettings.nickname.length}/20 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Preferred Difficulty
                </label>
                <select
                  value={playerSettings.preferredDifficulty}
                  onChange={(e) => onPlayerSettingsChange({
                    ...playerSettings,
                    preferredDifficulty: e.target.value as 'easy' | 'medium' | 'hard'
                  })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="easy">Easy - Simple questions</option>
                  <option value="medium">Medium - Balanced challenge</option>
                  <option value="hard">Hard - Challenging questions</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="tutorial"
                  checked={playerSettings.enableTutorial}
                  onChange={(e) => onPlayerSettingsChange({
                    ...playerSettings,
                    enableTutorial: e.target.checked
                  })}
                  className="w-4 h-4 text-purple-500 bg-neutral-800 border-neutral-600 rounded focus:ring-purple-500"
                />
                <label htmlFor="tutorial" className="text-sm text-neutral-300">
                  Enable tutorial for first-time players
                </label>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Game Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              🎮 Game Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Number of Rounds
                </label>
                <select
                  value={gameSettings.roundCount}
                  onChange={(e) => onGameSettingsChange({
                    ...gameSettings,
                    roundCount: parseInt(e.target.value)
                  })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={3}>3 Rounds (Quick)</option>
                  <option value={5}>5 Rounds (Standard)</option>
                  <option value={7}>7 Rounds (Extended)</option>
                  <option value={10}>10 Rounds (Marathon)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Time Limit per Question
                </label>
                <select
                  value={gameSettings.timeLimit}
                  onChange={(e) => onGameSettingsChange({
                    ...gameSettings,
                    timeLimit: parseInt(e.target.value)
                  })}
                  className="w-full px-4 py-2 bg-neutral-800 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value={15}>15 seconds (Fast)</option>
                  <option value={30}>30 seconds (Standard)</option>
                  <option value={45}>45 seconds (Relaxed)</option>
                  <option value={60}>60 seconds (Thoughtful)</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Topic Preferences */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            🎯 Topic Preferences (Optional)
          </h2>
          <p className="text-neutral-400 mb-4">
            Select topics you're interested in, or leave blank for random selection
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {popularTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicToggle(topic)}
                className={`
                  px-3 py-2 rounded-lg text-sm transition-all duration-200
                  ${gameSettings.topicPreferences.includes(topic)
                    ? 'bg-purple-500 text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }
                `}
              >
                {topic}
              </button>
            ))}
          </div>
          
          {gameSettings.topicPreferences.length > 0 && (
            <p className="text-sm text-neutral-500 mt-3">
              Selected {gameSettings.topicPreferences.length} topics
            </p>
          )}
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex justify-between items-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Button
          variant="secondary"
          onClick={onBack}
          className="px-6 py-3"
        >
          ← Back
        </Button>
        
        <Button
          onClick={onConfirm}
          disabled={!isFormValid}
          className={`px-8 py-3 ${
            isFormValid 
              ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Start {mode.name} →
        </Button>
      </motion.div>
    </div>
  )
}

export default GameModeRouter 