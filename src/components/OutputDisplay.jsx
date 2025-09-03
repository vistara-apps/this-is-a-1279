import React from 'react'
import { CheckCircle, XCircle, BarChart3, Users, Clock } from 'lucide-react'

const OutputDisplay = ({ simulation }) => {
  const getStatusColor = (status) => {
    return status.includes('Passed') ? 'text-success' : 'text-error'
  }

  const getStatusIcon = (status) => {
    return status.includes('Passed') ? 
      <CheckCircle className="w-5 h-5 text-success" /> : 
      <XCircle className="w-5 h-5 text-error" />
  }

  return (
    <div className="space-y-lg">
      {/* Status Overview */}
      <div className="bg-surface p-lg rounded-lg shadow-card">
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
      <div className="bg-surface p-lg rounded-lg shadow-card">
        <h3 className="text-lg font-semibold text-white mb-lg">Winning Option</h3>
        <div className="bg-gradient-primary p-lg rounded-md">
          <div className="text-center">
            <h4 className="text-xl font-semibold text-white mb-sm">{simulation.winningOption}</h4>
            <p className="text-lg text-white/90">{simulation.winningPercentage}% of votes</p>
          </div>
        </div>
      </div>

      {/* Vote Distribution */}
      <div className="bg-surface p-lg rounded-lg shadow-card">
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

      {/* Metadata */}
      <div className="bg-surface p-lg rounded-lg shadow-card">
        <h3 className="text-lg font-semibold text-white mb-lg">Simulation Details</h3>
        <div className="space-y-sm text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Quorum Met</span>
            <span className={simulation.quorumMet ? 'text-success' : 'text-error'}>
              {simulation.quorumMet ? 'Yes' : 'No'}
            </span>
          </div>
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