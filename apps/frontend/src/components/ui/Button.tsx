import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  loading?: boolean;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  loading = false,
  disabled,
  ...props 
}: ButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-primary-purple to-primary-blue text-white',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white',
    success: 'bg-gradient-to-r from-primary-green to-emerald-600 text-white',
    danger: 'bg-gradient-to-r from-primary-red to-red-600 text-white',
    warning: 'bg-gradient-to-r from-primary-orange to-orange-600 text-white',
    ghost: 'bg-transparent border-2 border-white/20 text-white hover:bg-white/10'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  return (
    <button
      className={cn(
        'glass-button font-medium transition-all duration-200 focus-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'hover:scale-105 active:scale-95',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
} 