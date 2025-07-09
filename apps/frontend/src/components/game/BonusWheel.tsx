import React, { useState, useEffect, useCallback } from 'react'
import { motion, useAnimationControls, useSpring, useTransform } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface BonusReward {
  id: string
  type: 'points' | 'multiplier' | 'streak' | 'double' | 'skip'
  value: number
  label: string
  color: string
  icon: string
}

interface BonusWheelProps {
  onRewardWon: (reward: BonusReward) => void
  disabled?: boolean
  spinsRemaining?: number
  className?: string
}

const bonusSegments: BonusReward[] = [
  { id: 'points-100', type: 'points', value: 100, label: '+100 Points', color: '#3b82f6', icon: '💰' },
  { id: 'multiplier-2x', type: 'multiplier', value: 2, label: '2x Multiplier', color: '#f59e0b', icon: '⚡' },
  { id: 'points-250', type: 'points', value: 250, label: '+250 Points', color: '#10b981', icon: '💎' },
  { id: 'streak-5', type: 'streak', value: 5, label: '+5 Streak', color: '#ef4444', icon: '🔥' },
  { id: 'points-500', type: 'points', value: 500, label: '+500 Points', color: '#8b5cf6', icon: '🎯' },
  { id: 'double-next', type: 'double', value: 1, label: 'Double Next', color: '#f97316', icon: '🎪' },
  { id: 'points-50', type: 'points', value: 50, label: '+50 Points', color: '#06b6d4', icon: '🎁' },
  { id: 'skip-question', type: 'skip', value: 1, label: 'Skip Question', color: '#84cc16', icon: '⏭️' }
]

