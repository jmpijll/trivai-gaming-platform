import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { PlayerScore } from '@/../../packages/shared/src/types/game'
import { AnimatedScore, MultiplierDisplay, StreakIndicator } from './AnimatedScore'

interface ScoreBoardProps {
  scores: PlayerScore[]
  currentRound: number
  totalRounds: number
  previousScores?: PlayerScore[]
  showAnimations?: boolean
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  currentRound,
  totalRounds,
  previousScores = [],
  showAnimations = true
}) => {
  const [previousSortedScores, setPreviousSortedScores] = useState<PlayerScore[]>([])
  const [positionChanges, setPositionChanges] = useState<Record<string, number>>({})
  const headerControls = useAnimationControls()

  const sortedScores = useMemo(() => {
    return [...scores].sort((a, b) => b.totalScore - a.totalScore)
  }, [scores])

  // Track position changes
  useEffect(() => {
    if (previousSortedScores.length > 0) {
      const changes: Record<string, number> = {}
      
      sortedScores.forEach((score, newIndex) => {
        const oldIndex = previousSortedScores.findIndex(s => s.playerId === score.playerId)
        if (oldIndex !== -1 && oldIndex !== newIndex) {
          changes[score.playerId] = oldIndex - newIndex // Positive means moved up
        }
      })
      
      setPositionChanges(changes)
      
      // Clear position changes after animation
      setTimeout(() => setPositionChanges({}), 1000)
    }
    
    setPreviousSortedScores(sortedScores)
  }, [sortedScores, previousSortedScores])

  // Header pulse animation for new round
  useEffect(() => {
    if (showAnimations && currentRound > 1) {
      headerControls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5, ease: "easeOut" }
      })
    }
  }, [currentRound, headerControls, showAnimations])

  const getPositionColor = (position: number) => {
    switch (position) {
      case 0: return 'text-yellow-400'
      case 1: return 'text-gray-400'
      case 2: return 'text-amber-600'
      default: return 'text-neutral-400'
    }
  }

  const getPositionBg = (position: number) => {
    switch (position) {
      case 0: return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
      case 1: return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 border-gray-500/30'
      case 2: return 'bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30'
      default: return 'bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 border-neutral-700/30'
    }
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0: return '👑'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `${position + 1}.`
    }
  }

  const getPositionChangeIndicator = (playerId: string) => {
    const change = positionChanges[playerId]
    if (!change) return null
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
          change > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}
      >
        {change > 0 ? '↑' : '↓'}
      </motion.div>
    )
  }

  // Container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  }

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const getPreviousScore = (playerId: string) => {
    return previousScores.find(s => s.playerId === playerId)?.totalScore || 0
  }

  const getScoreMultiplier = (score: PlayerScore) => {
    // Calculate multiplier based on streak and other factors
    let multiplier = 1
    if (score.streak >= 3) multiplier += 0.5
    if (score.streak >= 5) multiplier += 0.5
    if (score.streak >= 7) multiplier += 1
    return multiplier
  }

  return (
    <Card className="glass-card p-6 relative overflow-hidden">
      {/* Background animation effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-transparent opacity-60" />
      
      {/* Header */}
      <motion.div 
        className="flex justify-between items-center mb-6"
        animate={headerControls}
      >
        <div className="flex items-center space-x-3">
          <motion.h3 
            className="text-xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            🏆 Leaderboard
          </motion.h3>
          <motion.div
            className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full text-sm font-medium text-purple-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            Live
          </motion.div>
        </div>
        <motion.div 
          className="text-sm text-neutral-400"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Round {currentRound} of {totalRounds}
        </motion.div>
      </motion.div>

      {/* Players List */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sortedScores.map((score, index) => (
            <motion.div
              key={score.playerId}
              variants={itemVariants}
              layout
              layoutId={`player-${score.playerId}`}
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div
                className={`
                  relative p-4 rounded-lg border backdrop-blur-sm
                  transition-all duration-300
                  ${getPositionBg(index)}
                  ${index === 0 ? 'ring-1 ring-yellow-500/50' : ''}
                `}
              >
                {/* Position change indicator */}
                <AnimatePresence>
                  {getPositionChangeIndicator(score.playerId)}
                </AnimatePresence>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Position Icon */}
                    <motion.div 
                      className={`text-2xl font-bold ${getPositionColor(index)}`}
                      initial={{ rotate: -10, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {getPositionIcon(index)}
                    </motion.div>

                    {/* Player Info */}
                    <div>
                      <motion.div 
                        className="font-semibold text-white text-lg"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.1 }}
                      >
                        Player {score.playerId.slice(-4)}
                      </motion.div>
                      <motion.div 
                        className="flex items-center space-x-4 text-sm text-neutral-400"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        <span>{score.correctAnswers} correct</span>
                        <StreakIndicator streak={score.streak} className="text-xs" />
                        <MultiplierDisplay 
                          multiplier={getScoreMultiplier(score)} 
                          active={score.streak >= 3}
                          className="text-xs"
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Score Display */}
                  <div className="text-right">
                    <AnimatedScore
                      score={score.totalScore}
                      previousScore={getPreviousScore(score.playerId)}
                      size={index === 0 ? 'xl' : index < 3 ? 'lg' : 'md'}
                      color={index === 0 ? 'text-yellow-400' : 'text-white'}
                      showDelta={true}
                      className="mb-1"
                    />
                    <motion.div 
                      className="text-sm text-neutral-400"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {score.averageResponseTime.toFixed(1)}s avg
                    </motion.div>
                  </div>
                </div>

                {/* Performance indicators for top 3 */}
                {index < 3 && (
                  <motion.div
                    className="mt-3 pt-3 border-t border-neutral-700/50"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: index * 0.1 + 0.4 }}
                  >
                    <div className="flex justify-between text-xs text-neutral-400">
                      <span>Streak Bonus: +{score.streak * 10}</span>
                      <span>Speed Bonus: +{Math.max(0, Math.floor((10 - score.averageResponseTime) * 5))}</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Quick stats */}
      <motion.div 
        className="mt-8 pt-6 border-t border-neutral-700/50"
        variants={statsVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="grid grid-cols-3 gap-4 text-center"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <AnimatedScore
              score={scores.reduce((sum, s) => sum + s.correctAnswers, 0)}
              previousScore={previousScores.reduce((sum, s) => sum + s.correctAnswers, 0)}
              size="lg"
              color="text-purple-400"
              className="mb-1"
            />
            <div className="text-sm text-neutral-400">Total Correct</div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className="text-2xl font-bold text-blue-400">
              {scores.length > 0 
                ? (scores.reduce((sum, s) => sum + s.averageResponseTime, 0) / scores.length).toFixed(1)
                : '0.0'
              }s
            </div>
            <div className="text-sm text-neutral-400">Avg Response</div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <AnimatedScore
              score={Math.max(...scores.map(s => s.streak), 0)}
              previousScore={Math.max(...previousScores.map(s => s.streak), 0)}
              size="lg"
              color="text-green-400"
              className="mb-1"
            />
            <div className="text-sm text-neutral-400">Best Streak</div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating celebration particles for leader changes */}
      <AnimatePresence>
        {sortedScores[0] && positionChanges[sortedScores[0].playerId] > 0 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 2) * 20}%`,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  y: [0, -20, -40]
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
} 