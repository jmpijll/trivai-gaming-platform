import { PlayerSettings } from '@/../../packages/shared/src/types/player'

// Audio categories from UI guidelines
export enum SoundCategory {
  UI = 'ui',
  SUCCESS = 'success',
  FAILURE = 'failure',
  NOTIFICATION = 'notification',
  AMBIENT = 'ambient',
  CELEBRATION = 'celebration',
  GAME_ACTION = 'game_action',
  TIMER = 'timer'
}

// Sound effect definitions
export interface SoundEffect {
  id: string
  category: SoundCategory
  volume: number
  loop?: boolean
  fadeIn?: number
  fadeOut?: number
  pitch?: number
}

// Audio service configuration
interface AudioServiceConfig {
  soundEnabled: boolean
  volume: number
  enabledCategories: Set<SoundCategory>
  audioContext?: AudioContext
}

class AudioService {
  private config: AudioServiceConfig = {
    soundEnabled: true,
    volume: 0.7,
    enabledCategories: new Set(Object.values(SoundCategory)),
    audioContext: undefined
  }

  private audioBuffers: Map<string, AudioBuffer> = new Map()
  private activeSources: Map<string, AudioBufferSourceNode> = new Map()
  private gainNodes: Map<SoundCategory, GainNode> = new Map()
  private masterGainNode: GainNode | null = null
  private isInitialized = false

  // Sound effect library
  private soundLibrary: Record<string, SoundEffect> = {
    // UI Sounds
    click: { id: 'click', category: SoundCategory.UI, volume: 0.3 },
    hover: { id: 'hover', category: SoundCategory.UI, volume: 0.2 },
    button_press: { id: 'button_press', category: SoundCategory.UI, volume: 0.4 },
    navigation: { id: 'navigation', category: SoundCategory.UI, volume: 0.3 },
    
    // Success Sounds
    correct_answer: { id: 'correct_answer', category: SoundCategory.SUCCESS, volume: 0.6 },
    round_complete: { id: 'round_complete', category: SoundCategory.SUCCESS, volume: 0.7 },
    achievement: { id: 'achievement', category: SoundCategory.SUCCESS, volume: 0.8 },
    bonus_earned: { id: 'bonus_earned', category: SoundCategory.SUCCESS, volume: 0.7 },
    multiplier_gained: { id: 'multiplier_gained', category: SoundCategory.SUCCESS, volume: 0.6 },
    
    // Failure Sounds
    wrong_answer: { id: 'wrong_answer', category: SoundCategory.FAILURE, volume: 0.5 },
    time_up: { id: 'time_up', category: SoundCategory.FAILURE, volume: 0.6 },
    error: { id: 'error', category: SoundCategory.FAILURE, volume: 0.4 },
    multiplier_lost: { id: 'multiplier_lost', category: SoundCategory.FAILURE, volume: 0.5 },
    
    // Notification Sounds
    new_question: { id: 'new_question', category: SoundCategory.NOTIFICATION, volume: 0.5 },
    player_joined: { id: 'player_joined', category: SoundCategory.NOTIFICATION, volume: 0.4 },
    player_left: { id: 'player_left', category: SoundCategory.NOTIFICATION, volume: 0.4 },
    game_starting: { id: 'game_starting', category: SoundCategory.NOTIFICATION, volume: 0.6 },
    round_starting: { id: 'round_starting', category: SoundCategory.NOTIFICATION, volume: 0.6 },
    final_round: { id: 'final_round', category: SoundCategory.NOTIFICATION, volume: 0.8 },
    
    // Celebration Sounds
    game_won: { id: 'game_won', category: SoundCategory.CELEBRATION, volume: 0.9 },
    perfect_round: { id: 'perfect_round', category: SoundCategory.CELEBRATION, volume: 0.8 },
    streak_milestone: { id: 'streak_milestone', category: SoundCategory.CELEBRATION, volume: 0.7 },
    bonus_wheel_spin: { id: 'bonus_wheel_spin', category: SoundCategory.CELEBRATION, volume: 0.6 },
    confetti: { id: 'confetti', category: SoundCategory.CELEBRATION, volume: 0.5 },
    
    // Game Action Sounds
    topic_selected: { id: 'topic_selected', category: SoundCategory.GAME_ACTION, volume: 0.4 },
    answer_submitted: { id: 'answer_submitted', category: SoundCategory.GAME_ACTION, volume: 0.5 },
    point_doubling_activated: { id: 'point_doubling_activated', category: SoundCategory.GAME_ACTION, volume: 0.6 },
    wheel_spinning: { id: 'wheel_spinning', category: SoundCategory.GAME_ACTION, volume: 0.5, loop: true },
    
    // Timer Sounds
    timer_tick: { id: 'timer_tick', category: SoundCategory.TIMER, volume: 0.3 },
    timer_warning: { id: 'timer_warning', category: SoundCategory.TIMER, volume: 0.6 },
    timer_critical: { id: 'timer_critical', category: SoundCategory.TIMER, volume: 0.8 },
    
    // Ambient Sounds
    lobby_ambient: { id: 'lobby_ambient', category: SoundCategory.AMBIENT, volume: 0.2, loop: true },
    game_ambient: { id: 'game_ambient', category: SoundCategory.AMBIENT, volume: 0.3, loop: true }
  }

