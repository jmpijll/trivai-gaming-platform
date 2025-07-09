import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import { Card } from '@/components/ui/Card'

interface Multiplier {
  id: string
  value: number
  type: 'streak' | 'speed' | 'combo' | 'bonus' | 'wheel'
  duration: number // in seconds
  remainingTime: number
  source: string
  color: string
  icon: string
}

interface MultiplierVisualizationProps {
  multipliers: Multiplier[]
  activeScore?: number
  onMultiplierExpired?: (id: string) => void
  showFloatingEffects?: boolean
  className?: string
}

interface FloatingEffect {
  id: string
  value: number
  x: number
  y: number
  color: string
}

export const MultiplierVisualization: React.FC<MultiplierVisualizationProps> = ({
  multipliers,
  activeScore = 0,
  onMultiplierExpired,
  showFloatingEffects = true,
  className = ''
}) => {
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([])
  const [totalMultiplier, setTotalMultiplier] = useState(1)
  const [isMultiplierActive, setIsMultiplierActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const pulseControls = useAnimationControls()

  // Calculate total multiplier
  useEffect(() => {
    const total = multipliers.reduce((acc, mult) => acc * mult.value, 1)
    setTotalMultiplier(total)
    setIsMultiplierActive(total > 1)
    
    // Trigger pulse animation when multiplier changes
    if (total > 1) {
      pulseControls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.5, ease: "easeOut" }
      })
    }
  }, [multipliers, pulseControls])

  // Create floating effect
  const createFloatingEffect = (multiplier: Multiplier) => {
    if (!showFloatingEffects || !containerRef.current) return

    const container = containerRef.current.getBoundingClientRect()
    const effect: FloatingEffect = {
      id: `${multiplier.id}-${Date.now()}`,
      value: multiplier.value,
      x: Math.random() * container.width,
      y: Math.random() * container.height,
      color: multiplier.color
    }

    setFloatingEffects(prev => [...prev, effect])

    // Remove effect after animation
    setTimeout(() => {
      setFloatingEffects(prev => prev.filter(e => e.id !== effect.id))
    }, 2000)
  }

  // Handle multiplier expiration
  useEffect(() => {
    const timers = multipliers.map(multiplier => {
      if (multiplier.remainingTime <= 0) {
        onMultiplierExpired?.(multiplier.id)
        return null
      }
      return setTimeout(() => {
        onMultiplierExpired?.(multiplier.id)
      }, multiplier.remainingTime * 1000)
    })

    return () => {
      timers.forEach(timer => timer && clearTimeout(timer))
    }
  }, [multipliers, onMultiplierExpired])

  // Multiplier type configurations
  const getMultiplierConfig = (type: string) => {
    switch (type) {
      case 'streak':
        return { 
          bgColor: 'from-orange-500/20 to-red-500/20',
          borderColor: 'border-orange-500/50',
          textColor: 'text-orange-400',
          glowColor: 'shadow-orange-500/20'
        }
      case 'speed':
        return { 
          bgColor: 'from-blue-500/20 to-cyan-500/20',
          borderColor: 'border-blue-500/50',
          textColor: 'text-blue-400',
          glowColor: 'shadow-blue-500/20'
        }
      case 'combo':
        return { 
          bgColor: 'from-purple-500/20 to-pink-500/20',
          borderColor: 'border-purple-500/50',
          textColor: 'text-purple-400',
          glowColor: 'shadow-purple-500/20'
        }
      case 'bonus':
        return { 
          bgColor: 'from-green-500/20 to-emerald-500/20',
          borderColor: 'border-green-500/50',
          textColor: 'text-green-400',
          glowColor: 'shadow-green-500/20'
        }
      case 'wheel':
        return { 
          bgColor: 'from-yellow-500/20 to-orange-500/20',
          borderColor: 'border-yellow-500/50',
          textColor: 'text-yellow-400',
          glowColor: 'shadow-yellow-500/20'
        }
      default:
        return { 
          bgColor: 'from-gray-500/20 to-slate-500/20',
          borderColor: 'border-gray-500/50',
          textColor: 'text-gray-400',
          glowColor: 'shadow-gray-500/20'
        }
    }
  }

  // Calculate progress for timer
  const getProgress = (multiplier: Multiplier) => {
    return (multiplier.remainingTime / multiplier.duration) * 100
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <AnimatePresence>
        {multipliers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Total Multiplier Display */}
            <Card className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="text-2xl"
                    animate={{
                      rotate: isMultiplierActive ? [0, 5, -5, 0] : 0,
                      scale: isMultiplierActive ? [1, 1.1, 1] : 1
                    }}
                    transition={{
                      duration: 2,
                      repeat: isMultiplierActive ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    ⚡
                  </motion.div>
                  <div>
                    <div className="text-sm text-neutral-400">Total Multiplier</div>
                    <motion.div
                      className="text-2xl font-bold text-white"
                      animate={pulseControls}
                    >
                      {totalMultiplier.toFixed(1)}x
                    </motion.div>
                  </div>
                </div>
                
                {/* Active Score Preview */}
                {activeScore > 0 && (
                  <motion.div
                    className="text-right"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="text-sm text-neutral-400">Next Score</div>
                    <div className="text-xl font-bold text-green-400">
                      {Math.round(activeScore * totalMultiplier).toLocaleString()}
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>

            {/* Individual Multipliers */}
            <div className="space-y-2">
              {multipliers.map((multiplier, index) => {
                const config = getMultiplierConfig(multiplier.type)
                const progress = getProgress(multiplier)
                
                return (
                  <motion.div
                    key={multiplier.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      relative p-3 rounded-lg border backdrop-blur-sm
                      bg-gradient-to-r ${config.bgColor}
                      ${config.borderColor} ${config.glowColor}
                      shadow-lg
                    `}
                  >
                    {/* Progress bar background */}
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
                        initial={{ width: `${progress}%` }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="text-xl"
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        >
                          {multiplier.icon}
                        </motion.div>
                        <div>
                          <div className={`font-bold ${config.textColor}`}>
                            {multiplier.value}x {multiplier.type}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {multiplier.source}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`text-lg font-bold ${config.textColor}`}>
                          {Math.round(multiplier.remainingTime)}s
                        </div>
                        <div className="text-xs text-neutral-400">remaining</div>
                      </div>
                    </div>
                    
                    {/* Expiration warning */}
                    {multiplier.remainingTime <= 5 && (
                      <motion.div
                        className="absolute inset-0 rounded-lg border-2 border-red-500/50"
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Effects */}
      <AnimatePresence>
        {floatingEffects.map((effect) => (
          <motion.div
            key={effect.id}
            className="absolute pointer-events-none z-10"
            style={{
              left: effect.x,
              top: effect.y,
              color: effect.color
            }}
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ 
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1.2, 0.8],
              y: [0, -20, -40, -60]
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <div className="text-lg font-bold">
              {effect.value}x
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Combo Effect */}
      {isMultiplierActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent blur-xl" />
          
          {/* Sparkle particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 20}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Score Multiplier Popup */}
      {activeScore > 0 && totalMultiplier > 1 && (
        <motion.div
          className="absolute top-0 right-0 transform translate-x-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <Card className="glass-card p-3 border-green-500/30">
            <div className="text-center">
              <div className="text-xs text-neutral-400 mb-1">Multiplied Score</div>
              <div className="text-lg font-bold text-green-400">
                {Math.round(activeScore * totalMultiplier).toLocaleString()}
              </div>
              <div className="text-xs text-neutral-400">
                {activeScore.toLocaleString()} × {totalMultiplier.toFixed(1)}
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

// Hook for managing multipliers
export const useMultipliers = () => {
  const [multipliers, setMultipliers] = useState<Multiplier[]>([])

  const addMultiplier = (multiplier: Omit<Multiplier, 'id' | 'remainingTime'>) => {
    const newMultiplier: Multiplier = {
      ...multiplier,
      id: `${multiplier.type}-${Date.now()}`,
      remainingTime: multiplier.duration
    }
    setMultipliers(prev => [...prev, newMultiplier])
  }

  const removeMultiplier = (id: string) => {
    setMultipliers(prev => prev.filter(m => m.id !== id))
  }

  const updateMultiplierTime = (id: string, remainingTime: number) => {
    setMultipliers(prev => 
      prev.map(m => 
        m.id === id ? { ...m, remainingTime } : m
      )
    )
  }

  const clearMultipliers = () => {
    setMultipliers([])
  }

  const getTotalMultiplier = () => {
    return multipliers.reduce((acc, mult) => acc * mult.value, 1)
  }

  return {
    multipliers,
    addMultiplier,
    removeMultiplier,
    updateMultiplierTime,
    clearMultipliers,
    getTotalMultiplier
  }
}

export default MultiplierVisualization 