import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingOverlay, GameLoadingSpinner, ProgressBar } from '@/components/ui/LoadingStates'
import { GameTransitions, QuestionLoading, RoundTransition } from '@/components/game/GameTransitions'
import { useGameSounds } from '@/hooks/useAudio'

// Loading state types
export interface LoadingState {
  id: string
  type: 'initial' | 'transition' | 'question' | 'round' | 'game-complete' | 'error'
  title: string
  message: string
  progress?: number
  duration?: number
  showProgress?: boolean
  icon?: string
}

// Loading manager props
interface GameLoadingManagerProps {
  children: React.ReactNode
  currentPhase: string
  isLoading: boolean
  loadingState?: LoadingState
  gameData?: {
    currentRound?: number
    totalRounds?: number
    questionNumber?: number
    timeRemaining?: number
  }
  onLoadingComplete?: () => void
  className?: string
}

export const GameLoadingManager: React.FC<GameLoadingManagerProps> = ({
  children,
  currentPhase,
  isLoading,
  loadingState,
  gameData = {},
  onLoadingComplete,
  className = ''
}) => {
  const [internalProgress, setInternalProgress] = useState(0)
  const [showTransition, setShowTransition] = useState(false)
  const [transitionType, setTransitionType] = useState<string>('')
  
  const { playSound } = useGameSounds()

  // Handle loading progress simulation
  useEffect(() => {
    if (isLoading && loadingState) {
      setInternalProgress(0)
      setShowTransition(true)
      setTransitionType(loadingState.type)

      // Play loading sound
      playSound('navigation')

      const duration = loadingState.duration || 2000
      const interval = setInterval(() => {
        setInternalProgress(prev => {
          const increment = 100 / (duration / 100)
          if (prev >= 100) {
            clearInterval(interval)
            
            // Play completion sound
            playSound('notification')
            
            // Hide transition after delay
            setTimeout(() => {
              setShowTransition(false)
              if (onLoadingComplete) {
                onLoadingComplete()
              }
            }, 500)
            
            return 100
          }
          return prev + increment
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isLoading, loadingState, onLoadingComplete, playSound])

  // Get loading content based on phase
  const getLoadingContent = useCallback((phase: string): LoadingState => {
    switch (phase) {
      case 'connecting':
        return {
          id: 'connecting',
          type: 'initial',
          title: 'Connecting to Game',
          message: 'Establishing connection to game server...',
          icon: '🔗',
          showProgress: true
        }
      
      case 'loading-game':
        return {
          id: 'loading-game',
          type: 'initial',
          title: 'Loading Game',
          message: 'Preparing your trivia experience...',
          icon: '🎮',
          showProgress: true
        }
      
      case 'joining-game':
        return {
          id: 'joining-game',
          type: 'transition',
          title: 'Joining Game',
          message: 'Entering game room...',
          icon: '🚪',
          duration: 1500
        }
      
      case 'round-starting':
        return {
          id: 'round-starting',
          type: 'round',
          title: `Round ${gameData.currentRound || 1}`,
          message: gameData.currentRound === gameData.totalRounds ? 'Final Round!' : 'Get ready for the next round!',
          icon: '🎯',
          duration: 2000
        }
      
      case 'question-loading':
        return {
          id: 'question-loading',
          type: 'question',
          title: `Question ${gameData.questionNumber || 1}`,
          message: 'Loading next question...',
          icon: '❓',
          duration: 1500
        }
      
      case 'generating-question':
        return {
          id: 'generating-question',
          type: 'question',
          title: 'Generating Question',
          message: 'AI is creating your question...',
          icon: '🤖',
          showProgress: true,
          duration: 3000
        }
      
      case 'calculating-scores':
        return {
          id: 'calculating-scores',
          type: 'transition',
          title: 'Calculating Scores',
          message: 'Processing answers and updating scores...',
          icon: '📊',
          showProgress: true,
          duration: 2000
        }
      
      case 'round-complete':
        return {
          id: 'round-complete',
          type: 'round',
          title: 'Round Complete!',
          message: 'Great job! Preparing next round...',
          icon: '🎉',
          duration: 2500
        }
      
      case 'game-complete':
        return {
          id: 'game-complete',
          type: 'game-complete',
          title: 'Game Complete!',
          message: 'Calculating final results...',
          icon: '🏆',
          showProgress: true,
          duration: 3000
        }
      
      case 'error':
        return {
          id: 'error',
          type: 'error',
          title: 'Connection Error',
          message: 'Having trouble connecting. Please wait...',
          icon: '⚠️',
          showProgress: false
        }
      
      default:
        return {
          id: 'default',
          type: 'initial',
          title: 'Loading...',
          message: 'Please wait...',
          icon: '⏳',
          showProgress: true
        }
    }
  }, [gameData])

  // Render specific loading component based on type
  const renderLoadingComponent = () => {
    const state = loadingState || getLoadingContent(currentPhase)
    
    switch (state.type) {
      case 'question':
        return (
          <QuestionLoading
            isVisible={showTransition}
            questionNumber={gameData.questionNumber}
            timeRemaining={gameData.timeRemaining}
          />
        )
      
      case 'round':
        return (
          <RoundTransition
            isVisible={showTransition}
            currentRound={gameData.currentRound || 1}
            totalRounds={gameData.totalRounds || 5}
          />
        )
      
      default:
        return (
          <LoadingOverlay
            isVisible={showTransition}
            title={state.title}
            message={state.message}
            progress={state.showProgress ? internalProgress : undefined}
            variant="game"
          />
        )
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main content */}
      <AnimatePresence mode="wait">
        {!showTransition && (
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading overlays */}
      {renderLoadingComponent()}
    </div>
  )
}

// Hook for managing loading states
export const useGameLoading = () => {
  const [loadingState, setLoadingState] = useState<LoadingState | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const showLoading = useCallback((state: Partial<LoadingState>) => {
    setLoadingState({
      id: state.id || 'loading',
      type: state.type || 'initial',
      title: state.title || 'Loading...',
      message: state.message || 'Please wait...',
      ...state
    })
    setIsLoading(true)
  }, [])

  const hideLoading = useCallback(() => {
    setIsLoading(false)
    setTimeout(() => setLoadingState(null), 500)
  }, [])

  const showConnecting = useCallback(() => {
    showLoading({
      id: 'connecting',
      type: 'initial',
      title: 'Connecting to Game',
      message: 'Establishing connection to game server...',
      icon: '🔗',
      showProgress: true
    })
  }, [showLoading])

  const showQuestionLoading = useCallback((questionNumber: number) => {
    showLoading({
      id: 'question-loading',
      type: 'question',
      title: `Question ${questionNumber}`,
      message: 'Loading next question...',
      icon: '❓',
      duration: 1500
    })
  }, [showLoading])

  const showRoundTransition = useCallback((currentRound: number, totalRounds: number) => {
    showLoading({
      id: 'round-starting',
      type: 'round',
      title: `Round ${currentRound}`,
      message: currentRound === totalRounds ? 'Final Round!' : 'Get ready for the next round!',
      icon: '🎯',
      duration: 2000
    })
  }, [showLoading])

  const showScoreCalculation = useCallback(() => {
    showLoading({
      id: 'calculating-scores',
      type: 'transition',
      title: 'Calculating Scores',
      message: 'Processing answers and updating scores...',
      icon: '📊',
      showProgress: true,
      duration: 2000
    })
  }, [showLoading])

  const showGameComplete = useCallback(() => {
    showLoading({
      id: 'game-complete',
      type: 'game-complete',
      title: 'Game Complete!',
      message: 'Calculating final results...',
      icon: '🏆',
      showProgress: true,
      duration: 3000
    })
  }, [showLoading])

  const showError = useCallback((message: string = 'Something went wrong') => {
    showLoading({
      id: 'error',
      type: 'error',
      title: 'Error',
      message,
      icon: '⚠️',
      showProgress: false
    })
  }, [showLoading])

  return {
    loadingState,
    isLoading,
    showLoading,
    hideLoading,
    showConnecting,
    showQuestionLoading,
    showRoundTransition,
    showScoreCalculation,
    showGameComplete,
    showError
  }
}

// Component for smooth fade transitions
interface FadeTransitionProps {
  isVisible: boolean
  duration?: number
  delay?: number
  children: React.ReactNode
  className?: string
}

export const FadeTransition: React.FC<FadeTransitionProps> = ({
  isVisible,
  duration = 0.3,
  delay = 0,
  children,
  className = ''
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration, delay, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Component for slide transitions
interface SlideTransitionProps {
  isVisible: boolean
  direction: 'left' | 'right' | 'up' | 'down'
  duration?: number
  delay?: number
  children: React.ReactNode
  className?: string
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  isVisible,
  direction,
  duration = 0.3,
  delay = 0,
  children,
  className = ''
}) => {
  const directionVariants = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    up: { y: -100, opacity: 0 },
    down: { y: 100, opacity: 0 }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={className}
          initial={directionVariants[direction]}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={directionVariants[direction]}
          transition={{ duration, delay, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameLoadingManager 