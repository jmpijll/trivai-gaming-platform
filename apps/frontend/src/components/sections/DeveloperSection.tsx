'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const skills = [
  'TypeScript', 'React', 'Next.js', 'Node.js', 'AI/ML', 'WebSocket',
  'Docker', 'PostgreSQL', 'Redis', 'AWS', 'Tailwind CSS', 'Git'
];

const achievements = [
  {
    title: 'Full-Stack Developer',
    description: 'Expert in modern web technologies and AI integration'
  },
  {
    title: 'Open Source Advocate',
    description: 'Committed to building transparent, community-driven software'
  },
  {
    title: 'Gaming Enthusiast',
    description: 'Passionate about creating engaging multiplayer experiences'
  }
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
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

const skillVariants = {
  hidden: { opacity: 1, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export function DeveloperSection() {
  return (
    <section id="developer" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-l from-primary-blue/10 via-transparent to-primary-orange/10" />
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary-purple/10 to-transparent rounded-full blur-3xl"
        initial={{ scale: 0.9, opacity: 1 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      <Container size="xl">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gradient mb-6">
            Meet the Developer
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Crafted with passion by a dedicated developer who believes in the power 
            of AI to transform gaming and education.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2 items-start max-w-6xl mx-auto">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 1, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Card variant="profile" className="relative overflow-hidden">
              {/* Profile Photo Placeholder */}
              <motion.div 
                className="w-32 h-32 lg:w-40 lg:h-40 mx-auto lg:mx-0 mb-6 rounded-full bg-gradient-to-br from-primary-purple to-primary-blue flex items-center justify-center text-4xl lg:text-5xl font-bold text-white"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                JvdP
              </motion.div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white">
                    Jamie Matthew van der Pijll
                  </h3>
                  <p className="text-lg text-primary-blue font-medium">
                    Lead Developer & CEO
                  </p>
                </div>
                
                <p className="text-gray-300">
                  A passionate full-stack developer with expertise in AI integration, 
                  real-time applications, and modern web technologies. Dedicated to 
                  creating innovative gaming experiences that bring people together.
                </p>

                <motion.div 
                  className="flex flex-wrap gap-3 pt-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {['GitHub', 'LinkedIn', 'Portfolio'].map((platform, index) => (
                    <motion.div key={platform} variants={itemVariants}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        {platform}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Skills & Achievements */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 1, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {/* Achievements */}
            <Card variant="default">
              <h4 className="text-xl font-bold text-white mb-6">Key Achievements</h4>
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {achievements.map((achievement, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start space-x-3"
                    variants={itemVariants}
                  >
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-primary-blue mt-2 flex-shrink-0"
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                    />
                    <div>
                      <h5 className="font-semibold text-white">{achievement.title}</h5>
                      <p className="text-sm text-gray-400">{achievement.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </Card>

            {/* Skills */}
            <Card variant="default">
              <h4 className="text-xl font-bold text-white mb-6">Technical Expertise</h4>
              <motion.div 
                className="flex flex-wrap gap-2"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {skills.map((skill, index) => (
                  <motion.span
                    key={skill}
                    className="px-3 py-1 text-sm rounded-full glass border border-white/20 text-gray-300 hover:bg-white/10 transition-colors duration-200"
                    variants={skillVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </motion.div>
            </Card>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            >
              <Card variant="default">
                <h4 className="text-xl font-bold text-white mb-4">Vision Statement</h4>
                <motion.p 
                  className="text-gray-300 italic"
                  initial={{ opacity: 1 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  "To democratize AI gaming by creating open-source platforms that inspire 
                  learning, foster creativity, and bring communities together through the 
                  power of interactive entertainment."
                </motion.p>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
} 