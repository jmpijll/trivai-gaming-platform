'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function PlaySection() {
  return (
    <section id="play" className="py-20 relative overflow-hidden">
      <Container>
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-purple/20 via-primary-blue/20 to-primary-green/20" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary-blue/30 to-transparent rounded-full blur-3xl opacity-100" />

        <div className="relative z-10">
          <div className="opacity-100">
            <Card variant="hero" className="text-center max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6 opacity-100">
                Ready to Play?
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto opacity-100">
                Experience the future of AI-powered trivia gaming. Create or join a lobby 
                and compete with players from around the world in real-time.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 opacity-100">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 hover:scale-105 transition-transform duration-200"
                >
                  🚀 Start New Game
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="text-lg px-8 py-4 hover:scale-105 transition-transform duration-200"
                >
                  🎮 Join Game
                </Button>
              </div>

              <div className="text-sm text-gray-500 opacity-100">
                <p className="mb-2">
                  🔗 Game lobby system coming in Phase 3
                </p>
                <p>
                  Currently in Phase 3: Core Game Infrastructure Complete ✅
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
} 