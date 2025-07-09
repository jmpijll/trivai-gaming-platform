# TrivAI Gaming Platform - UI/UX Guidelines

## 🎨 Design Philosophy

### Vision Statement
Create an immersive, accessible, and engaging AI gaming platform that combines the elegance of glassmorphism with the excitement of boardgaming aesthetics. The design should feel modern, inclusive, and fun while maintaining professional polish.

### Core Principles
- **Clarity First:** Information hierarchy is always clear and intuitive
- **Accessibility:** Inclusive design for all users and abilities
- **Playfulness:** Fun, engaging elements that enhance the gaming experience
- **Consistency:** Unified design language across all components
- **Performance:** Smooth animations and fast interactions

## 🌈 Color Palette

### Primary Colors
```css
/* Gaming Theme - Boardgame Inspired */
:root {
  /* Primary Brand Colors */
  --primary-purple: #8B5CF6;      /* Main brand color */
  --primary-blue: #3B82F6;        /* Secondary brand */
  --primary-green: #10B981;       /* Success/positive */
  --primary-orange: #F59E0B;      /* Warning/energy */
  --primary-red: #EF4444;         /* Error/danger */
  
  /* Glassmorphism Base */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: rgba(0, 0, 0, 0.1);
  
  /* Gaming Accents */
  --accent-gold: #F59E0B;         /* Achievement/winner */
  --accent-silver: #94A3B8;       /* Second place */
  --accent-bronze: #A16207;       /* Third place */
  --accent-neon: #00F5FF;         /* Highlights */
  
  /* Semantic Colors */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* Neutral Scale */
  --neutral-50: #F8FAFC;
  --neutral-100: #F1F5F9;
  --neutral-200: #E2E8F0;
  --neutral-300: #CBD5E1;
  --neutral-400: #94A3B8;
  --neutral-500: #64748B;
  --neutral-600: #475569;
  --neutral-700: #334155;
  --neutral-800: #1E293B;
  --neutral-900: #0F172A;
}
```

### Dark Mode Colors
```css
/* Dark Mode Variants */
.dark {
  --glass-bg: rgba(0, 0, 0, 0.3);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-shadow: rgba(0, 0, 0, 0.3);
  
  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;
  
  --bg-primary: #0F172A;
  --bg-secondary: #1E293B;
  --bg-tertiary: #334155;
}
```

## 🔮 Glassmorphism System

### Glass Components
```css
/* Base Glass Effect */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: 0 8px 32px var(--glass-shadow);
  transition: all 0.3s ease;
}

/* Interactive Glass */
.glass-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 48px var(--glass-shadow);
  transform: translateY(-2px);
}

/* Glass Button */
.glass-button {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  transition: all 0.2s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}
```

### Glass Variations
- **Primary Glass:** Main content cards and panels
- **Secondary Glass:** Supporting elements and sidebars
- **Interactive Glass:** Buttons, form inputs, clickable elements
- **Overlay Glass:** Modals, tooltips, dropdowns
- **Gradient Glass:** Special effects and highlights

## 🎯 Typography System

### Font Stack
```css
/* Primary Font - Modern Sans-serif */
--font-primary: 'Inter', 'Segoe UI', 'Roboto', sans-serif;

/* Secondary Font - Gaming Headers */
--font-secondary: 'Poppins', 'Inter', sans-serif;

/* Monospace - Code/Technical */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale
```css
/* Typography Scale */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */
--text-5xl: 3rem;       /* 48px */
--text-6xl: 3.75rem;    /* 60px */
```

### Text Styles
```css
/* Heading Styles */
.h1 {
  font-size: var(--text-5xl);
  font-weight: 700;
  line-height: 1.1;
  color: var(--text-primary);
}

.h2 {
  font-size: var(--text-4xl);
  font-weight: 600;
  line-height: 1.2;
  color: var(--text-primary);
}

/* Body Text */
.body-large {
  font-size: var(--text-lg);
  line-height: 1.6;
  color: var(--text-secondary);
}

.body-base {
  font-size: var(--text-base);
  line-height: 1.5;
  color: var(--text-secondary);
}

/* Gaming Text Effects */
.text-glow {
  text-shadow: 0 0 10px currentColor;
}

.text-neon {
  color: var(--accent-neon);
  text-shadow: 0 0 10px var(--accent-neon);
}
```

## 🏗️ Layout System

### Grid System
```css
/* 12-column responsive grid */
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0 0.5rem;
  }
}
```

### Spacing System
```css
/* Spacing Scale */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

## 🎮 Gaming UI Components

### Score Display
```css
.score-display {
  background: linear-gradient(135deg, var(--accent-gold), var(--primary-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: var(--text-3xl);
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

### Game Board Elements
```css
.game-card {
  background: var(--glass-bg);
  border: 2px solid var(--glass-border);
  border-radius: 16px;
  padding: var(--space-6);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.game-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  transition: transform 0.5s ease;
}

.game-card:hover::before {
  transform: rotate(45deg) translateX(100%);
}
```

### Progress Indicators
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--neutral-700);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-blue), var(--primary-purple));
  border-radius: 4px;
  transition: width 0.3s ease;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

## 🎪 Animation System

### Micro-interactions
```css
/* Hover Effects */
.interactive {
  transition: all 0.2s ease;
}

.interactive:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* Button Press Effect */
.interactive:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
```

### Page Transitions
```css
/* Fade In Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

/* Slide In Animation */
@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.slide-in {
  animation: slideIn 0.5s ease-out;
}
```

### Game-specific Animations
```css
/* Question Reveal */
@keyframes questionReveal {
  0% { opacity: 0; transform: scale(0.8) rotateY(90deg); }
  100% { opacity: 1; transform: scale(1) rotateY(0deg); }
}

