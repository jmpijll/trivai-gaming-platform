import React from 'react'
import { Card } from '@/components/ui/Card'
import { PlayerScore } from '@/../../packages/shared/src/types/game'

interface ScoreBoardProps {
  scores: PlayerScore[]
  currentRound: number
  totalRounds: number
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  scores,
  currentRound,
  totalRounds
}) => {
  const sortedScores = [...scores].sort((a, b) => b.totalScore - a.totalScore)

  const getPositionColor = (position: number) => {
    switch (position) {
      case 0: return 'text-yellow-400' // 1st place
      case 1: return 'text-gray-400'   // 2nd place
      case 2: return 'text-amber-600'  // 3rd place
      default: return 'text-neutral-400'
    }
  }

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0: return '🥇'
      case 1: return '🥈'
      case 2: return '🥉'
      default: return `${position + 1}.`
    }
  }

  return (
    <Card className="glass-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-white">Leaderboard</h3>
        <div className="text-sm text-neutral-400">
          Round {currentRound} of {totalRounds}
        </div>
      </div>

      <div className="space-y-3">
        {sortedScores.map((score, index) => (
          <div
            key={score.playerId}
            className={`
              flex items-center justify-between p-3 rounded-lg
              ${index === 0 
                ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20' 
                : 'bg-gradient-to-r from-neutral-800/50 to-neutral-700/50'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`text-lg font-bold ${getPositionColor(index)}`}>
                {getPositionIcon(index)}
              </div>
              <div>
                <div className="font-semibold text-white">
                  Player {score.playerId.slice(-4)}
                </div>
                <div className="text-sm text-neutral-400">
                  {score.correctAnswers} correct • {score.streak} streak
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-bold text-white">
                {score.totalScore.toLocaleString()}
              </div>
              <div className="text-sm text-neutral-400">
                {score.averageResponseTime.toFixed(1)}s avg
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="mt-6 pt-4 border-t border-neutral-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-400">
              {scores.reduce((sum, s) => sum + s.correctAnswers, 0)}
            </div>
            <div className="text-sm text-neutral-400">Total Correct</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {scores.length > 0 
                ? (scores.reduce((sum, s) => sum + s.averageResponseTime, 0) / scores.length).toFixed(1)
                : '0.0'
              }s
            </div>
            <div className="text-sm text-neutral-400">Avg Response</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {Math.max(...scores.map(s => s.streak), 0)}
            </div>
            <div className="text-sm text-neutral-400">Best Streak</div>
          </div>
        </div>
      </div>
    </Card>
  )
} 