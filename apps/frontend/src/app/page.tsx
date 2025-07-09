import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/sections/HeroSection';
import { MissionSection } from '@/components/sections/MissionSection';
import GameShowcase from '@/components/sections/GameShowcase';
import { DeveloperSection } from '@/components/sections/DeveloperSection';
import { PlaySection } from '@/components/sections/PlaySection';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <HeroSection />
        <MissionSection />
        <GameShowcase />
        <DeveloperSection />
        <PlaySection />
      </main>
    </>
  );
} 