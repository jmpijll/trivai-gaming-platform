import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { GameState } from '@/../../packages/shared/src/types/game'

interface TopicSelectionProps {
  topics: string[]
  onTopicSelect: (topic: string) => void
  gameState: GameState | null
}

export const TopicSelection: React.FC<TopicSelectionProps> = ({
  topics,
  onTopicSelect,
  gameState
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic)
    onTopicSelect(topic)
  }

  return (
    <Card className="glass-card p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Choose Your Topic
        </h2>
        <p className="text-neutral-300 text-lg">
          Select a topic for Round {gameState?.currentRound || 1}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => handleTopicClick(topic)}
            disabled={selectedTopic !== null}
            className={`
              glass-card p-6 text-left transition-all duration-300 
              hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20
              ${selectedTopic === topic 
                ? 'ring-2 ring-purple-500 bg-gradient-to-br from-purple-500/20 to-blue-500/20' 
                : 'hover:bg-gradient-to-br hover:from-purple-500/10 hover:to-blue-500/10'
              }
              ${selectedTopic !== null && selectedTopic !== topic 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎯</div>
              <div>
                <h3 className="font-semibold text-white text-lg capitalize">
                  {topic.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-neutral-400 text-sm">
                  Test your knowledge in {topic.toLowerCase()}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedTopic && (
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-400 font-medium">
              Topic selected: {selectedTopic}
            </span>
          </div>
          <p className="text-neutral-400 text-sm mt-2">
            Waiting for other players...
          </p>
        </div>
      )}
    </Card>
  )
} 