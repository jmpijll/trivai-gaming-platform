'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { QuestionDisplay } from '@/components/game/QuestionDisplay'
import { ScoreBoard } from '@/components/game/ScoreBoard'
import { GameComplete } from '@/components/game/GameComplete'
import { BonusWheel } from '@/components/game/BonusWheel'
import { FinalRoundIndicator } from '@/components/game/FinalRoundIndicator'
import { GameLoadingManager } from '@/components/ui/LoadingStates'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useGameSounds } from '@/hooks/useAudio'
import { useGameLoading } from '@/hooks/useGameLoading'
import { useMultipliers } from '@/hooks/useMultipliers'

interface SoloGameState {
  currentQuestion: number
  currentRound: number
  totalRounds: number
  timeLimit: number
  difficulty: 'easy' | 'medium' | 'hard'
  score: number
  streak: number
  questionCount: number
  gameComplete: boolean
  gameStarted: boolean
  aiOpponents: AIOpponent[]
  playerStats: {
    correctAnswers: number
    totalAnswers: number
    averageTime: number
    bestStreak: number
  }
}

interface AIOpponent {
  id: string
  name: string
  avatar: string
  score: number
  streak: number
  difficulty: 'easy' | 'medium' | 'hard'
  personality: 'aggressive' | 'steady' | 'unpredictable'
  status: 'thinking' | 'answered' | 'idle'
}

