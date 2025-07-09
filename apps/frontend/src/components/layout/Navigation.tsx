'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: '#home', label: 'Home' },
  { href: '#mission', label: 'Mission' },
  { href: '#features', label: 'Features' },
  { href: '#developer', label: 'Developer' },
  { href: '#play', label: 'Play Now' }
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'glass backdrop-blur-20 border-b border-white/10'
          : 'bg-transparent'
      )}
    >
      <Container>
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl lg:text-3xl font-bold text-gradient">
              TrivAI
            </div>
            <div className="hidden sm:block text-sm text-gray-400">
              AI Gaming Platform
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleSmoothScroll(item.href)}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button onClick={() => handleSmoothScroll('#play')}>
              Start Playing
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden glass-button p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-around">
              <span
                className={cn(
                  'block h-0.5 w-6 bg-white transition-all duration-300',
                  isMobileMenuOpen && 'rotate-45 translate-y-2.5'
                )}
              />
              <span
                className={cn(
                  'block h-0.5 w-6 bg-white transition-all duration-300',
                  isMobileMenuOpen && 'opacity-0'
                )}
              />
              <span
                className={cn(
                  'block h-0.5 w-6 bg-white transition-all duration-300',
                  isMobileMenuOpen && '-rotate-45 -translate-y-2.5'
                )}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden glass rounded-2xl mt-4 p-6 mb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleSmoothScroll(item.href)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-left"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 border-t border-white/10">
                <Button 
                  className="w-full"
                  onClick={() => handleSmoothScroll('#play')}
                >
                  Start Playing
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
} 