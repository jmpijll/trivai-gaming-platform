import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div 
      className={cn(
        'inline-flex items-center justify-center',
        className
      )}
    >
      <div 
        className={cn(
          'animate-spin rounded-full border-2 border-transparent',
          'border-t-purple-500 border-r-blue-500',
          sizeClasses[size]
        )}
      />
    </div>
  )
} 