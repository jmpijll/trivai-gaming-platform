import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { LoadingOverlay, GameLoadingSpinner, ProgressBar } from '@/components/ui/LoadingStates'

// Game phase types
export type GamePhase = 'loading' | 'topic-selection' | 'question' | 'round-complete' | 'game-complete' | 'error'

interface GameTransitionsProps {
  currentPhase: GamePhase
  nextPhase?: GamePhase
  isTransitioning?: boolean
  transitionData?: {
    currentRound?: number
    totalRounds?: number
    timeRemaining?: number
    message?: string
    progress?: number
  }
  children: React.ReactNode
  className?: string
}

export const GameTransitions: React.FC<GameTransitionsProps> = ({
  currentPhase,
  nextPhase,
  isTransitioning = false,
  transitionData = {},
  children,
  className = ''
}) => {
  const [showTransition, setShowTransition] = useState(false)
  const [transitionProgress, setTransitionProgress] = useState(0)

  // Handle transition timing
  useEffect(() => {
    if (isTransitioning) {
      setShowTransition(true)
      setTransitionProgress(0)
      
      // Simulate transition progress
      const interval = setInterval(() => {
        setTransitionProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setShowTransition(false), 500)
            return 100
          }
          return prev + 10
        })
      }, 100)
      
      return () => clearInterval(interval)
    }
  }, [isTransitioning])

  // Get phase-specific content
  const getPhaseContent = (phase: GamePhase) => {
    switch (phase) {
      case 'loading':
        return {
          title: 'Loading Game...',
          message: 'Setting up your trivia experience',
          icon: '🎮'
        }
      case 'topic-selection':
        return {
          title: 'Choose Your Topic',
          message: 'Select a topic for this round',
          icon: '🎯'
        }
      case 'question':
        return {
          title: 'Get Ready!',
          message: 'Next question coming up...',
          icon: '❓'
        }
      case 'round-complete':
        return {
          title: 'Round Complete!',
          message: `Round ${transitionData.currentRound} finished. Preparing next round...`,
          icon: '🎉'
        }
      case 'game-complete':
        return {
          title: 'Game Complete!',
          message: 'Calculating final scores...',
          icon: '🏆'
        }
      case 'error':
        return {
          title: 'Something went wrong',
          message: 'Please try again',
          icon: '⚠️'
        }
      default:
        return {
          title: 'Loading...',
          message: 'Please wait',
          icon: '⏳'
        }
    }
  }

  // Phase transition animation variants
  const transitionVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main content with phase transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhase}
          variants={containerVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Transition overlay */}
      <AnimatePresence>
        {showTransition && nextPhase && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="glass-card p-8 text-center max-w-md mx-4">
                <PhaseTransitionContent
                  fromPhase={currentPhase}
                  toPhase={nextPhase}
                  progress={transitionProgress}
                  transitionData={transitionData}
                />
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Phase transition content component
interface PhaseTransitionContentProps {
  fromPhase: GamePhase
  toPhase: GamePhase
  progress: number
  transitionData?: {
    currentRound?: number
    totalRounds?: number
    timeRemaining?: number
    message?: string
  }
}

const PhaseTransitionContent: React.FC<PhaseTransitionContentProps> = ({
  fromPhase,
  toPhase,
  progress,
  transitionData = {}
}) => {
  const fromContent = getPhaseContent(fromPhase)
  const toContent = getPhaseContent(toPhase)

  return (
    <div className="space-y-6">
      {/* Animated transition icon */}
      <motion.div
        className="text-6xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {progress < 50 ? fromContent.icon : toContent.icon}
      </motion.div>

      {/* Transition title */}
      <motion.h2
        className="text-2xl font-bold text-white"
        key={progress < 50 ? fromContent.title : toContent.title}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {progress < 50 ? fromContent.title : toContent.title}
      </motion.h2>

      {/* Transition message */}
      <motion.p
        className="text-neutral-400"
        key={progress < 50 ? fromContent.message : toContent.message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {transitionData.message || (progress < 50 ? fromContent.message : toContent.message)}
      </motion.p>

      {/* Progress bar */}
      <ProgressBar
        progress={progress}
        variant="primary"
        showLabel={true}
      />

      {/* Round indicator */}
      {transitionData.currentRound && transitionData.totalRounds && (
        <div className="text-sm text-neutral-500">
          Round {transitionData.currentRound} of {transitionData.totalRounds}
        </div>
      )}

      {/* Loading dots */}
      <div className="flex justify-center space-x-2">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-purple-500 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Helper function to get phase content
const getPhaseContent = (phase: GamePhase) => {
  switch (phase) {
    case 'loading':
      return {
        title: 'Loading Game...',
        message: 'Setting up your trivia experience',
        icon: '🎮'
      }
    case 'topic-selection':
      return {
        title: 'Choose Your Topic',
        message: 'Select a topic for this round',
        icon: '🎯'
      }
    case 'question':
      return {
        title: 'Get Ready!',
        message: 'Next question coming up...',
        icon: '❓'
      }
    case 'round-complete':
      return {
        title: 'Round Complete!',
        message: 'Great job! Preparing next round...',
        icon: '🎉'
      }
    case 'game-complete':
      return {
        title: 'Game Complete!',
        message: 'Calculating final scores...',
        icon: '🏆'
      }
    case 'error':
      return {
        title: 'Something went wrong',
        message: 'Please try again',
        icon: '⚠️'
      }
    default:
      return {
        title: 'Loading...',
        message: 'Please wait',
        icon: '⏳'
      }
  }
}

// Question loading animation
interface QuestionLoadingProps {
  isVisible: boolean
  questionNumber?: number
  timeRemaining?: number
  className?: string
}

export const QuestionLoading: React.FC<QuestionLoadingProps> = ({
  isVisible,
  questionNumber = 1,
  timeRemaining,
  className = ''
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 flex items-center justify-center ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="glass-card p-8 text-center max-w-sm mx-4">
              <motion.div
                className="text-6xl mb-4"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ❓
              </motion.div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                Question {questionNumber}
              </h3>
              
              <p className="text-neutral-400 mb-4">
                Get ready for the next question!
              </p>
              
              {timeRemaining && (
                <div className="text-sm text-neutral-500">
                  Starting in {timeRemaining}...
                </div>
              )}
              
              <GameLoadingSpinner className="mt-4" />
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Round transition animation
interface RoundTransitionProps {
  isVisible: boolean
  currentRound: number
  totalRounds: number
  className?: string
}

export const RoundTransition: React.FC<RoundTransitionProps> = ({
  isVisible,
  currentRound,
  totalRounds,
  className = ''
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed inset-0 bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-sm z-40 flex items-center justify-center ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="glass-card p-12 text-center max-w-lg mx-4">
              <motion.div
                className="text-8xl mb-6"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🎯
              </motion.div>
              
              <motion.h2
                className="text-4xl font-bold text-white mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Round {currentRound}
              </motion.h2>
              
              <motion.p
                className="text-xl text-neutral-300 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {currentRound === totalRounds ? 'Final Round!' : `of ${totalRounds}`}
              </motion.p>
              
              <motion.div
                className="flex justify-center space-x-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {[...Array(totalRounds)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      i < currentRound ? 'bg-purple-500' : 'bg-neutral-600'
                    }`}
                  />
                ))}
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameTransitions 