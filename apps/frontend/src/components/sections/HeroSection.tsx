'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered',
    description: 'Questions generated by advanced Large Language Models'
  },
  {
    icon: '👥',
    title: 'Multiplayer',
    description: 'Compete with 2-4 players in real-time trivia battles'
  },
  {
    icon: '🏆',
    title: 'Competitive',
    description: 'Progressive scoring with bonus rounds and multipliers'
  }
];

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-purple/20 via-primary-blue/20 to-primary-green/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(139,92,246,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(59,130,246,0.3),transparent_50%)]" />

      <Container className="relative z-10">
        <Card 
          variant="hero"
          className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'
          }`}
        >
          {/* Main Title */}
          <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-bold text-gradient">
            TrivAI
          </h1>
          
          {/* Subtitle */}
          <p className="mb-8 text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Experience the future of gaming with AI-powered multiplayer trivia
          </p>

          {/* Feature Cards */}
          <div className="mb-12 grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="feature"
                className="opacity-100 translate-y-0 transition-all duration-700 hover:scale-105"
              >
                <div className="mb-3 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center opacity-100 translate-y-0">
            <Button size="lg" className="text-lg">
              Start Playing
            </Button>
            <Button size="lg" variant="ghost" className="text-lg">
              Join Game
            </Button>
          </div>

          {/* Developer Attribution */}
          <div className="mt-12 text-sm text-gray-500 opacity-100">
            <p>
              Built by{' '}
              <span className="text-primary-blue font-medium">Jamie Matthew van der Pijll</span>
            </p>
            <p className="mt-2">
              Open source • AI-driven • Gaming platform
            </p>
          </div>
        </Card>
      </Container>
    </section>
  );
} 