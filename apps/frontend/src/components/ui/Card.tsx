import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'hero' | 'feature' | 'game' | 'profile';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ 
  children, 
  variant = 'default', 
  className, 
  onClick,
  hover = true 
}: CardProps) {
  const variants = {
    default: 'glass p-6',
    hero: 'glass p-8 lg:p-12 text-center',
    feature: 'glass p-6 text-center hover:scale-105 transition-all duration-300',
    game: 'glass p-6 hover:scale-102 hover:shadow-glass-lg transition-all duration-300',
    profile: 'glass p-8 text-center lg:text-left'
  };

  const hoverEffects = hover ? 'hover:bg-white/10 hover:border-white/20' : '';

  return (
    <div
      className={cn(
        variants[variant],
        hoverEffects,
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
} 