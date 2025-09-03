import React, { useState, useEffect } from 'react'
import { Activity, Plus, Trash2, AlertCircle, Save, History } from 'lucide-react'
import InputForm from './InputForm'
import OutputDisplay from './OutputDisplay'
import ActionButton from './ActionButton'
import { simulateVote, validateSimulationParams } from '../services/VoteSimulationService'
import { validateVoteParams } from '../utils/validators'
import { saveSimulation, getSimulations } from '../services/StorageService'
import { exportAndDownload } from '../utils/exportUtils'
import { useNotification } from '../context/NotificationContext'

const VoteSimulator = () => {
  const { success, error: showError, info } = useNotification()
  
  const [voteParams, setVoteParams] = useState({
    voteWeight: 100,
    quorum: 50,
    votingPeriod: 7,
    totalVoters: 1000,
    voteOptions: ['Option A', 'Option B', 'Option C'],
    proposalThreshold: 50,
    useTokenWeights: false,
    allowDelegation: false,
    delegationRate: 20
  })
  
  const [simulation, setSimulation] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [errors, setErrors] = useState({})
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [simulationHistory, setSimulationHistory] = useState([])
  const [savedSimulations, setSavedSimulations] = useState([])
  const [showSavedSimulations, setShowSavedSimulations] = useState(false)

  // Load saved simulations from local storage
  useEffect(() => {
    const loadedSimulations = getSimulations()
    setSavedSimulations(loadedSimulations)
  }, [])

  // Validate parameters whenever they change
  useEffect(() => {
    const { errors } = validateVoteParams(voteParams)
    setErrors(errors || {})
  }, [voteParams])

  const handleParamChange = (field, value) => {
    setVoteParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addVoteOption = () => {
    if (voteParams.voteOptions.length < 10) {
      setVoteParams(prev => ({
        ...prev,
        voteOptions: [...prev.voteOptions, `Option ${prev.voteOptions.length + 1}`]
      }))
    }
  }

  const removeVoteOption = (index) => {
    if (voteParams.voteOptions.length > 2) {
      setVoteParams(prev => ({
        ...prev,
        voteOptions: prev.voteOptions.filter((_, i) => i !== index)
      }))
    }
  }

  const runSimulation = async () => {
    // Validate parameters before running simulation
    const validation = validateSimulationParams(voteParams)
    if (!validation.isValid) {
      setErrors(validation.errors)
      showError('Please fix the validation errors before running the simulation')
      return
    }
    
    setIsSimulating(true)
    
    try {
      // Run simulation using the service
      const result = await simulateVote(voteParams)
      
      // Add to simulation history
      setSimulationHistory(prev => [result, ...prev].slice(0, 10))
      
      // Set current simulation
      setSimulation(result)
      
      // Show success notification
      success('Simulation completed successfully')
    } catch (error) {
      console.error('Simulation error:', error)
      showError('An error occurred while running the simulation')
    } finally {
      setIsSimulating(false)
    }
  }
  
  const saveCurrentSimulation = () => {
    if (!simulation) return
    
    const saved = saveSimulation(simulation)
    
    if (saved) {
      // Update saved simulations list
      setSavedSimulations(getSimulations())
      success('Simulation saved successfully')
    } else {
      showError('Failed to save simulation')
    }
  }
  
  const exportSimulation = (format = 'json') => {
    if (!simulation) return
    
    try {
      exportAndDownload(simulation, format)
      info(`Simulation exported as ${format.toUpperCase()}`)
    } catch (err) {
      console.error('Export error:', err)
      showError('Failed to export simulation')
    }
  }

  const clearSimulation = () => {
    setSimulation(null)
  }

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(prev => !prev)
  }

  const hasErrors = Object.keys(errors).length > 0

  const toggleSavedSimulations = () => {
    setShowSavedSimulations(prev => !prev)
  }
  
  const loadSavedSimulation = (savedSim) => {
    setSimulation(savedSim)
    setShowSavedSimulations(false)
    success('Saved simulation loaded')
  }

  return (
    <div className="space-y-xl">
      {/* Action Bar */}
      <div className="flex flex-wrap gap-md justify-end">
        <ActionButton
          variant="secondary"
          onClick={toggleSavedSimulations}
          className="flex items-center gap-sm text-sm"
        >
          <History className="w-4 h-4" />
          {showSavedSimulations ? 'Hide Saved Simulations' : 'Show Saved Simulations'}
        </ActionButton>
        
        {simulation && (
          <ActionButton
            variant="secondary"
            onClick={saveCurrentSimulation}
            className="flex items-center gap-sm text-sm"
          >
            <Save className="w-4 h-4" />
            Save Simulation
          </ActionButton>
        )}
      </div>
      
      {/* Saved Simulations Panel */}
      {showSavedSimulations && (
        <div className="bg-surface p-lg rounded-lg shadow-card">
          <h2 className="text-xl font-semibold text-white mb-lg">Saved Simulations</h2>
          
          {savedSimulations.length === 0 ? (
            <p className="text-gray-400">No saved simulations yet. Run a simulation and save it to see it here.</p>
          ) : (
            <div className="space-y-sm max-h-60 overflow-y-auto">
              {savedSimulations.map((sim, index) => (
                <button
                  key={index}
                  onClick={() => loadSavedSimulation(sim)}
                  className="w-full text-left p-sm hover:bg-background/50 rounded-md transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white">
                      {sim.winningOption} ({sim.status})
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(sim.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-xs">
                    Participation: {sim.participationRate}% | Votes: {sim.totalVotes}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        {/* Parameter Configuration */}
        <div className="space-y-lg">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-md">Vote Parameters</h2>
            <p className="text-gray-400 text-base leading-7">Configure your vote simulation parameters</p>
          </div>
        
        <div className="bg-surface p-lg rounded-lg shadow-card space-y-lg">
          <InputForm
            label="Vote Weight"
            type="number"
            value={voteParams.voteWeight}
            onChange={(value) => handleParamChange('voteWeight', value)}
            min={1}
            max={1000}
            help="Weight assigned to each vote"
            error={errors.voteWeight}
          />
          
          <InputForm
            label="Quorum (%)"
            type="number"
            value={voteParams.quorum}
            onChange={(value) => handleParamChange('quorum', value)}
            min={1}
            max={100}
            help="Minimum participation required for valid vote"
            error={errors.quorum}
          />
          
          <InputForm
            label="Voting Period (days)"
            type="number"
            value={voteParams.votingPeriod}
            onChange={(value) => handleParamChange('votingPeriod', value)}
            min={1}
            max={30}
            help="Duration of the voting period"
            error={errors.votingPeriod}
          />
          
          <InputForm
            label="Total Voters"
            type="number"
            value={voteParams.totalVoters}
            onChange={(value) => handleParamChange('totalVoters', value)}
            min={10}
            max={10000}
            help="Total number of eligible voters"
            error={errors.totalVoters}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-sm">
              Vote Options
            </label>
            <div className="space-y-sm">
              {voteParams.voteOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-sm">
                  <InputForm
                    type="text"
                    value={option}
                    onChange={(value) => {
                      const newOptions = [...voteParams.voteOptions]
                      newOptions[index] = value
                      handleParamChange('voteOptions', newOptions)
                    }}
                    placeholder={`Option ${index + 1}`}
                    error={errors.voteOptions}
                    className="flex-1"
                  />
                  {voteParams.voteOptions.length > 2 && (
                    <button 
                      onClick={() => removeVoteOption(index)}
                      className="p-sm text-gray-400 hover:text-error transition-colors"
                      aria-label="Remove option"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              
              {voteParams.voteOptions.length < 10 && (
                <button 
                  onClick={addVoteOption}
                  className="flex items-center gap-sm text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </button>
              )}
            </div>
          </div>
          
          {/* Advanced Options Toggle */}
          <div>
            <button 
              onClick={toggleAdvancedOptions}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              {showAdvancedOptions ? 'Hide Advanced Options' : 'Show Advanced Options'}
            </button>
          </div>
          
          {/* Advanced Options */}
          {showAdvancedOptions && (
            <div className="space-y-lg border-t border-gray-700 pt-lg">
              <InputForm
                label="Proposal Threshold (%)"
                type="number"
                value={voteParams.proposalThreshold}
                onChange={(value) => handleParamChange('proposalThreshold', value)}
                min={1}
                max={100}
                help="Minimum percentage of votes required for proposal to pass"
                error={errors.proposalThreshold}
              />
              
              <div className="flex items-center gap-md">
                <input
                  type="checkbox"
                  id="useTokenWeights"
                  checked={voteParams.useTokenWeights}
                  onChange={(e) => handleParamChange('useTokenWeights', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary bg-background"
                />
                <label htmlFor="useTokenWeights" className="text-sm text-gray-300">
                  Use token-based vote weighting
                </label>
              </div>
              
              <div className="flex items-center gap-md">
                <input
                  type="checkbox"
                  id="allowDelegation"
                  checked={voteParams.allowDelegation}
                  onChange={(e) => handleParamChange('allowDelegation', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 text-primary focus:ring-primary bg-background"
                />
                <label htmlFor="allowDelegation" className="text-sm text-gray-300">
                  Allow vote delegation
                </label>
              </div>
              
              {voteParams.allowDelegation && (
                <InputForm
                  label="Delegation Rate (%)"
                  type="number"
                  value={voteParams.delegationRate}
                  onChange={(value) => handleParamChange('delegationRate', value)}
                  min={0}
                  max={100}
                  help="Percentage of voters who delegate their votes"
                  error={errors.delegationRate}
                />
              )}
            </div>
          )}
          
          {/* Error Summary */}
          {hasErrors && (
            <div className="bg-error/10 border border-error/30 rounded-md p-md flex items-start gap-sm">
              <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-xs" />
              <div>
                <p className="text-sm font-medium text-error">Please fix the following errors:</p>
                <ul className="text-xs text-error mt-xs list-disc list-inside">
                  {Object.values(errors).map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          <ActionButton
            variant="primary"
            onClick={runSimulation}
            disabled={isSimulating || hasErrors}
            className="w-full"
          >
            {isSimulating ? 'Running Simulation...' : 'Run Vote Simulation'}
          </ActionButton>
        </div>
      </div>
      
      {/* Results Display */}
      <div className="space-y-lg">
        <div>
          <h2 className="text-2xl font-semibold text-white mb-md">Simulation Results</h2>
          <p className="text-gray-400 text-base leading-7">View your vote simulation outcomes</p>
        </div>
        
        {simulation ? (
          <div className="space-y-md">
            <OutputDisplay simulation={simulation} />
            
            <div className="flex justify-end">
              <ActionButton
                variant="secondary"
                onClick={clearSimulation}
                className="text-sm"
              >
                Clear Results
              </ActionButton>
            </div>
            
            {simulationHistory.length > 1 && (
              <div className="bg-surface p-lg rounded-lg shadow-card">
                <h3 className="text-lg font-semibold text-white mb-md">Simulation History</h3>
                <div className="space-y-sm max-h-60 overflow-y-auto">
                  {simulationHistory.slice(1).map((sim, index) => (
                    <button
                      key={index}
                      onClick={() => setSimulation(sim)}
                      className="w-full text-left p-sm hover:bg-background/50 rounded-md transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-white">
                          {sim.winningOption} ({sim.status})
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(sim.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-xs">
                        Participation: {sim.participationRate}% | Votes: {sim.totalVotes}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-surface p-lg rounded-lg shadow-card">
            <div className="text-center py-xl">
              <div className="text-gray-500 mb-md">
                <Activity className="w-12 h-12 mx-auto opacity-50" />
              </div>
              <p className="text-gray-400">Run a simulation to see results</p>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
  )
}

export default VoteSimulator