const SoloGamePage: React.FC = () => {
  const router = useRouter()
  const { playSound } = useGameSounds()
  const { isLoading, startLoading, stopLoading } = useGameLoading()
  const { multipliers, addMultiplier, removeMultiplier } = useMultipliers()

  const [gameState, setGameState] = useState<SoloGameState>({
    currentQuestion: 1,
    currentRound: 1,
    totalRounds: 5,
    timeLimit: 30,
    difficulty: 'medium',
    score: 0,
    streak: 0,
    questionCount: 10,
    gameComplete: false,
    gameStarted: false,
    aiOpponents: [],
    playerStats: {
      correctAnswers: 0,
      totalAnswers: 0,
      averageTime: 0,
      bestStreak: 0
    }
  })

  const [currentQuestion, setCurrentQuestion] = useState<any>(null)
  const [showBonusWheel, setShowBonusWheel] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Initialize AI opponents
  useEffect(() => {
    const aiOpponents: AIOpponent[] = [
      {
        id: 'ai1',
        name: 'QuizBot Alpha',
        avatar: '🤖',
        score: 0,
        streak: 0,
        difficulty: 'medium',
        personality: 'steady',
        status: 'idle'
      },
      {
        id: 'ai2',
        name: 'Trivia Master',
        avatar: '🎓',
        score: 0,
        streak: 0,
        difficulty: 'hard',
        personality: 'aggressive',
        status: 'idle'
      },
      {
        id: 'ai3',
        name: 'Casual Carl',
        avatar: '😊',
        score: 0,
        streak: 0,
        difficulty: 'easy',
        personality: 'unpredictable',
        status: 'idle'
      }
    ]

    setGameState(prev => ({ ...prev, aiOpponents }))
  }, [])

  // Load game settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('trivai-player-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        // Apply saved settings to game state
        setGameState(prev => ({
          ...prev,
          difficulty: parsed.preferredDifficulty || 'medium',
          timeLimit: parsed.timeLimit || 30
        }))
      } catch (error) {
        console.error('Failed to load game settings:', error)
      }
    }
  }, [])

  // Start the game
  const startGame = async () => {
    startLoading('game_start')
    
    try {
      // Simulate game initialization
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Load first question
      await loadNextQuestion()
      
      setGameState(prev => ({ ...prev, gameStarted: true }))
      playSound('round_start')
    } catch (error) {
      console.error('Failed to start game:', error)
    } finally {
      stopLoading('game_start')
    }
  }

  // Load next question
  const loadNextQuestion = async () => {
    startLoading('question_load')
    
    try {
      // Simulate AI question generation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const question = {
        id: `q${gameState.currentQuestion}`,
        question: `Sample question ${gameState.currentQuestion} for ${gameState.difficulty} difficulty`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        difficulty: gameState.difficulty,
        category: 'General Knowledge'
      }
      
      setCurrentQuestion(question)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setShowResults(false)
      
      // Simulate AI opponents thinking
      simulateAIOpponents()
      
    } catch (error) {
      console.error('Failed to load question:', error)
    } finally {
      stopLoading('question_load')
    }
  }

  // Simulate AI opponent behavior
  const simulateAIOpponents = () => {
    setGameState(prev => ({
      ...prev,
      aiOpponents: prev.aiOpponents.map(ai => ({
        ...ai,
        status: 'thinking'
      }))
    }))

    // Simulate AI answering at different times
    gameState.aiOpponents.forEach((ai, index) => {
      const baseDelay = ai.personality === 'aggressive' ? 2000 : 
                       ai.personality === 'steady' ? 5000 : 
                       Math.random() * 8000 + 2000

      setTimeout(() => {
        const isCorrect = Math.random() < getAIAccuracy(ai.difficulty)
        const points = isCorrect ? 100 : 0
        
        setGameState(prev => ({
          ...prev,
          aiOpponents: prev.aiOpponents.map(opponent => 
            opponent.id === ai.id 
              ? { 
                  ...opponent, 
                  score: opponent.score + points,
                  streak: isCorrect ? opponent.streak + 1 : 0,
                  status: 'answered'
                }
              : opponent
          )
        }))
      }, baseDelay)
    })
  }

  // Get AI accuracy based on difficulty
  const getAIAccuracy = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return 0.6
      case 'medium': return 0.75
      case 'hard': return 0.9
      default: return 0.7
    }
  }

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return
    
    setSelectedAnswer(answer)
    setIsAnswered(true)
    
    const isCorrect = answer === currentQuestion.correctAnswer
    const basePoints = 100
    let points = isCorrect ? basePoints : 0
    
    // Apply multipliers
    if (isCorrect && multipliers.length > 0) {
      const totalMultiplier = multipliers.reduce((acc, mult) => acc + mult.value, 0)
      points = Math.round(points * (1 + totalMultiplier))
    }
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
      streak: isCorrect ? prev.streak + 1 : 0,
      playerStats: {
        ...prev.playerStats,
        correctAnswers: prev.playerStats.correctAnswers + (isCorrect ? 1 : 0),
        totalAnswers: prev.playerStats.totalAnswers + 1,
        bestStreak: Math.max(prev.playerStats.bestStreak, isCorrect ? prev.streak + 1 : 0)
      }
    }))

    // Add streak multiplier
    if (isCorrect && gameState.streak > 0 && gameState.streak % 3 === 0) {
      addMultiplier({
        id: `streak_${Date.now()}`,
        type: 'streak',
        value: 0.5,
        duration: 30000,
        label: 'Streak Bonus'
      })
    }

    // Play sound
    playSound(isCorrect ? 'correct_answer' : 'incorrect_answer')
    
    // Show results
    setTimeout(() => {
      setShowResults(true)
    }, 1000)
  }

  // Handle next question
  const handleNextQuestion = async () => {
    if (gameState.currentQuestion >= gameState.questionCount) {
      // End of round
      if (gameState.currentRound >= gameState.totalRounds) {
        // Game complete
        setGameState(prev => ({ ...prev, gameComplete: true }))
        playSound('game_complete')
      } else {
        // Next round
        setGameState(prev => ({
          ...prev,
          currentRound: prev.currentRound + 1,
          currentQuestion: 1
        }))
        
        // Show bonus wheel every 2 rounds
        if (gameState.currentRound % 2 === 0) {
          setShowBonusWheel(true)
        } else {
          await loadNextQuestion()
        }
      }
    } else {
      // Next question
      setGameState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }))
      await loadNextQuestion()
    }
  }

  // Handle bonus wheel complete
  const handleBonusWheelComplete = async (reward: any) => {
    setShowBonusWheel(false)
    
    // Apply reward
    if (reward.type === 'points') {
      setGameState(prev => ({
        ...prev,
        score: prev.score + reward.value
      }))
    } else if (reward.type === 'multiplier') {
      addMultiplier({
        id: `bonus_${Date.now()}`,
        type: 'bonus',
        value: reward.value,
        duration: 60000,
        label: 'Bonus Wheel'
      })
    }
    
    await loadNextQuestion()
  }

  // Handle game restart
  const handleRestart = () => {
    setGameState({
      currentQuestion: 1,
      currentRound: 1,
      totalRounds: 5,
      timeLimit: 30,
      difficulty: 'medium',
      score: 0,
      streak: 0,
      questionCount: 10,
      gameComplete: false,
      gameStarted: false,
      aiOpponents: gameState.aiOpponents.map(ai => ({
        ...ai,
        score: 0,
        streak: 0,
        status: 'idle'
      })),
      playerStats: {
        correctAnswers: 0,
        totalAnswers: 0,
        averageTime: 0,
        bestStreak: 0
      }
    })
    
    setCurrentQuestion(null)
    setShowBonusWheel(false)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setShowResults(false)
  }

  // Get all players for scoreboard
  const allPlayers = [
    {
      id: 'player',
      name: 'You',
      avatar: '👤',
      score: gameState.score,
      streak: gameState.streak,
      status: 'active'
    },
    ...gameState.aiOpponents.map(ai => ({
      id: ai.id,
      name: ai.name,
      avatar: ai.avatar,
      score: ai.score,
      streak: ai.streak,
      status: ai.status
    }))
  ]

  if (!gameState.gameStarted) {
    return (
      <Container className="min-h-screen py-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-4">
              🎮 Solo Challenge
            </h1>
            <p className="text-neutral-400 mb-8">
              Test your knowledge against AI opponents in this single-player trivia challenge!
            </p>
            
            {/* Game Settings Summary */}
            <div className="bg-neutral-800/50 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Game Settings</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-neutral-400">Difficulty:</span>
                  <span className="text-white ml-2 capitalize">{gameState.difficulty}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Time Limit:</span>
                  <span className="text-white ml-2">{gameState.timeLimit}s</span>
                </div>
                <div>
                  <span className="text-neutral-400">Rounds:</span>
                  <span className="text-white ml-2">{gameState.totalRounds}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Questions/Round:</span>
                  <span className="text-white ml-2">{gameState.questionCount}</span>
                </div>
              </div>
            </div>
            
            {/* AI Opponents */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Your AI Opponents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {gameState.aiOpponents.map((ai) => (
                  <div key={ai.id} className="bg-neutral-800/50 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-2xl mb-1">{ai.avatar}</div>
                      <div className="text-sm font-medium text-white">{ai.name}</div>
                      <div className="text-xs text-neutral-400 capitalize">{ai.difficulty}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8 py-3 text-lg"
            >
              Start Solo Challenge
            </Button>
            
            <div className="mt-4">
              <Button
                variant="secondary"
                onClick={() => router.push('/game')}
                className="px-6 py-2"
              >
                ← Back to Game Modes
              </Button>
            </div>
          </Card>
        </motion.div>
      </Container>
    )
  }

  if (gameState.gameComplete) {
    return (
      <Container className="min-h-screen py-8">
        <GameComplete
          finalScore={gameState.score}
          players={allPlayers}
          stats={gameState.playerStats}
          onRestart={handleRestart}
          onNewGame={() => router.push('/game')}
          gameMode="solo"
        />
      </Container>
    )
  }

  return (
    <Container className="min-h-screen py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Score and Status */}
        <div className="lg:col-span-1">
          <ScoreBoard
            players={allPlayers}
            currentPlayer="player"
            className="mb-6"
          />
          
          {/* Game Progress */}
          <Card className="glass-card p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Progress</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Round</span>
                <span className="text-white">{gameState.currentRound}/{gameState.totalRounds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Question</span>
                <span className="text-white">{gameState.currentQuestion}/{gameState.questionCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Accuracy</span>
                <span className="text-white">
                  {gameState.playerStats.totalAnswers > 0 
                    ? Math.round((gameState.playerStats.correctAnswers / gameState.playerStats.totalAnswers) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Center Column - Game Content */}
        <div className="lg:col-span-2">
          {/* Final Round Indicator */}
          {gameState.currentRound === gameState.totalRounds && (
            <FinalRoundIndicator
              isActive={true}
              className="mb-6"
            />
          )}

          {/* Question Display */}
          {currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelect}
              timeLimit={gameState.timeLimit}
              showResults={showResults}
              onTimeUp={() => handleAnswerSelect('')}
              onNextQuestion={handleNextQuestion}
              isAnswered={isAnswered}
            />
          )}

          {/* Bonus Wheel */}
          {showBonusWheel && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BonusWheel
                onComplete={handleBonusWheelComplete}
                spinsRemaining={1}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Game Loading Manager */}
      <GameLoadingManager />
    </Container>
  )
}

export default SoloGamePage 