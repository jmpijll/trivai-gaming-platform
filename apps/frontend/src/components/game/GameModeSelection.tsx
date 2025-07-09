import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useGameSounds } from '@/hooks/useAudio'

// Game mode types
export interface GameMode {
  id: 'singleplayer' | 'multiplayer'
  name: string
  description: string
  features: string[]
  icon: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  duration: string
  playerCount: string
  recommended: boolean
}

// Game modes configuration
const gameModes: GameMode[] = [
  {
    id: 'singleplayer',
    name: 'Solo Challenge',
    description: 'Test your knowledge in a personal trivia challenge with AI-powered questions',
    features: [
      'Adaptive difficulty based on performance',
      'Personal progress tracking',
      'Achievement system',
      'Unlimited practice rounds',
      'Detailed explanations for learning',
      'Custom topic selection'
    ],
    icon: '🎯',
    difficulty: 'Medium',
    duration: '10-15 min',
    playerCount: '1 Player',
    recommended: true
  },
  {
    id: 'multiplayer',
    name: 'Multiplayer Battle',
    description: 'Compete against friends or other players in real-time trivia battles',
    features: [
      'Real-time competition with 2-4 players',
      'Live leaderboards and scoring',
      'Bonus wheels and multipliers',
      'Social interaction and chat',
      'Ranked matchmaking',
      'Spectator mode'
    ],
    icon: '⚔️',
    difficulty: 'Hard',
    duration: '15-20 min',
    playerCount: '2-4 Players',
    recommended: false
  }
]

interface GameModeSelectionProps {
  onModeSelect: (mode: GameMode) => void
  selectedMode?: GameMode['id']
  className?: string
}

export const GameModeSelection: React.FC<GameModeSelectionProps> = ({
  onModeSelect,
  selectedMode,
  className = ''
}) => {
  const [hoveredMode, setHoveredMode] = useState<GameMode['id'] | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  
  const { playButtonClick, playHover, playSound } = useGameSounds()

  const handleModeSelect = (mode: GameMode) => {
    setIsSelecting(true)
    playButtonClick()
    playSound('topic_selected')
    
    // Add slight delay for audio feedback
    setTimeout(() => {
      onModeSelect(mode)
      setIsSelecting(false)
    }, 200)
  }

  const handleModeHover = (modeId: GameMode['id']) => {
    setHoveredMode(modeId)
    playHover()
  }

  return (
    <div className={`max-w-6xl mx-auto ${className}`}>
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Choose Your Game Mode
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
          Select your preferred way to play TrivAI and test your knowledge
        </p>
      </motion.div>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {gameModes.map((mode, index) => (
          <motion.div
            key={mode.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onHoverStart={() => handleModeHover(mode.id)}
            onHoverEnd={() => setHoveredMode(null)}
          >
            <Card
              className={`
                relative overflow-hidden cursor-pointer transition-all duration-300 h-full
                ${selectedMode === mode.id 
                  ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-blue-500/20' 
                  : 'hover:scale-105 hover:shadow-xl'
                }
                ${hoveredMode === mode.id ? 'shadow-2xl' : ''}
              `}
              onClick={() => handleModeSelect(mode)}
            >
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/50 to-transparent" />
              
              {/* Recommended Badge */}
              {mode.recommended && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    ⭐ Recommended
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 p-8">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                  <motion.div
                    className="text-6xl"
                    animate={hoveredMode === mode.id ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {mode.icon}
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {mode.name}
                    </h2>
                    <p className="text-neutral-400 text-lg">
                      {mode.description}
                    </p>
                  </div>
                </div>

                {/* Game Info */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl mb-1">👥</div>
                    <div className="text-sm text-neutral-400">Players</div>
                    <div className="text-white font-medium">{mode.playerCount}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">⏱️</div>
                    <div className="text-sm text-neutral-400">Duration</div>
                    <div className="text-white font-medium">{mode.duration}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🎚️</div>
                    <div className="text-sm text-neutral-400">Difficulty</div>
                    <div className={`font-medium ${
                      mode.difficulty === 'Easy' ? 'text-green-400' :
                      mode.difficulty === 'Medium' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {mode.difficulty}
                    </div>
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Features</h3>
                  <ul className="space-y-2">
                    {mode.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-start space-x-2 text-neutral-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                      >
                        <div className="text-purple-400 text-sm mt-1">✓</div>
                        <span className="text-sm">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    disabled={isSelecting}
                    soundEnabled={false} // We handle sound in parent component
                  >
                    {isSelecting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Selecting...</span>
                      </div>
                    ) : (
                      <>
                        <span>Play {mode.name}</span>
                        <span className="ml-2">→</span>
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>

              {/* Hover Effects */}
              <AnimatePresence>
                {hoveredMode === mode.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </AnimatePresence>

              {/* Particle Effects */}
              {hoveredMode === mode.id && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-purple-500 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Info */}
      <motion.div
        className="text-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="glass-card p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4">
            🎮 New to TrivAI?
          </h3>
          <p className="text-neutral-400 mb-4">
            Start with <strong className="text-purple-400">Solo Challenge</strong> to learn the game mechanics, 
            then challenge your friends in <strong className="text-blue-400">Multiplayer Battle</strong>!
          </p>
          <div className="flex justify-center space-x-4 text-sm text-neutral-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>AI-Generated Questions</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Real-time Gameplay</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Learning Focused</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default GameModeSelection 