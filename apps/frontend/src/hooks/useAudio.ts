import { useEffect, useState, useCallback } from 'react'
import { audioService, SoundCategory } from '@/lib/audioService'
import { PlayerSettings } from '@/../../packages/shared/src/types/player'

interface UseAudioReturn {
  isInitialized: boolean
  isEnabled: boolean
  volume: number
  playSound: (soundId: string, options?: { volume?: number; pitch?: number }) => void
  stopSound: (soundId: string) => void
  stopAllSounds: () => void
  updateSettings: (settings: Partial<PlayerSettings>) => void
  setCategoryEnabled: (category: SoundCategory, enabled: boolean) => void
  
  // Convenience methods
  playCorrectAnswer: () => void
  playWrongAnswer: () => void
  playButtonClick: () => void
  playHover: () => void
  playNewQuestion: () => void
  playTimeWarning: () => void
  playTimeCritical: () => void
  playRoundComplete: () => void
  playGameWon: () => void
  playBonusEarned: () => void
  playMultiplierGained: () => void
  playFinalRound: () => void
  playWheelSpin: () => void
  stopWheelSpin: () => void
  playConfetti: () => void
}

export function useAudio(initialSettings?: Partial<PlayerSettings>): UseAudioReturn {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isEnabled, setIsEnabled] = useState(true)
  const [volume, setVolume] = useState(0.7)

  // Initialize audio service
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        await audioService.initialize()
        setIsInitialized(true)
        
        // Apply initial settings if provided
        if (initialSettings) {
          audioService.updateSettings(initialSettings)
          if (initialSettings.soundEnabled !== undefined) {
            setIsEnabled(initialSettings.soundEnabled)
          }
          if (initialSettings.volume !== undefined) {
            setVolume(initialSettings.volume)
          }
        }
      } catch (error) {
        console.error('Failed to initialize audio service:', error)
        setIsInitialized(false)
      }
    }

    initializeAudio()
  }, [initialSettings])

  // Play sound with error handling
  const playSound = useCallback((soundId: string, options?: { volume?: number; pitch?: number }) => {
    if (isInitialized && isEnabled) {
      audioService.play(soundId, options)
    }
  }, [isInitialized, isEnabled])

  // Stop sound
  const stopSound = useCallback((soundId: string) => {
    audioService.stop(soundId)
  }, [])

  // Stop all sounds
  const stopAllSounds = useCallback(() => {
    audioService.stopAll()
  }, [])

  // Update settings
  const updateSettings = useCallback((settings: Partial<PlayerSettings>) => {
    audioService.updateSettings(settings)
    
    if (settings.soundEnabled !== undefined) {
      setIsEnabled(settings.soundEnabled)
    }
    if (settings.volume !== undefined) {
      setVolume(settings.volume)
    }
  }, [])

  // Set category enabled
  const setCategoryEnabled = useCallback((category: SoundCategory, enabled: boolean) => {
    audioService.setCategoryEnabled(category, enabled)
  }, [])

  // Convenience methods
  const playCorrectAnswer = useCallback(() => playSound('correct_answer'), [playSound])
  const playWrongAnswer = useCallback(() => playSound('wrong_answer'), [playSound])
  const playButtonClick = useCallback(() => playSound('click'), [playSound])
  const playHover = useCallback(() => playSound('hover'), [playSound])
  const playNewQuestion = useCallback(() => playSound('new_question'), [playSound])
  const playTimeWarning = useCallback(() => playSound('timer_warning'), [playSound])
  const playTimeCritical = useCallback(() => playSound('timer_critical'), [playSound])
  const playRoundComplete = useCallback(() => playSound('round_complete'), [playSound])
  const playGameWon = useCallback(() => playSound('game_won'), [playSound])
  const playBonusEarned = useCallback(() => playSound('bonus_earned'), [playSound])
  const playMultiplierGained = useCallback(() => playSound('multiplier_gained'), [playSound])
  const playFinalRound = useCallback(() => playSound('final_round'), [playSound])
  const playWheelSpin = useCallback(() => playSound('wheel_spinning'), [playSound])
  const stopWheelSpin = useCallback(() => stopSound('wheel_spinning'), [stopSound])
  const playConfetti = useCallback(() => playSound('confetti'), [playSound])

  return {
    isInitialized,
    isEnabled,
    volume,
    playSound,
    stopSound,
    stopAllSounds,
    updateSettings,
    setCategoryEnabled,
    playCorrectAnswer,
    playWrongAnswer,
    playButtonClick,
    playHover,
    playNewQuestion,
    playTimeWarning,
    playTimeCritical,
    playRoundComplete,
    playGameWon,
    playBonusEarned,
    playMultiplierGained,
    playFinalRound,
    playWheelSpin,
    stopWheelSpin,
    playConfetti
  }
}

// Hook for button interactions with sound effects
export function useButtonSound() {
  const { playButtonClick, playHover } = useAudio()

  const handleClick = useCallback(() => {
    playButtonClick()
  }, [playButtonClick])

  const handleHover = useCallback(() => {
    playHover()
  }, [playHover])

  return {
    onClickSound: handleClick,
    onHoverSound: handleHover
  }
}

// Hook for game events with sound effects
export function useGameSounds() {
  const audio = useAudio()

  const handleCorrectAnswer = useCallback(() => {
    audio.playCorrectAnswer()
  }, [audio])

  const handleWrongAnswer = useCallback(() => {
    audio.playWrongAnswer()
  }, [audio])

  const handleNewQuestion = useCallback(() => {
    audio.playNewQuestion()
  }, [audio])

  const handleTimeWarning = useCallback((timeLeft: number) => {
    if (timeLeft <= 5) {
      audio.playTimeCritical()
    } else if (timeLeft <= 10) {
      audio.playTimeWarning()
    }
  }, [audio])

  const handleRoundComplete = useCallback(() => {
    audio.playRoundComplete()
  }, [audio])

  const handleGameWon = useCallback(() => {
    audio.playGameWon()
  }, [audio])

  const handleBonusEarned = useCallback(() => {
    audio.playBonusEarned()
  }, [audio])

  const handleMultiplierGained = useCallback(() => {
    audio.playMultiplierGained()
  }, [audio])

  const handleFinalRound = useCallback(() => {
    audio.playFinalRound()
  }, [audio])

  const handleWheelSpin = useCallback(() => {
    audio.playWheelSpin()
  }, [audio])

  const handleWheelStop = useCallback(() => {
    audio.stopWheelSpin()
  }, [audio])

  const handleConfetti = useCallback(() => {
    audio.playConfetti()
  }, [audio])

  return {
    ...audio,
    handleCorrectAnswer,
    handleWrongAnswer,
    handleNewQuestion,
    handleTimeWarning,
    handleRoundComplete,
    handleGameWon,
    handleBonusEarned,
    handleMultiplierGained,
    handleFinalRound,
    handleWheelSpin,
    handleWheelStop,
    handleConfetti
  }
}

export default useAudio 