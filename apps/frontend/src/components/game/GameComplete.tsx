import React from 'react'
import { Card } from '@/components/ui/Card'
import { PlayerScore, GameStats } from '@/../../packages/shared/src/types/game'

interface GameCompleteProps {
  finalScores: PlayerScore[]
  gameStats: GameStats | null
  onReturnToLobby: () => void
}

export const GameComplete: React.FC<GameCompleteProps> = ({
  finalScores,
  gameStats,
  onReturnToLobby
}) => {
  const sortedScores = [...finalScores].sort((a, b) => b.totalScore - a.totalScore)
  const winner = sortedScores[0]

  const getPositionColor = (position: number) => {
    switch (position) {
      case 0: return 'text-yellow-400 bg-gradient-to-r from-yellow-500/20 to-amber-500/20'
      case 1: return 'text-gray-400 bg-gradient-to-r from-gray-500/20 to-slate-500/20'
      case 2: return 'text-amber-600 bg-gradient-to-r from-amber-600/20 to-orange-500/20'
      default: return 'text-neutral-400 bg-gradient-to-r from-neutral-700/20 to-neutral-600/20'
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

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Winner Celebration */}
      <Card className="glass-card p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-400 bg-clip-text text-transparent">
          Game Complete!
        </h1>
        {winner && (
          <div className="space-y-2">
            <p className="text-2xl font-semibold text-white">
              🏆 Player {winner.playerId.slice(-4)} Wins! 🏆
            </p>
            <p className="text-lg text-neutral-300">
              Final Score: {winner.totalScore.toLocaleString()} points
            </p>
          </div>
        )}
      </Card>

      {/* Final Leaderboard */}
      <Card className="glass-card p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Final Leaderboard
        </h2>
        
        <div className="space-y-4">
          {sortedScores.map((score, index) => (
            <div
              key={score.playerId}
              className={`
                p-4 rounded-lg border-2 transition-all duration-300
                ${index === 0 
                  ? 'border-yellow-500 ' + getPositionColor(index)
                  : 'border-neutral-700 ' + getPositionColor(index)
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl font-bold">
                    {getPositionIcon(index)}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">
                      Player {score.playerId.slice(-4)}
                    </div>
                    <div className="text-sm text-neutral-400">
                      {score.correctAnswers} correct answers • {score.streak} best streak
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {score.totalScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-400">
                    {score.averageResponseTime.toFixed(1)}s avg response
                  </div>
                </div>
              </div>

              {/* Round-by-round scores */}
              <div className="mt-4 pt-3 border-t border-neutral-700">
                <div className="text-sm text-neutral-400 mb-2">Round Scores:</div>
                <div className="flex space-x-2">
                  {score.roundScores.map((roundScore, roundIndex) => (
                    <div
                      key={roundIndex}
                      className="px-2 py-1 bg-neutral-800 rounded text-xs text-white"
                    >
                      R{roundIndex + 1}: {roundScore}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Game Statistics */}
      {gameStats && (
        <Card className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">
            Game Statistics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {gameStats.totalQuestions}
              </div>
              <div className="text-sm text-neutral-400">Total Questions</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {gameStats.totalCorrectAnswers}
              </div>
              <div className="text-sm text-neutral-400">Correct Answers</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {gameStats.averageResponseTime.toFixed(1)}s
              </div>
              <div className="text-sm text-neutral-400">Avg Response Time</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {formatDuration(gameStats.gameDuration)}
              </div>
              <div className="text-sm text-neutral-400">Game Duration</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-400">
                  {((gameStats.totalCorrectAnswers / gameStats.totalQuestions) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-neutral-400">Overall Accuracy</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-pink-400">
                  {gameStats.playersJoined}
                </div>
                <div className="text-sm text-neutral-400">Players Joined</div>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-cyan-400">
                  {gameStats.playersCompleted}
                </div>
                <div className="text-sm text-neutral-400">Players Completed</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Actions */}
      <Card className="glass-card p-6 text-center">
        <div className="space-y-4">
          <p className="text-neutral-300 text-lg">
            Thanks for playing TrivAI! 🎮
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onReturnToLobby}
              className="glass-button px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold"
            >
              Return to Lobby
            </button>
            <button
              onClick={() => window.location.reload()}
              className="glass-button px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold"
            >
              Play Again
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
} 