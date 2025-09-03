import React, { useState } from 'react'
import { CheckCircle, XCircle, BarChart3, Users, Clock, Award, Percent, Zap, UserCheck, ChevronDown, ChevronUp, Download } from 'lucide-react'
import ActionButton from './ActionButton'

const OutputDisplay = ({ simulation }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showVotingTimeline, setShowVotingTimeline] = useState(false)
  
  const getStatusColor = (status) => {
    return status.includes('Passed') ? 'text-success' : 'text-error'
  }

  const getStatusIcon = (status) => {
    return status.includes('Passed') ? 
      <CheckCircle className="w-5 h-5 text-success" /> : 
      <XCircle className="w-5 h-5 text-error" />
  }
  
  const exportSimulation = () => {
    // Create a JSON blob and download it
    const dataStr = JSON.stringify(simulation, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `solana-vote-simulation-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-lg">
      {/* Tabs */}
      <div className="bg-surface rounded-lg overflow-hidden">
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 py-md px-lg text-sm font-medium transition-colors ${
              activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`flex-1 py-md px-lg text-sm font-medium transition-colors ${
              activeTab === 'details' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`flex-1 py-md px-lg text-sm font-medium transition-colors ${
              activeTab === 'parameters' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('parameters')}
          >
            Parameters
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-lg">
          {activeTab === 'overview' && (
            <div className="space-y-lg">
              {/* Status Overview */}
              <div>
                <div className="flex items-center justify-between mb-lg">
                  <h3 className="text-lg font-semibold text-white">Vote Status</h3>
                  <div className="flex items-center gap-sm">
                    {getStatusIcon(simulation.status)}
                    <span className={`font-medium ${getStatusColor(simulation.status)}`}>
                      {simulation.status}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                  <div className="space-y-sm">
                    <div className="flex items-center gap-sm text-gray-300">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Total Votes</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">{simulation.totalVotes.toLocaleString()}</p>
                  </div>
                  
                  <div className="space-y-sm">
                    <div className="flex items-center gap-sm text-gray-300">
                      <BarChart3 className="w-4 h-4" />
                      <span className="text-sm">Participation Rate</span>
                    </div>
                    <p className="text-2xl font-semibold text-white">{simulation.participationRate}%</p>
                  </div>
                </div>
              </div>

              {/* Winner */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-lg">Winning Option</h3>
                <div className="bg-gradient-primary p-lg rounded-md">
                  <div className="text-center">
                    <h4 className="text-xl font-semibold text-white mb-sm">{simulation.winningOption}</h4>
                    <p className="text-lg text-white/90">{simulation.winningPercentage}% of votes</p>
                  </div>
                </div>
              </div>

              {/* Vote Distribution */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-lg">Vote Distribution</h3>
                <div className="space-y-md">
                  {simulation.voteDistribution.map((vote, index) => (
                    <div key={index} className="space-y-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-white font-medium">{vote.option}</span>
                        <span className="text-gray-300 font-mono text-sm">
                          {vote.votes.toLocaleString()} ({Math.round(vote.percentage * 100) / 100}%)
                        </span>
                      </div>
                      <div className="w-full bg-background rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-slow ${
                            index === 0 ? 'bg-primary' : 'bg-gray-600'
                          }`}
                          style={{ width: `${vote.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'details' && (
            <div className="space-y-lg">
              {/* Thresholds */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-lg">Thresholds</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
                  <div className="bg-background p-md rounded-md">
                    <div className="flex items-center gap-sm mb-sm">
                      <Percent className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-300">Quorum</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-white">{simulation.quorumPercentage}%</span>
                      <span className={`text-sm font-medium ${simulation.quorumMet ? 'text-success' : 'text-error'}`}>
                        {simulation.quorumMet ? 'Met' : 'Not Met'}
                      </span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-1 mt-sm">
                      <div 
                        className={`h-1 rounded-full ${simulation.quorumMet ? 'bg-success' : 'bg-error'}`}
                        style={{ width: `${Math.min(100, (simulation.participationRate / simulation.quorumPercentage) * 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  {simulation.thresholdPercentage && (
                    <div className="bg-background p-md rounded-md">
                      <div className="flex items-center gap-sm mb-sm">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">Proposal Threshold</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-white">{simulation.thresholdPercentage}%</span>
                        <span className={`text-sm font-medium ${simulation.thresholdMet ? 'text-success' : 'text-error'}`}>
                          {simulation.thresholdMet ? 'Met' : 'Not Met'}
                        </span>
                      </div>
                      <div className="w-full bg-surface rounded-full h-1 mt-sm">
                        <div 
                          className={`h-1 rounded-full ${simulation.thresholdMet ? 'bg-success' : 'bg-error'}`}
                          style={{ width: `${Math.min(100, (simulation.winningPercentage / simulation.thresholdPercentage) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Voting Power */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-lg">Voting Power</h3>
                <div className="bg-background p-md rounded-md">
                  <div className="flex items-center gap-sm mb-sm">
                    <Zap className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-300">Effective Voting Power</span>
                  </div>
                  <p className="text-lg font-semibold text-white">{simulation.effectiveVotingPower.toLocaleString()}</p>
                  
                  {simulation.delegationStats && (
                    <div className="mt-md pt-md border-t border-gray-700">
                      <div className="flex items-center gap-sm mb-sm">
                        <UserCheck className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-300">Delegation Impact</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">
                          {simulation.delegationStats.delegatedVotes.toLocaleString()} delegated votes
                        </span>
                        <span className="text-sm font-medium text-primary">
                          {simulation.delegationStats.delegationImpact}% of power
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Voting Timeline */}
              {simulation.votingTimeline && (
                <div>
                  <div className="flex items-center justify-between mb-lg">
                    <h3 className="text-lg font-semibold text-white">Voting Timeline</h3>
                    <button 
                      onClick={() => setShowVotingTimeline(!showVotingTimeline)}
                      className="text-sm text-primary flex items-center gap-sm"
                    >
                      {showVotingTimeline ? (
                        <>Hide Timeline <ChevronUp className="w-4 h-4" /></>
                      ) : (
                        <>Show Timeline <ChevronDown className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                  
                  {showVotingTimeline && (
                    <div className="bg-background p-md rounded-md">
                      <div className="flex items-stretch h-40">
                        {simulation.votingTimeline.map((day, index) => {
                          const maxVotes = Math.max(...simulation.votingTimeline.map(d => d.votes))
                          const height = (day.votes / maxVotes) * 100
                          
                          return (
                            <div 
                              key={index} 
                              className="flex-1 flex flex-col items-center justify-end"
                            >
                              <div 
                                className="w-full bg-primary/70 rounded-t-sm"
                                style={{ height: `${height}%` }}
                              />
                              <div className="text-xs text-gray-500 mt-sm rotate-45 origin-left">
                                {day.label}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'parameters' && (
            <div className="space-y-lg">
              <h3 className="text-lg font-semibold text-white mb-lg">Simulation Parameters</h3>
              
              <div className="bg-background p-md rounded-md">
                <div className="space-y-sm">
                  <div className="flex justify-between py-sm border-b border-gray-700">
                    <span className="text-sm text-gray-400">Vote Weight</span>
                    <span className="text-sm font-medium text-white">{simulation.simulationParameters.voteWeight}</span>
                  </div>
                  
                  <div className="flex justify-between py-sm border-b border-gray-700">
                    <span className="text-sm text-gray-400">Quorum</span>
                    <span className="text-sm font-medium text-white">{simulation.simulationParameters.quorum}%</span>
                  </div>
                  
                  <div className="flex justify-between py-sm border-b border-gray-700">
                    <span className="text-sm text-gray-400">Voting Period</span>
                    <span className="text-sm font-medium text-white">{simulation.simulationParameters.votingPeriod} days</span>
                  </div>
                  
                  <div className="flex justify-between py-sm border-b border-gray-700">
                    <span className="text-sm text-gray-400">Total Voters</span>
                    <span className="text-sm font-medium text-white">{simulation.simulationParameters.totalVoters.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between py-sm border-b border-gray-700">
                    <span className="text-sm text-gray-400">Proposal Threshold</span>
                    <span className="text-sm font-medium text-white">{simulation.simulationParameters.proposalThreshold}%</span>
                  </div>
                  
                  <div className="flex justify-between py-sm border-b border-gray-700">
                    <span className="text-sm text-gray-400">Token-based Weighting</span>
                    <span className="text-sm font-medium text-white">{simulation.simulationParameters.useTokenWeights ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  
                  <div className="flex justify-between py-sm border-b border-gray-700">
                    <span className="text-sm text-gray-400">Vote Delegation</span>
                    <span className="text-sm font-medium text-white">{simulation.simulationParameters.allowDelegation ? 'Enabled' : 'Disabled'}</span>
                  </div>
                  
                  {simulation.simulationParameters.allowDelegation && (
                    <div className="flex justify-between py-sm">
                      <span className="text-sm text-gray-400">Delegation Rate</span>
                      <span className="text-sm font-medium text-white">{simulation.simulationParameters.delegationRate}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <ActionButton
                  variant="secondary"
                  onClick={exportSimulation}
                  className="flex items-center gap-sm text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export Simulation
                </ActionButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-surface p-lg rounded-lg shadow-card">
        <h3 className="text-lg font-semibold text-white mb-lg">Simulation Details</h3>
        <div className="space-y-sm text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Status</span>
            <span className={`font-medium ${getStatusColor(simulation.status)}`}>
              {simulation.status}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Quorum Met</span>
            <span className={simulation.quorumMet ? 'text-success' : 'text-error'}>
              {simulation.quorumMet ? 'Yes' : 'No'}
            </span>
          </div>
          
          {simulation.thresholdMet !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Threshold Met</span>
              <span className={simulation.thresholdMet ? 'text-success' : 'text-error'}>
                {simulation.thresholdMet ? 'Yes' : 'No'}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Simulation Time</span>
            <span className="text-gray-300 font-mono">
              {new Date(simulation.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OutputDisplay
