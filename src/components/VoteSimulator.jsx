import React, { useState } from 'react'
import InputForm from './InputForm'
import OutputDisplay from './OutputDisplay'
import ActionButton from './ActionButton'

const VoteSimulator = () => {
  const [voteParams, setVoteParams] = useState({
    voteWeight: 100,
    quorum: 50,
    votingPeriod: 7,
    totalVoters: 1000,
    voteOptions: ['Option A', 'Option B', 'Option C']
  })
  
  const [simulation, setSimulation] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const handleParamChange = (field, value) => {
    setVoteParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const runSimulation = async () => {
    setIsSimulating(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate realistic vote simulation
    const totalVotes = Math.floor(Math.random() * voteParams.totalVoters * 0.8) + Math.floor(voteParams.totalVoters * 0.2)
    const participationRate = (totalVotes / voteParams.totalVoters) * 100
    
    // Distribute votes among options
    const votes = voteParams.voteOptions.map((option, index) => {
      let baseWeight = Math.random()
      // Make first option slightly more likely to win
      if (index === 0) baseWeight += 0.2
      return {
        option,
        votes: Math.floor(totalVotes * baseWeight / voteParams.voteOptions.reduce((sum, _, i) => sum + Math.random() + (i === 0 ? 0.2 : 0), 0)),
        percentage: 0
      }
    })
    
    // Normalize percentages
    const totalDistributedVotes = votes.reduce((sum, v) => sum + v.votes, 0)
    votes.forEach(v => {
      v.percentage = (v.votes / totalDistributedVotes) * 100
    })
    
    // Sort by votes to determine winner
    votes.sort((a, b) => b.votes - a.votes)
    
    const quorumMet = participationRate >= voteParams.quorum
    
    const simulationResult = {
      totalVotes,
      participationRate: Math.round(participationRate * 100) / 100,
      quorumMet,
      winningOption: votes[0].option,
      winningPercentage: Math.round(votes[0].percentage * 100) / 100,
      voteDistribution: votes,
      timestamp: new Date().toISOString(),
      status: quorumMet ? 'Passed' : 'Failed (Quorum not met)'
    }
    
    setSimulation(simulationResult)
    setIsSimulating(false)
  }

  return (
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
          />
          
          <InputForm
            label="Quorum (%)"
            type="number"
            value={voteParams.quorum}
            onChange={(value) => handleParamChange('quorum', value)}
            min={1}
            max={100}
            help="Minimum participation required for valid vote"
          />
          
          <InputForm
            label="Voting Period (days)"
            type="number"
            value={voteParams.votingPeriod}
            onChange={(value) => handleParamChange('votingPeriod', value)}
            min={1}
            max={30}
            help="Duration of the voting period"
          />
          
          <InputForm
            label="Total Voters"
            type="number"
            value={voteParams.totalVoters}
            onChange={(value) => handleParamChange('totalVoters', value)}
            min={10}
            max={10000}
            help="Total number of eligible voters"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-sm">
              Vote Options
            </label>
            <div className="space-y-sm">
              {voteParams.voteOptions.map((option, index) => (
                <InputForm
                  key={index}
                  type="text"
                  value={option}
                  onChange={(value) => {
                    const newOptions = [...voteParams.voteOptions]
                    newOptions[index] = value
                    handleParamChange('voteOptions', newOptions)
                  }}
                  placeholder={`Option ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          <ActionButton
            variant="primary"
            onClick={runSimulation}
            disabled={isSimulating}
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
          <OutputDisplay simulation={simulation} />
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
  )
}

export default VoteSimulator