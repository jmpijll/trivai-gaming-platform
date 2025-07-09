'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';

const missionPoints = [
  {
    icon: '🚀',
    title: 'Innovation First',
    description: 'Pushing the boundaries of AI technology to create unprecedented gaming experiences that challenge conventional trivia formats.'
  },
  {
    icon: '♿',
    title: 'Accessibility Driven',
    description: 'Building inclusive gaming experiences that welcome players of all backgrounds, skill levels, and abilities to participate and excel.'
  },
  {
    icon: '🤝',
    title: 'Community Focused',
    description: 'Fostering a vibrant, supportive community where players connect, compete, and grow together through shared gaming experiences.'
  },
  {
    icon: '🔓',
    title: 'Open Source',
    description: 'Committed to transparency and collaboration, making our platform open for developers to contribute and innovate together.'
  }
];

export function MissionSection() {
  return (
    <section id="mission" className="py-20 relative overflow-hidden">
      <Container size="xl">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-purple/5 via-primary-blue/5 to-primary-green/5"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary-blue/10 to-transparent rounded-full blur-3xl"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-16 opacity-100">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              To revolutionize the gaming industry by creating the most advanced AI-powered trivia platform 
              that brings people together through intelligent, engaging, and accessible gaming experiences.
            </p>
          </div>

          {/* Mission Points */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-100">
            {missionPoints.map((point, index) => (
              <div key={index} className="opacity-100">
                <Card variant="feature" className="h-full group hover:scale-105 transition-transform duration-300">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {point.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {point.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {point.description}
                  </p>
                </Card>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16 opacity-100">
            <Card variant="hero" className="max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to be part of the future?
              </h3>
              <p className="text-gray-300 mb-6">
                Join us in creating the next generation of AI-powered gaming experiences
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn btn-primary">
                  Start Playing
                </button>
                <button className="btn btn-secondary">
                  Learn More
                </button>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
} 