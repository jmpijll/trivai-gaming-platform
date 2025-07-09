import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Question, GameState } from '@/../../packages/shared/src/types/game'
import { useGameSounds } from '@/hooks/useAudio'

interface QuestionDisplayProps {
  question: Question
  timeRemaining: number
  onSubmitAnswer: (answerIndex: number) => void
  selectedAnswer: number | null
  hasSubmitted: boolean
  gameState: GameState | null
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  timeRemaining,
  onSubmitAnswer,
  selectedAnswer,
  hasSubmitted,
  gameState
}) => {
  const [localSelectedAnswer, setLocalSelectedAnswer] = useState<number | null>(null)
  const [previousQuestion, setPreviousQuestion] = useState<Question | null>(null)
  const [lastWarningTime, setLastWarningTime] = useState<number | null>(null)
  
  const { 
    handleNewQuestion, 
    handleTimeWarning, 
    playSound,
    playButtonClick 
  } = useGameSounds()

  // Play sound when new question appears
  useEffect(() => {
    if (question && (!previousQuestion || previousQuestion.id !== question.id)) {
      handleNewQuestion()
      setPreviousQuestion(question)
    }
  }, [question, previousQuestion, handleNewQuestion])

  // Play timer warning sounds
  useEffect(() => {
    if (timeRemaining <= 10 && timeRemaining > 0) {
      if (lastWarningTime === null || timeRemaining < lastWarningTime - 2) {
        handleTimeWarning(timeRemaining)
        setLastWarningTime(timeRemaining)
      }
    }
  }, [timeRemaining, lastWarningTime, handleTimeWarning])

  useEffect(() => {
    setLocalSelectedAnswer(selectedAnswer)
  }, [selectedAnswer])

  const handleAnswerClick = (index: number) => {
    if (hasSubmitted || timeRemaining <= 0) return
    
    // Play button click sound
    playButtonClick()
    
    setLocalSelectedAnswer(index)
    onSubmitAnswer(index)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = (time: number) => {
    if (time > 20) return 'text-green-400'
    if (time > 10) return 'text-yellow-400'
    return 'text-red-400'
  }

  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    hard: 'bg-red-500/20 text-red-400',
    extreme: 'bg-purple-500/20 text-purple-400'
  }

  return (
    <Card className="glass-card p-8">
      {/* Question Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-neutral-400">
            Question {(gameState?.roundState?.currentQuestionIndex || 0) + 1}
          </div>
          <div className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${difficultyColors[question.difficulty] || difficultyColors.medium}
          `}>
            {question.difficulty.toUpperCase()}
          </div>
        </div>
        
        <div className="text-right">
          <div className={`text-3xl font-bold ${getTimerColor(timeRemaining)}`}>
            {formatTime(timeRemaining)}
          </div>
          <div className="text-sm text-neutral-400">remaining</div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="mb-8">
        <div className="w-full bg-neutral-800 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeRemaining > 20 ? 'bg-green-500' :
              timeRemaining > 10 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${(timeRemaining / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* Topic */}
      <div className="mb-6">
        <span className="inline-flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full text-sm">
          <span className="text-2xl">🎯</span>
          <span className="text-neutral-300 font-medium">{question.topic}</span>
        </span>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white leading-relaxed">
          {question.text}
        </h2>
      </div>

      {/* Answers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {question.answers.map((answer, index: number) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(index)}
            disabled={hasSubmitted || timeRemaining <= 0}
            className={`
              glass-card p-4 text-left transition-all duration-300
              ${localSelectedAnswer === index 
                ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-blue-500/20' 
                : 'hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-blue-500/10'
              }
              ${hasSubmitted || timeRemaining <= 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer hover:scale-105'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center font-bold
                ${localSelectedAnswer === index 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-neutral-700 text-neutral-300'
                }
              `}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-white font-medium">{answer.text}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="text-center">
        {hasSubmitted ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-medium">
              Answer submitted! Waiting for other players...
            </span>
          </div>
        ) : timeRemaining > 0 ? (
          <p className="text-neutral-400">
            Select your answer before time runs out
          </p>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-red-400 font-medium">
              Time's up! Moving to next question...
            </span>
          </div>
        )}
      </div>
    </Card>
  )
} 