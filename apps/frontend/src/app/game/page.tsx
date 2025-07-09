'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GameModeRouter } from '@/components/game/GameModeRouter'
import { Navigation } from '@/components/layout/Navigation'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useGameSounds } from '@/hooks/useAudio'

const GamePage: React.FC = () => {
  const router = useRouter()
  const { playSound } = useGameSounds()
  const [gameContext, setGameContext] = useState<any>(null)

  const handleModeConfirm = (context: any) => {
    setGameContext(context)
    playSound('menu_select')
    
    // Store game context for use in subsequent pages
    localStorage.setItem('trivai-game-context', JSON.stringify(context))
  }

  const handleBackToHome = () => {
    playSound('menu_back')
    router.push('/')
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black">
        {/* Header */}
        <Container className="pt-24 pb-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🎮 <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Choose Your Game Mode
              </span>
            </h1>
            <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
              Select how you want to play TrivAI and customize your gaming experience
            </p>
          </motion.div>
        </Container>

        {/* Game Mode Router */}
        <GameModeRouter
          onModeConfirm={handleModeConfirm}
          className="pb-8"
        />

        {/* Additional Navigation */}
        <Container className="pb-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="glass-card p-6 max-w-md mx-auto">
              <div className="space-y-4">
                <p className="text-neutral-400">
                  Not ready to play?
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={handleBackToHome}
                    className="flex-1"
                  >
                    ← Home
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/lobby')}
                    className="flex-1"
                  >
                    Browse Lobbies
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>

        {/* Game Features Preview */}
        <Container className="pb-12">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="glass-card p-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                ✨ Game Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="text-lg font-semibold text-white mb-2">AI-Generated Questions</h3>
                  <p className="text-sm text-neutral-400">
                    Dynamic questions powered by advanced AI across multiple topics and difficulties
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Real-time Multiplayer</h3>
                  <p className="text-sm text-neutral-400">
                    Compete with friends or players worldwide in fast-paced trivia battles
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">🎲</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Bonus Wheels & Power-ups</h3>
                  <p className="text-sm text-neutral-400">
                    Spin for bonus points, multipliers, and special abilities during gameplay
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Achievement System</h3>
                  <p className="text-sm text-neutral-400">
                    Unlock achievements and track your progress across multiple game modes
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">🎨</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Beautiful UI/UX</h3>
                  <p className="text-sm text-neutral-400">
                    Immersive glassmorphism design with smooth animations and effects
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl mb-2">🤖</div>
                  <h3 className="text-lg font-semibold text-white mb-2">AI Opponents</h3>
                  <p className="text-sm text-neutral-400">
                    Challenge intelligent AI opponents with different personalities and strategies
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </div>
    </>
  )
}

export default GamePage 