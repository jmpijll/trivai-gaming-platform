import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'

// Enhanced Loading Spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const variantClasses = {
    primary: 'border-purple-500 border-t-transparent',
    secondary: 'border-neutral-500 border-t-transparent',
    success: 'border-green-500 border-t-transparent',
    warning: 'border-yellow-500 border-t-transparent',
    error: 'border-red-500 border-t-transparent'
  }

  return (
    <motion.div
      className={`${sizeClasses[size]} border-2 rounded-full ${variantClasses[variant]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  )
}

// Gaming-style loading spinner with particles
export const GameLoadingSpinner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Main spinner */}
      <motion.div
        className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Inner spinner */}
      <motion.div
        className="absolute w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Orbiting particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
          style={{
            x: 24 * Math.cos((i * Math.PI * 2) / 8),
            y: 24 * Math.sin((i * Math.PI * 2) / 8)
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 },
            opacity: { duration: 1, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }
          }}
        />
      ))}
    </div>
  )
}

// Progress bar with animations
interface ProgressBarProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  variant = 'primary',
  showLabel = true,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-500 to-blue-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    error: 'bg-gradient-to-r from-red-500 to-red-600'
  }

  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full bg-neutral-800 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className={`h-full ${variantClasses[variant]} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{
              x: ['-100%', '100%']
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </motion.div>
      </div>
      {showLabel && (
        <div className="mt-2 text-sm text-neutral-400 text-center">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

// Skeleton loader for content
interface SkeletonProps {
  width?: string
  height?: string
  variant?: 'text' | 'rectangular' | 'circular'
  className?: string
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  variant = 'rectangular',
  className = ''
}) => {
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  }

  return (
    <motion.div
      className={`bg-neutral-800 ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  )
}

// Full screen loading overlay
interface LoadingOverlayProps {
  isVisible: boolean
  title?: string
  message?: string
  progress?: number
  variant?: 'default' | 'game' | 'minimal'
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  title = 'Loading...',
  message = 'Please wait while we prepare your game',
  progress,
  variant = 'default'
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
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
              {/* Loading spinner */}
              <div className="mb-6">
                {variant === 'game' ? (
                  <GameLoadingSpinner />
                ) : (
                  <LoadingSpinner size="xl" />
                )}
              </div>

              {/* Title */}
              <motion.h2
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {title}
              </motion.h2>

              {/* Message */}
              <motion.p
                className="text-neutral-400 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {message}
              </motion.p>

              {/* Progress bar */}
              {progress !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ProgressBar progress={progress} />
                </motion.div>
              )}

              {/* Animated dots */}
              <motion.div
                className="flex justify-center space-x-2 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
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
              </motion.div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode
  isVisible: boolean
  direction?: 'left' | 'right' | 'up' | 'down'
  className?: string
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isVisible,
  direction = 'right',
  className = ''
}) => {
  const directionVariants = {
    left: { x: -100, opacity: 0 },
    right: { x: 100, opacity: 0 },
    up: { y: -100, opacity: 0 },
    down: { y: 100, opacity: 0 }
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={className}
          initial={directionVariants[direction]}
          animate={{ x: 0, y: 0, opacity: 1 }}
          exit={directionVariants[direction]}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Card skeleton for loading states
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`glass-card p-6 space-y-4 ${className}`}>
      <Skeleton width="60%" height="24px" />
      <Skeleton width="100%" height="16px" />
      <Skeleton width="80%" height="16px" />
      <div className="flex space-x-4">
        <Skeleton width="100px" height="32px" />
        <Skeleton width="100px" height="32px" />
      </div>
    </div>
  )
}

// Connection status indicator
interface ConnectionStatusProps {
  isConnected: boolean
  className?: string
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  className = ''
}) => {
  return (
    <motion.div
      className={`flex items-center space-x-2 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`w-3 h-3 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}
        animate={isConnected ? {} : { scale: [1, 1.2, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <span className="text-sm text-neutral-400">
        {isConnected ? 'Connected' : 'Connecting...'}
      </span>
    </motion.div>
  )
}

export default LoadingSpinner 