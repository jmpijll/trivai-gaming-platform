import React, { useEffect, useState } from 'react'
import { motion, useAnimationControls, useSpring, useTransform } from 'framer-motion'

interface AnimatedScoreProps {
  score: number
  previousScore?: number
  className?: string
  showDelta?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}

export const AnimatedScore: React.FC<AnimatedScoreProps> = ({
  score,
  previousScore = 0,
  className = '',
  showDelta = false,
  size = 'md',
  color = 'text-white'
}) => {
  const [displayScore, setDisplayScore] = useState(previousScore)
  const [delta, setDelta] = useState(0)
  const controls = useAnimationControls()
  const springScore = useSpring(previousScore, { stiffness: 200, damping: 30 })
  
  // Size configurations
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold'
  }

  // Transform spring value to integer for display
  const animatedScore = useTransform(springScore, (value) => Math.round(value))

  useEffect(() => {
    // Update spring target and calculate delta
    const scoreDelta = score - previousScore
    setDelta(scoreDelta)
    
    // Start the spring animation
    springScore.set(score)
    
    // Trigger visual effects for score increases
    if (scoreDelta > 0) {
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.3, ease: "easeOut" }
      })
    }
  }, [score, previousScore, springScore, controls])

  // Subscribe to animated score changes
  useEffect(() => {
    const unsubscribe = animatedScore.onChange((latest) => {
      setDisplayScore(latest)
    })
    return unsubscribe
  }, [animatedScore])

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={controls}
        className={`${sizeClasses[size]} ${color} transition-colors duration-300`}
      >
        {displayScore.toLocaleString()}
      </motion.div>
      
      {/* Delta indicator */}
      {showDelta && delta !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          className={`absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-bold ${
            delta > 0 ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {delta > 0 ? '+' : ''}{delta.toLocaleString()}
        </motion.div>
      )}
    </div>
  )
}

// Score burst animation component for major score increases
interface ScoreBurstProps {
  points: number
  show: boolean
  onComplete: () => void
}

export const ScoreBurst: React.FC<ScoreBurstProps> = ({ points, show, onComplete }) => {
  if (!show) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 0 }}
      animate={{ opacity: 1, scale: 1.5, y: -50 }}
      exit={{ opacity: 0, scale: 0.5, y: -100 }}
      onAnimationComplete={onComplete}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-lg">
        +{points.toLocaleString()}
      </div>
    </motion.div>
  )
}

// Progressive score multiplier display
interface MultiplierDisplayProps {
  multiplier: number
  active: boolean
  className?: string
}

export const MultiplierDisplay: React.FC<MultiplierDisplayProps> = ({
  multiplier,
  active,
  className = ''
}) => {
  return (
    <motion.div
      animate={{
        scale: active ? [1, 1.1, 1] : 1,
        opacity: active ? 1 : 0.6
      }}
      transition={{ duration: 0.3, repeat: active ? Infinity : 0, repeatDelay: 1 }}
      className={`inline-flex items-center space-x-1 ${className}`}
    >
      <span className={`text-sm font-semibold ${active ? 'text-yellow-400' : 'text-neutral-400'}`}>
        {multiplier}x
      </span>
      {active && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-3 h-3 bg-yellow-400 rounded-full"
        />
      )}
    </motion.div>
  )
}

// Streak indicator component
interface StreakIndicatorProps {
  streak: number
  maxStreak?: number
  className?: string
}

export const StreakIndicator: React.FC<StreakIndicatorProps> = ({
  streak,
  maxStreak = 10,
  className = ''
}) => {
  const streakPercentage = Math.min((streak / maxStreak) * 100, 100)
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm font-medium text-neutral-400">Streak</span>
      <div className="relative w-20 h-2 bg-neutral-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${streakPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
        />
      </div>
      <motion.span
        animate={{
          scale: streak > 0 ? [1, 1.2, 1] : 1,
          color: streak >= 3 ? '#fbbf24' : '#9ca3af'
        }}
        transition={{ duration: 0.3 }}
        className="text-sm font-bold"
      >
        {streak}
      </motion.span>
    </div>
  )
} 