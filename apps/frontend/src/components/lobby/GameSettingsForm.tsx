'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { GameSettings, DEFAULT_GAME_SETTINGS } from '@/../../packages/shared/src/types/game'

interface GameSettingsFormProps {
  currentSettings: GameSettings
  isHost: boolean
  onUpdateSettings: (settings: GameSettings) => void
  disabled?: boolean
}

export function GameSettingsForm({ 
  currentSettings, 
  isHost, 
  onUpdateSettings, 
  disabled = false 
}: GameSettingsFormProps) {
  const [settings, setSettings] = useState<GameSettings>(currentSettings)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateSettings(settings)
  }

  const handleReset = () => {
    setSettings(DEFAULT_GAME_SETTINGS)
  }

  const updateSetting = (key: keyof GameSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const updateDifficultyMultiplier = (difficulty: 'easy' | 'medium' | 'hard', value: number) => {
    setSettings(prev => ({
      ...prev,
      difficultyMultiplier: {
        ...prev.difficultyMultiplier,
        [difficulty]: value
      }
    }))
  }

  const updateFinalRoundMultiplier = (key: 'min' | 'max', value: number) => {
    setSettings(prev => ({
      ...prev,
      finalRoundMultiplier: {
        ...prev.finalRoundMultiplier,
        [key]: value
      }
    }))
  }

  if (!isHost) {
    return (
      <Card className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Game Settings</h3>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? 'Hide' : 'Show'} Details
          </Button>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Max Rounds:</span>
            <span>{currentSettings.maxRounds}</span>
          </div>
          <div className="flex justify-between">
            <span>Questions per Round:</span>
            <span>{currentSettings.questionsPerRound}</span>
          </div>
          <div className="flex justify-between">
            <span>Question Time Limit:</span>
            <span>{currentSettings.questionTimeLimit / 1000}s</span>
          </div>
          
          {isExpanded && (
            <>
              <div className="border-t border-neutral-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span>Round Break:</span>
                  <span>{currentSettings.roundBreakDuration / 1000}s</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Points:</span>
                  <span>{currentSettings.basePoints}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Bonus:</span>
                  <span>{currentSettings.timeBonus ? 'Yes' : 'No'}</span>
                </div>
                <div className="text-xs text-neutral-500 mt-2">
                  <div>Difficulty Multipliers:</div>
                  <div className="ml-2">
                    Easy: {currentSettings.difficultyMultiplier.easy}x<br/>
                    Medium: {currentSettings.difficultyMultiplier.medium}x<br/>
                    Hard: {currentSettings.difficultyMultiplier.hard}x
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Game Settings</h3>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            disabled={disabled}
            className="text-xs"
          >
            Reset to Default
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? 'Basic' : 'Advanced'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Max Rounds</label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.maxRounds}
              onChange={(e) => updateSetting('maxRounds', parseInt(e.target.value))}
              disabled={disabled}
              className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Questions per Round</label>
            <input
              type="number"
              min="3"
              max="20"
              value={settings.questionsPerRound}
              onChange={(e) => updateSetting('questionsPerRound', parseInt(e.target.value))}
              disabled={disabled}
              className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Question Time Limit (seconds)</label>
            <input
              type="number"
              min="10"
              max="120"
              value={settings.questionTimeLimit / 1000}
              onChange={(e) => updateSetting('questionTimeLimit', parseInt(e.target.value) * 1000)}
              disabled={disabled}
              className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Base Points</label>
            <input
              type="number"
              min="10"
              max="1000"
              step="10"
              value={settings.basePoints}
              onChange={(e) => updateSetting('basePoints', parseInt(e.target.value))}
              disabled={disabled}
              className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="timeBonus"
            checked={settings.timeBonus}
            onChange={(e) => updateSetting('timeBonus', e.target.checked)}
            disabled={disabled}
            className="w-4 h-4 text-purple-600 bg-neutral-800 border-neutral-700 rounded focus:ring-purple-500"
          />
          <label htmlFor="timeBonus" className="text-sm font-medium">
            Enable Time Bonus (faster answers get more points)
          </label>
        </div>

        {/* Advanced Settings */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-neutral-700">
            <div>
              <label className="block text-sm font-medium mb-2">Round Break Duration (seconds)</label>
              <input
                type="number"
                min="5"
                max="60"
                value={settings.roundBreakDuration / 1000}
                onChange={(e) => updateSetting('roundBreakDuration', parseInt(e.target.value) * 1000)}
                disabled={disabled}
                className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Difficulty Multipliers</label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Easy</label>
                  <input
                    type="number"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.difficultyMultiplier.easy}
                    onChange={(e) => updateDifficultyMultiplier('easy', parseFloat(e.target.value))}
                    disabled={disabled}
                    className="w-full px-2 py-1 bg-neutral-800/50 border border-neutral-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Medium</label>
                  <input
                    type="number"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.difficultyMultiplier.medium}
                    onChange={(e) => updateDifficultyMultiplier('medium', parseFloat(e.target.value))}
                    disabled={disabled}
                    className="w-full px-2 py-1 bg-neutral-800/50 border border-neutral-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Hard</label>
                  <input
                    type="number"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.difficultyMultiplier.hard}
                    onChange={(e) => updateDifficultyMultiplier('hard', parseFloat(e.target.value))}
                    disabled={disabled}
                    className="w-full px-2 py-1 bg-neutral-800/50 border border-neutral-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Final Round Multiplier Range</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Min</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={settings.finalRoundMultiplier.min}
                    onChange={(e) => updateFinalRoundMultiplier('min', parseInt(e.target.value))}
                    disabled={disabled}
                    className="w-full px-2 py-1 bg-neutral-800/50 border border-neutral-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Max</label>
                  <input
                    type="number"
                    min="5"
                    max="20"
                    value={settings.finalRoundMultiplier.max}
                    onChange={(e) => updateFinalRoundMultiplier('max', parseInt(e.target.value))}
                    disabled={disabled}
                    className="w-full px-2 py-1 bg-neutral-800/50 border border-neutral-700 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="submit"
            disabled={disabled}
            className="glass-button"
          >
            Update Settings
          </Button>
        </div>
      </form>
    </Card>
  )
} 