.question-reveal {
  animation: questionReveal 0.8s ease-out;
}

/* Score Counter */
@keyframes scoreCount {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.score-increment {
  animation: scoreCount 0.5s ease-out;
}

/* Wheel Spin */
@keyframes wheelSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(1800deg); }
}

.wheel-spin {
  animation: wheelSpin 3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
/* Base: 320px+ (Mobile) */
@media (min-width: 480px) { /* Large Mobile */ }
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large Desktop */ }
```

### Mobile Adaptations
- **Touch-friendly buttons:** Minimum 44px tap targets
- **Simplified navigation:** Collapsible menus and drawers
- **Readable text:** Minimum 16px font size
- **Optimized layouts:** Single-column on mobile
- **Gesture support:** Swipe navigation where appropriate

### Tablet Considerations
- **Landscape mode:** Optimized for horizontal gaming
- **Touch precision:** Larger interactive areas
- **Multi-column layouts:** Efficient use of screen space
- **Split-screen friendly:** Flexible layout system

## ♿ Accessibility Guidelines

### Color Accessibility
- **Contrast ratios:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Color blindness:** No information conveyed by color alone
- **Focus indicators:** Clear, high-contrast focus rings
- **Dark mode:** Full support with proper contrast

### Keyboard Navigation
- **Tab order:** Logical navigation flow
- **Focus management:** Clear focus indicators
- **Keyboard shortcuts:** Common game controls
- **Screen reader support:** Proper ARIA labels

### Motion & Animation
- **Reduced motion:** Respect user preferences
- **Vestibular safety:** Avoid intense motion effects
- **Animation controls:** Ability to disable animations
- **Performance:** Smooth 60fps animations

## 🎨 Component Library

### Button Variants
```css
/* Primary Button */
.btn-primary {
  background: linear-gradient(135deg, var(--primary-purple), var(--primary-blue));
  color: white;
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

/* Secondary Button */
.btn-secondary {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}

/* Danger Button */
.btn-danger {
  background: linear-gradient(135deg, var(--error), #DC2626);
  color: white;
  border: none;
  padding: var(--space-3) var(--space-6);
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
}
```

### Form Controls
```css
/* Input Fields */
.input-field {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: var(--space-3) var(--space-4);
  color: var(--text-primary);
  font-size: var(--text-base);
  transition: all 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Select Dropdown */
.select-field {
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: var(--space-3) var(--space-4);
  color: var(--text-primary);
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg>');
  background-repeat: no-repeat;
  background-position: right var(--space-3) center;
  background-size: 20px;
}
```

### Card Components
```css
/* Info Card */
.info-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: var(--space-6);
  position: relative;
  overflow: hidden;
}

/* Player Card */
.player-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  transition: all 0.3s ease;
}

.player-card:hover {
  border-color: var(--primary-blue);
  transform: translateY(-2px);
}

/* Game Card */
.game-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: var(--space-6);
  position: relative;
  overflow: hidden;
}

.game-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-purple), var(--primary-blue), var(--primary-green));
}
```

## 🎵 Sound Design Guidelines

### Audio Feedback
- **UI Sounds:** Subtle, non-intrusive click sounds
- **Game Sounds:** Engaging feedback for correct/incorrect answers
- **Ambient Audio:** Optional background gaming atmosphere
- **Volume Control:** User-adjustable audio levels
- **Accessibility:** Visual alternatives for audio cues

### Sound Categories
- **Success:** Uplifting chimes for correct answers
- **Failure:** Gentle error sounds for incorrect answers
- **Notification:** Attention-grabbing for important events
- **Ambient:** Subtle background enhancement
- **Celebration:** Exciting sounds for achievements

## 🎪 Special Effects

### Particle Systems
```css
/* Confetti Effect */
.confetti {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.confetti-piece {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--primary-blue);
  animation: confetti-fall 3s linear infinite;
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}
```

### Hover Effects
```css
/* Glow Effect */
.glow-effect {
  position: relative;
  overflow: hidden;
}

.glow-effect::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.glow-effect:hover::after {
  left: 100%;
}
```

## 📊 Performance Guidelines

### CSS Optimization
- **Critical CSS:** Inline above-the-fold styles
- **Lazy Loading:** Non-critical animations and effects
- **GPU Acceleration:** Use `transform` and `opacity` for animations
- **Minimize Reflows:** Avoid layout-triggering properties
- **Efficient Selectors:** Avoid complex CSS selectors

### Animation Performance
- **60fps Target:** Smooth animation performance
- **Hardware Acceleration:** Use `will-change` property judiciously
- **Reduced Motion:** Respect user preferences
- **Debounce Events:** Limit animation triggers
- **Cleanup:** Remove unused animations

## 🎯 User Experience Patterns

### Navigation Flow
1. **Landing Page** → Game Selection
2. **Nickname Entry** → Lobby Selection
3. **Lobby** → Game Start
4. **Game Play** → Score Display
5. **Results** → Return to Lobby or New Game

### Feedback Patterns
- **Loading States:** Clear progress indicators
- **Success States:** Positive reinforcement
- **Error States:** Helpful error messages
- **Empty States:** Engaging placeholder content
- **Confirmation:** Clear action confirmations

### Accessibility Patterns
- **Focus Management:** Proper tab order
- **Screen Reader Support:** Descriptive labels
- **High Contrast:** Alternative color schemes
- **Keyboard Navigation:** Full keyboard support
- **Error Handling:** Clear error communication

---

**Last Updated:** [Current Date]  
**Version:** 1.0  
**Status:** Planning Phase 