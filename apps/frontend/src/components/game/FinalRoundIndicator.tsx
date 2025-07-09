import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import { Card } from '@/components/ui/Card'

interface FinalRoundIndicatorProps {
  isActive: boolean
  currentRound: number
  totalRounds: number
  timeRemaining?: number
  questionsRemaining?: number
  specialMechanics?: {
    doublePoints?: boolean
    noWrongAnswers?: boolean
    timeBonus?: boolean
    allOrNothing?: boolean
  }
  onRoundComplete?: () => void
  className?: string
}

interface LightningBolt {
  id: string
  x: number
  y: number
  rotation: number
  delay: number
}

export const FinalRoundIndicator: React.FC<FinalRoundIndicatorProps> = ({
  isActive,
  currentRound,
  totalRounds,
  timeRemaining,
  questionsRemaining,
  specialMechanics = {},
  onRoundComplete,
  className = ''
}) => {
  const [showDramaticEntry, setShowDramaticEntry] = useState(false)
  const [lightningBolts, setLightningBolts] = useState<LightningBolt[]>([])
  const [pulseIntensity, setPulseIntensity] = useState(1)
  
  const headerControls = useAnimationControls()
  const backgroundControls = useAnimationControls()
  const warningControls = useAnimationControls()

  // Initialize dramatic entry effect
  useEffect(() => {
    if (isActive && !showDramaticEntry) {
      setShowDramaticEntry(true)
      
      // Generate lightning bolts
      const bolts: LightningBolt[] = Array.from({ length: 8 }, (_, i) => ({
        id: `bolt-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        delay: i * 0.1
      }))
      setLightningBolts(bolts)
      
      // Dramatic entry animation sequence
      setTimeout(() => {
        headerControls.start({
          scale: [0, 1.3, 1],
          rotate: [0, 5, -5, 0],
          transition: { duration: 1.5, ease: "easeOut" }
        })
        
        backgroundControls.start({
          opacity: [0, 1, 0.8],
          scale: [0.8, 1.2, 1],
          transition: { duration: 2, ease: "easeInOut" }
        })
      }, 500)
    }
  }, [isActive, showDramaticEntry, headerControls, backgroundControls])

  // Pulse effect based on urgency
  useEffect(() => {
    if (isActive && timeRemaining !== undefined) {
      if (timeRemaining <= 10) {
        setPulseIntensity(3)
        warningControls.start({
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
          transition: { duration: 0.5, repeat: Infinity, ease: "easeInOut" }
        })
      } else if (timeRemaining <= 30) {
        setPulseIntensity(2)
        warningControls.start({
          scale: [1, 1.05, 1],
          transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        })
      } else {
        setPulseIntensity(1)
        warningControls.stop()
      }
    }
  }, [timeRemaining, isActive, warningControls])

  // Get special mechanic display
  const getSpecialMechanicsDisplay = () => {
    const mechanics = []
    
    if (specialMechanics.doublePoints) {
      mechanics.push({
        icon: '💰',
        title: 'Double Points',
        description: 'All points doubled this round',
        color: 'text-yellow-400'
      })
    }
    
    if (specialMechanics.noWrongAnswers) {
      mechanics.push({
        icon: '🛡️',
        title: 'No Wrong Answers',
        description: 'Wrong answers don\'t break streak',
        color: 'text-blue-400'
      })
    }
    
    if (specialMechanics.timeBonus) {
      mechanics.push({
        icon: '⏱️',
        title: 'Time Bonus',
        description: 'Extra points for speed',
        color: 'text-green-400'
      })
    }
    
    if (specialMechanics.allOrNothing) {
      mechanics.push({
        icon: '🎯',
        title: 'All or Nothing',
        description: 'Perfect round = 10x points',
        color: 'text-red-400'
      })
    }
    
    return mechanics
  }

  if (!isActive) return null

  return (
    <AnimatePresence>
      <motion.div
        className={`relative ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Dramatic Background Effects */}
        <motion.div
          className="absolute inset-0 rounded-lg overflow-hidden"
          animate={backgroundControls}
        >
          {/* Pulsing red background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-red-900/20 via-orange-900/20 to-red-900/20"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Lightning effects */}
          {lightningBolts.map((bolt) => (
            <motion.div
              key={bolt.id}
              className="absolute w-1 h-full bg-gradient-to-b from-yellow-400 via-white to-yellow-400 opacity-80"
              style={{
                left: `${bolt.x}%`,
                top: `${bolt.y}%`,
                transform: `rotate(${bolt.rotation}deg)`,
                transformOrigin: 'center'
              }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scaleY: [0, 1, 0]
              }}
              transition={{
                duration: 0.3,
                delay: bolt.delay,
                repeat: Infinity,
                repeatDelay: 3
              }}
            />
          ))}
          
          {/* Scan lines effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"
            animate={{
              y: ['-100%', '100%']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>

        {/* Main Content */}
        <Card className="glass-card p-6 border-2 border-red-500/50 relative z-10">
          {/* Header */}
          <motion.div
            className="text-center mb-6"
            animate={headerControls}
          >
            <motion.div
              className="text-6xl mb-2"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ⚡
            </motion.div>
            <motion.h2
              className="text-3xl font-bold text-red-400 mb-2"
              animate={warningControls}
            >
              FINAL ROUND
            </motion.h2>
            <motion.p
              className="text-neutral-300 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Round {currentRound} of {totalRounds} • This is it!
            </motion.p>
          </motion.div>

          {/* Round Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-neutral-400">Progress</span>
              <span className="text-sm text-neutral-400">
                {questionsRemaining ? `${questionsRemaining} questions left` : 'Final stretch'}
              </span>
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500"
                initial={{ width: '0%' }}
                animate={{ width: `${((currentRound - 1) / totalRounds) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-400 to-red-500 absolute top-0"
                style={{ width: `${(1 / totalRounds) * 100}%`, left: `${((currentRound - 1) / totalRounds) * 100}%` }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  boxShadow: [
                    '0 0 10px rgba(255,255,0,0.5)',
                    '0 0 20px rgba(255,255,0,0.8)',
                    '0 0 10px rgba(255,255,0,0.5)'
                  ]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>

          {/* Time Remaining (if provided) */}
          {timeRemaining !== undefined && (
            <motion.div
              className="text-center mb-6"
              animate={warningControls}
            >
              <div className="text-sm text-neutral-400 mb-1">Time Remaining</div>
              <div className={`text-4xl font-bold ${
                timeRemaining <= 10 ? 'text-red-400' : 
                timeRemaining <= 30 ? 'text-orange-400' : 
                'text-yellow-400'
              }`}>
                {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
            </motion.div>
          )}

          {/* Special Mechanics */}
          {getSpecialMechanicsDisplay().length > 0 && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-white mb-2">⭐ Special Rules ⭐</h3>
                <p className="text-sm text-neutral-400">This round has special mechanics!</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getSpecialMechanicsDisplay().map((mechanic, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-r from-neutral-800/50 to-neutral-700/50 p-3 rounded-lg border border-neutral-600/50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.2 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{mechanic.icon}</div>
                      <div>
                        <div className={`font-bold ${mechanic.color}`}>
                          {mechanic.title}
                        </div>
                        <div className="text-xs text-neutral-400">
                          {mechanic.description}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Motivational Message */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg p-4 border border-red-500/30">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="text-2xl">🔥</div>
                <div className="text-lg font-bold text-white">Make Every Answer Count!</div>
                <div className="text-2xl">🔥</div>
              </div>
              <p className="text-sm text-neutral-300">
                This is your chance to secure victory. Give it everything you've got!
              </p>
            </div>
          </motion.div>
        </Card>

        {/* Corner Effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top corners */}
          <motion.div
            className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500"
            animate={{
              borderColor: ['#ef4444', '#f97316', '#eab308', '#ef4444']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500"
            animate={{
              borderColor: ['#ef4444', '#f97316', '#eab308', '#ef4444']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          {/* Bottom corners */}
          <motion.div
            className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500"
            animate={{
              borderColor: ['#ef4444', '#f97316', '#eab308', '#ef4444']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500"
            animate={{
              borderColor: ['#ef4444', '#f97316', '#eab308', '#ef4444']
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-red-500 rounded-full"
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
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FinalRoundIndicator 