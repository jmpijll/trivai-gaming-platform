'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function GameShowcase() {
  const gameFeatures = [
    {
      icon: '🧠',
      title: 'AI-Generated Questions',
      description: 'Every question is dynamically created by advanced LLMs, ensuring fresh content and varied difficulty levels.',
      highlight: 'Infinite Content'
    },
    {
      icon: '⚡',
      title: 'Real-Time Competition',
      description: 'Experience lightning-fast multiplayer action with WebSocket technology for instant responses and live leaderboards.',
      highlight: 'Sub-second Latency'
    },
    {
      icon: '🎯',
      title: 'Progressive Scoring',
      description: 'Strategic scoring system with multipliers, bonus rounds, and streak rewards that keep every match competitive.',
      highlight: 'Skill-Based Rewards'
    },
    {
      icon: '🏆',
      title: 'Competitive Rankings',
      description: 'Climb the global leaderboards with our sophisticated ELO-based ranking system and seasonal tournaments.',
      highlight: 'Global Competition'
    }
  ];

  const gameplaySteps = [
    {
      step: '01',
      title: 'Create or Join Lobby',
      description: 'Start a new game or join friends in a lobby with customizable settings and difficulty levels.'
    },
    {
      step: '02',
      title: 'AI Question Generation',
      description: 'Our AI creates unique questions based on selected categories and player skill levels.'
    },
    {
      step: '03',
      title: 'Real-Time Competition',
      description: 'Answer questions against time with live scoring and immediate feedback for all players.'
    },
    {
      step: '04',
      title: 'Victory & Rankings',
      description: 'Celebrate wins, analyze performance, and climb the competitive rankings.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const statsVariants = {
    hidden: { scale: 0.9, opacity: 1 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section id="features" className="py-20 relative overflow-hidden">
      <Container size="xl">
        {/* Background Effects */}
        <div className="absolute inset-0 game-bg opacity-30"></div>
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-primary-blue/20 to-transparent rounded-full blur-3xl"
          initial={{ scale: 0.9, opacity: 1 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-primary-purple/20 to-transparent rounded-full blur-3xl"
          initial={{ scale: 0.9, opacity: 1 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        />

        <div className="relative z-10">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6">
              Game Experience
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the revolutionary gaming experience that combines cutting-edge AI technology 
              with competitive multiplayer trivia for endless entertainment.
            </p>
          </motion.div>

          {/* Game Features Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {gameFeatures.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card variant="feature" className="relative group h-full hover:scale-105 transition-transform duration-300">
                  <motion.div 
                    className="text-4xl mb-4"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="absolute bottom-4 left-6 right-6">
                    <motion.span 
                      className="inline-block px-3 py-1 bg-gradient-to-r from-primary-blue to-primary-purple text-white text-xs font-medium rounded-full"
                      initial={{ opacity: 1, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                    >
                      {feature.highlight}
                    </motion.span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Gameplay Flow */}
          <motion.div 
            className="mb-20"
            initial={{ opacity: 1 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <motion.h3 
              className="text-3xl md:text-4xl font-bold text-center text-white mb-12"
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              How It Works
            </motion.h3>
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              {gameplaySteps.map((step, index) => (
                <motion.div key={index} className="relative" variants={itemVariants}>
                  <div className="text-center">
                    <motion.div 
                      className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-blue to-primary-purple flex items-center justify-center text-white font-bold text-lg"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.step}
                    </motion.div>
                    <h4 className="text-xl font-semibold text-white mb-3">
                      {step.title}
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < gameplaySteps.length - 1 && (
                    <motion.div 
                      className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary-blue to-primary-purple"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: index * 0.2 + 0.5 }}
                    />
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Game Demo Preview */}
          <motion.div
                          initial={{ opacity: 1, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card variant="game" className="p-8 mb-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Experience TrivAI?
                </h3>
                <p className="text-gray-300 text-lg">
                  Join thousands of players in the most advanced trivia gaming platform
                </p>
              </div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
                initial={{ opacity: 1 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Playing Now
                </Button>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Watch Demo
                </Button>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[
                  { value: "1000+", label: "Active Players" },
                  { value: "50k+", label: "Questions Generated" },
                  { value: "24/7", label: "Live Matches" }
                ].map((stat, index) => (
                  <motion.div key={index} variants={statsVariants}>
                    <div className="text-2xl font-bold text-primary-blue mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </Container>
    </section>
  );
} 