export const BonusWheel: React.FC<BonusWheelProps> = ({
  onRewardWon,
  disabled = false,
  spinsRemaining = 1,
  className = ''
}) => {
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentRotation, setCurrentRotation] = useState(0)
  const [winningSegment, setWinningSegment] = useState<BonusReward | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  
  const wheelControls = useAnimationControls()
  const celebrationControls = useAnimationControls()
  const pointerControls = useAnimationControls()
  
  // Spring animation for smooth rotation
  const springRotation = useSpring(currentRotation, {
    stiffness: 50,
    damping: 20,
    mass: 1
  })
  
  // Transform for wheel rotation
  const wheelRotation = useTransform(springRotation, (value) => `rotate(${value}deg)`)
  
  const segmentAngle = 360 / bonusSegments.length
  
  const spinWheel = useCallback(async () => {
    if (isSpinning || disabled || spinsRemaining <= 0) return
    
    setIsSpinning(true)
    setWinningSegment(null)
    setShowCelebration(false)
    
    // Animate pointer wobble
    pointerControls.start({
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { duration: 0.5, ease: "easeInOut" }
    })
    
    // Calculate winning segment (random but can be influenced by game logic)
    const winningIndex = Math.floor(Math.random() * bonusSegments.length)
    const winningReward = bonusSegments[winningIndex]
    
    // Calculate target rotation
    const baseRotation = currentRotation
    const spins = 3 + Math.random() * 2 // 3-5 full rotations
    const targetAngle = (winningIndex * segmentAngle) + (segmentAngle / 2)
    const finalRotation = baseRotation + (spins * 360) + (360 - targetAngle)
    
    // Start wheel spinning animation
    await wheelControls.start({
      rotate: finalRotation,
      transition: {
        duration: 3,
        ease: "easeOut",
        times: [0, 0.2, 0.8, 1],
        type: "keyframes"
      }
    })
    
    // Update state after spin
    setCurrentRotation(finalRotation % 360)
    setWinningSegment(winningReward)
    setIsSpinning(false)
    setShowCelebration(true)
    
    // Trigger celebration animation
    celebrationControls.start({
      scale: [1, 1.2, 1],
      opacity: [0, 1, 1, 0],
      transition: { duration: 2, ease: "easeInOut" }
    })
    
    // Pointer celebration
    pointerControls.start({
      scale: [1, 1.3, 1],
      rotate: [0, 15, -15, 0],
      transition: { duration: 1, ease: "easeInOut" }
    })
    
    // Call reward callback
    onRewardWon(winningReward)
  }, [isSpinning, disabled, spinsRemaining, currentRotation, wheelControls, celebrationControls, pointerControls, onRewardWon])
  
  // Render wheel segments
  const renderSegments = () => {
    return bonusSegments.map((segment, index) => {
      const angle = index * segmentAngle
      const isWinning = winningSegment?.id === segment.id
      
      return (
        <motion.div
          key={segment.id}
          className="absolute w-full h-full"
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: 'center'
          }}
          animate={isWinning ? {
            scale: [1, 1.1, 1],
            filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
          } : {}}
          transition={{ duration: 0.5, delay: showCelebration ? 0.5 : 0 }}
        >
          <div
            className="absolute top-0 left-1/2 w-0 h-0 transform -translate-x-1/2 origin-bottom"
            style={{
              borderLeft: `80px solid transparent`,
              borderRight: `80px solid transparent`,
              borderBottom: `80px solid ${segment.color}`,
              filter: isWinning ? 'brightness(1.2) saturate(1.3)' : 'brightness(1)'
            }}
          />
          
          {/* Segment content */}
          <div
            className="absolute top-6 left-1/2 transform -translate-x-1/2 text-center"
            style={{
              transform: `rotate(${90 - segmentAngle/2}deg)`,
              transformOrigin: 'center'
            }}
          >
            <div className="text-2xl mb-1">{segment.icon}</div>
            <div className="text-xs font-bold text-white leading-tight">
              {segment.label}
            </div>
          </div>
        </motion.div>
      )
    })
  }
  
  return (
    <Card className={`glass-card p-8 relative overflow-hidden ${className}`}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent" />
      
      {/* Header */}
      <div className="text-center mb-8">
        <motion.h2 
          className="text-2xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          🎰 Bonus Wheel
        </motion.h2>
        <motion.p 
          className="text-neutral-400 text-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Spin for bonus rewards! {spinsRemaining > 0 && `${spinsRemaining} spins remaining`}
        </motion.p>
      </div>
      
      {/* Wheel Container */}
      <div className="relative flex flex-col items-center space-y-6">
        {/* Wheel */}
        <motion.div 
          className="relative w-80 h-80"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-yellow-400 to-orange-500 bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-2xl">
            {/* Inner wheel */}
            <motion.div
              className="absolute inset-2 rounded-full overflow-hidden"
              style={{ rotate: wheelRotation }}
              animate={wheelControls}
            >
              {renderSegments()}
            </motion.div>
            
            {/* Center hub */}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-4 border-white flex items-center justify-center">
              <div className="text-2xl">⭐</div>
            </div>
          </div>
          
          {/* Pointer */}
          <motion.div
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
            animate={pointerControls}
          >
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400 filter drop-shadow-lg" />
            <div className="w-2 h-2 bg-yellow-400 rounded-full mx-auto transform -translate-y-1" />
          </motion.div>
        </motion.div>
        
        {/* Spin Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={spinWheel}
            disabled={isSpinning || disabled || spinsRemaining <= 0}
            className={`
              px-8 py-3 text-lg font-bold
              ${isSpinning 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700'
              }
              transform transition-all duration-200
              ${!isSpinning && !disabled && spinsRemaining > 0 ? 'hover:scale-105' : ''}
            `}
          >
            {isSpinning ? (
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Spinning...</span>
              </div>
            ) : spinsRemaining <= 0 ? (
              'No Spins Left'
            ) : (
              'SPIN THE WHEEL!'
            )}
          </Button>
        </motion.div>
      </div>
      
      {/* Winning Reward Display */}
      {winningSegment && (
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
            <div className="flex items-center justify-center space-x-3">
              <div className="text-3xl">{winningSegment.icon}</div>
              <div>
                <div className="text-lg font-bold text-white">{winningSegment.label}</div>
                <div className="text-sm text-neutral-400">Reward added to your game!</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Celebration Particles */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full"
              style={{
                left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 30}%`,
                top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 30}%`,
              }}
              animate={celebrationControls}
              initial={{ scale: 0, opacity: 0 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}
        </div>
      )}
      
      {/* Glow effect during spin */}
      {isSpinning && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          style={{
            background: 'radial-gradient(circle at center, rgba(255,215,0,0.1) 0%, transparent 70%)',
            filter: 'blur(10px)'
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </Card>
  )
}

export default BonusWheel 