  // Initialize audio context and load sounds
  async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') return

    try {
      // Create audio context
      this.config.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create master gain node
      this.masterGainNode = this.config.audioContext.createGain()
      this.masterGainNode.connect(this.config.audioContext.destination)
      this.masterGainNode.gain.value = this.config.volume

      // Create category gain nodes
      Object.values(SoundCategory).forEach(category => {
        const gainNode = this.config.audioContext!.createGain()
        gainNode.connect(this.masterGainNode!)
        gainNode.gain.value = 1.0
        this.gainNodes.set(category, gainNode)
      })

      // Load sound effects (placeholder - in production, load actual audio files)
      await this.loadSoundEffects()

      this.isInitialized = true
      console.log('Audio service initialized successfully')
    } catch (error) {
      console.error('Failed to initialize audio service:', error)
      this.config.soundEnabled = false
    }
  }

  // Load sound effects from files
  private async loadSoundEffects(): Promise<void> {
    // In production, you would load actual audio files
    // For now, we'll generate simple tones as placeholders
    for (const [soundId, sound] of Object.entries(this.soundLibrary)) {
      try {
        const buffer = await this.generateTone(sound)
        this.audioBuffers.set(soundId, buffer)
      } catch (error) {
        console.warn(`Failed to load sound effect: ${soundId}`, error)
      }
    }
  }

  // Generate simple tone as placeholder (replace with actual audio file loading)
  private async generateTone(sound: SoundEffect): Promise<AudioBuffer> {
    if (!this.config.audioContext) throw new Error('Audio context not initialized')

    const duration = sound.loop ? 1 : 0.3
    const sampleRate = this.config.audioContext.sampleRate
    const buffer = this.config.audioContext.createBuffer(1, duration * sampleRate, sampleRate)
    const data = buffer.getChannelData(0)

    // Generate different tones for different categories
    let frequency = 440 // Default A4
    switch (sound.category) {
      case SoundCategory.SUCCESS:
        frequency = 523.25 // C5
        break
      case SoundCategory.FAILURE:
        frequency = 349.23 // F4
        break
      case SoundCategory.NOTIFICATION:
        frequency = 659.25 // E5
        break
      case SoundCategory.CELEBRATION:
        frequency = 783.99 // G5
        break
      case SoundCategory.UI:
        frequency = 880 // A5
        break
      case SoundCategory.TIMER:
        frequency = 1046.5 // C6
        break
      case SoundCategory.AMBIENT:
        frequency = 220 // A3
        break
      case SoundCategory.GAME_ACTION:
        frequency = 493.88 // B4
        break
    }

    // Generate tone with envelope
    for (let i = 0; i < data.length; i++) {
      const time = i / sampleRate
      const envelope = Math.exp(-time * 3) // Exponential decay
      data[i] = Math.sin(2 * Math.PI * frequency * time) * envelope * sound.volume
    }

    return buffer
  }

  // Play sound effect
  async play(soundId: string, options?: { volume?: number; pitch?: number }): Promise<void> {
    if (!this.isInitialized || !this.config.soundEnabled) return

    const sound = this.soundLibrary[soundId]
    if (!sound) {
      console.warn(`Sound effect not found: ${soundId}`)
      return
    }

    if (!this.config.enabledCategories.has(sound.category)) {
      return // Category disabled
    }

    const buffer = this.audioBuffers.get(soundId)
    if (!buffer || !this.config.audioContext) {
      console.warn(`Audio buffer not loaded for: ${soundId}`)
      return
    }

    try {
      // Stop existing source if playing
      const existingSource = this.activeSources.get(soundId)
      if (existingSource) {
        existingSource.stop()
        this.activeSources.delete(soundId)
      }

      // Create new source
      const source = this.config.audioContext.createBufferSource()
      source.buffer = buffer
      source.loop = sound.loop || false

      // Apply pitch if specified
      if (options?.pitch) {
        source.playbackRate.value = options.pitch
      }

      // Connect to category gain node
      const categoryGain = this.gainNodes.get(sound.category)
      if (categoryGain) {
        source.connect(categoryGain)
      }

      // Apply volume
      const volume = options?.volume ?? sound.volume
      const gainNode = this.config.audioContext.createGain()
      gainNode.gain.value = volume
      source.connect(gainNode)
      gainNode.connect(categoryGain || this.masterGainNode!)

      // Handle source cleanup
      source.onended = () => {
        this.activeSources.delete(soundId)
      }

      // Start playing
      source.start()
      this.activeSources.set(soundId, source)
    } catch (error) {
      console.error(`Failed to play sound effect: ${soundId}`, error)
    }
  }

  // Stop sound effect
  stop(soundId: string): void {
    const source = this.activeSources.get(soundId)
    if (source) {
      source.stop()
      this.activeSources.delete(soundId)
    }
  }

  // Stop all sounds
  stopAll(): void {
    this.activeSources.forEach((source, soundId) => {
      source.stop()
    })
    this.activeSources.clear()
  }

  // Update settings
  updateSettings(settings: Partial<PlayerSettings>): void {
    if (settings.soundEnabled !== undefined) {
      this.config.soundEnabled = settings.soundEnabled
      if (!settings.soundEnabled) {
        this.stopAll()
      }
    }

    if (settings.volume !== undefined) {
      this.config.volume = Math.max(0, Math.min(1, settings.volume))
      if (this.masterGainNode) {
        this.masterGainNode.gain.value = this.config.volume
      }
    }
  }

  // Enable/disable sound category
  setCategoryEnabled(category: SoundCategory, enabled: boolean): void {
    if (enabled) {
      this.config.enabledCategories.add(category)
    } else {
      this.config.enabledCategories.delete(category)
      // Stop all sounds in this category
      this.activeSources.forEach((source, soundId) => {
        const sound = this.soundLibrary[soundId]
        if (sound && sound.category === category) {
          source.stop()
          this.activeSources.delete(soundId)
        }
      })
    }
  }

  // Get current settings
  getSettings(): AudioServiceConfig {
    return { ...this.config }
  }

  // Convenience methods for common actions
  playCorrectAnswer(): void { this.play('correct_answer') }
  playWrongAnswer(): void { this.play('wrong_answer') }
  playButtonClick(): void { this.play('click') }
  playHover(): void { this.play('hover') }
  playNewQuestion(): void { this.play('new_question') }
  playTimeWarning(): void { this.play('timer_warning') }
  playTimeCritical(): void { this.play('timer_critical') }
  playRoundComplete(): void { this.play('round_complete') }
  playGameWon(): void { this.play('game_won') }
  playBonusEarned(): void { this.play('bonus_earned') }
  playMultiplierGained(): void { this.play('multiplier_gained') }
  playFinalRound(): void { this.play('final_round') }
  playWheelSpin(): void { this.play('wheel_spinning') }
  stopWheelSpin(): void { this.stop('wheel_spinning') }
  playConfetti(): void { this.play('confetti') }
}

// Export singleton instance
export const audioService = new AudioService()
export default audioService 