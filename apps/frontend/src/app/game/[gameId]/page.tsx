'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { Card } from '@/components/ui/Card'
import { TopicSelection } from '@/components/game/TopicSelection'
import { QuestionDisplay } from '@/components/game/QuestionDisplay'
import { ScoreBoard } from '@/components/game/ScoreBoard'
import { GameComplete } from '@/components/game/GameComplete'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { io, Socket } from 'socket.io-client'
import { GameState, RoundState, Question, PlayerScore } from '@/../../packages/shared/src/types/game'

type GamePhase = 'loading' | 'topic-selection' | 'question' | 'round-complete' | 'game-complete' | 'error'

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.gameId as string

  // Socket and connection state
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  
  // Game state
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('loading')
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [availableTopics, setAvailableTopics] = useState<string[]>([])
  const [roundSummary, setRoundSummary] = useState<any>(null)
  const [gameStats, setGameStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001')
    
    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to game server')
      
      // Join the game room
      newSocket.emit('get-game-state', { gameId })
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from game server')
    })

    // Game event listeners
    newSocket.on('game-state-updated', (data: { game: GameState }) => {
      setGameState(data.game)
      
      // Determine current phase based on game state
      if (data.game.gameStatus === 'completed') {
        setCurrentPhase('game-complete')
      } else if (data.game.roundState?.isComplete) {
        setCurrentPhase('round-complete')
      } else if (data.game.roundState && data.game.roundState.questions.length > 0) {
        setCurrentPhase('question')
      } else {
        setCurrentPhase('topic-selection')
      }
    })

    newSocket.on('topic-selection', (data: { availableTopics: string[]; gameId: string }) => {
      if (data.gameId === gameId) {
        setAvailableTopics(data.availableTopics)
        setCurrentPhase('topic-selection')
      }
    })

    newSocket.on('round-started', (data: { roundState: RoundState; gameId: string }) => {
      if (data.gameId === gameId) {
        setGameState(prev => prev ? { ...prev, roundState: data.roundState } : null)
        setCurrentPhase('question')
        setHasSubmitted(false)
        setSelectedAnswer(null)
      }
    })

    newSocket.on('question-displayed', (data: { question: Question; timeRemaining: number; gameId: string }) => {
      if (data.gameId === gameId) {
        setCurrentQuestion(data.question)
        setTimeRemaining(data.timeRemaining)
        setCurrentPhase('question')
        setHasSubmitted(false)
        setSelectedAnswer(null)
      }
    })

    newSocket.on('answer-submitted', (data: { playerId: string; isCorrect: boolean; gameId: string }) => {
      if (data.gameId === gameId) {
        console.log(`Player ${data.playerId} submitted answer: ${data.isCorrect ? 'correct' : 'incorrect'}`)
      }
    })

    newSocket.on('question-ended', (data: { 
      question: Question; 
      correctAnswerIndex: number; 
      explanation: string; 
      scores: PlayerScore[]; 
      gameId: string 
    }) => {
      if (data.gameId === gameId) {
        setGameState(prev => prev ? { ...prev, scores: data.scores } : null)
        // Show explanation for 3 seconds before moving to next question
        setTimeout(() => {
          setCurrentQuestion(null)
        }, 3000)
      }
    })

    newSocket.on('round-ended', (data: { summary: any; gameId: string; isGameComplete: boolean }) => {
      if (data.gameId === gameId) {
        setRoundSummary(data.summary)
        if (data.isGameComplete) {
          setCurrentPhase('game-complete')
        } else {
          setCurrentPhase('round-complete')
        }
      }
    })

    newSocket.on('game-completed', (data: { stats: any; finalScores: PlayerScore[]; gameId: string }) => {
      if (data.gameId === gameId) {
        setGameStats(data.stats)
        setGameState(prev => prev ? { ...prev, scores: data.finalScores } : null)
        setCurrentPhase('game-complete')
      }
    })

    newSocket.on('game-error', (data: { message: string; gameId?: string }) => {
      if (!data.gameId || data.gameId === gameId) {
        setError(data.message)
        setCurrentPhase('error')
      }
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [gameId])

  // Timer countdown effect
  useEffect(() => {
    if (timeRemaining > 0 && currentPhase === 'question' && !hasSubmitted) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            // Auto-submit when time runs out
            handleSubmitAnswer(-1) // -1 indicates no answer selected
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeRemaining, currentPhase, hasSubmitted])

  // Game interaction handlers
  const handleTopicSelect = (topic: string) => {
    if (socket && isConnected) {
      socket.emit('select-topic', { gameId, topic })
    }
  }

  const handleSubmitAnswer = (answerIndex: number) => {
    if (socket && isConnected && !hasSubmitted) {
      setSelectedAnswer(answerIndex)
      setHasSubmitted(true)
      socket.emit('submit-answer', { gameId, answerIndex })
    }
  }

  const handleReturnToLobby = () => {
    router.push('/lobby')
  }

  const handleQuitGame = () => {
    if (socket && isConnected) {
      socket.emit('quit-game', { gameId })
    }
    router.push('/lobby')
  }

  // Render loading state
  if (currentPhase === 'loading') {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg text-neutral-300">Loading game...</p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-neutral-400">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </Card>
      </Container>
    )
  }

  // Render error state
  if (currentPhase === 'error') {
    return (
      <Container className="min-h-screen flex items-center justify-center">
        <Card className="glass-card p-8 text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">Game Error</h2>
          <p className="text-neutral-300 mb-6">{error}</p>
          <button
            onClick={handleReturnToLobby}
            className="glass-button px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500"
          >
            Return to Lobby
          </button>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              TrivAI Game
            </h1>
            {gameState && (
              <p className="text-neutral-400">
                Round {gameState.currentRound} of {gameState.totalRounds}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-neutral-400">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <button
              onClick={handleQuitGame}
              className="glass-button px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-sm"
            >
              Quit Game
            </button>
          </div>
        </div>

        {/* Score Board */}
        {gameState && (
          <ScoreBoard 
            scores={gameState.scores} 
            currentRound={gameState.currentRound}
            totalRounds={gameState.totalRounds}
          />
        )}

        {/* Main Game Content */}
        <div className="space-y-6">
          {currentPhase === 'topic-selection' && (
            <TopicSelection
              topics={availableTopics}
              onTopicSelect={handleTopicSelect}
              gameState={gameState}
            />
          )}

          {currentPhase === 'question' && currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              timeRemaining={timeRemaining}
              onSubmitAnswer={handleSubmitAnswer}
              selectedAnswer={selectedAnswer}
              hasSubmitted={hasSubmitted}
              gameState={gameState}
            />
          )}

          {currentPhase === 'round-complete' && (
            <Card className="glass-card p-8 text-center">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Round Complete!</h2>
              {roundSummary && (
                <div className="space-y-4">
                  <p className="text-lg text-neutral-300">
                    Round {roundSummary.roundNumber} Results
                  </p>
                  <div className="text-sm text-neutral-400">
                    Next round starting soon...
                  </div>
                </div>
              )}
              <LoadingSpinner size="sm" className="mt-4" />
            </Card>
          )}

          {currentPhase === 'game-complete' && (
            <GameComplete
              finalScores={gameState?.scores || []}
              gameStats={gameStats}
              onReturnToLobby={handleReturnToLobby}
            />
          )}
        </div>
      </div>
    </Container>
  )
} 