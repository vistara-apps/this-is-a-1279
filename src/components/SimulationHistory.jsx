import React from 'react'
import { Clock } from 'lucide-react'

/**
 * Component for displaying simulation history
 * 
 * @param {Object} props - Component props
 * @param {Array} props.simulations - Array of simulation results
 * @param {Function} props.onSelect - Function to call when a simulation is selected
 * @param {string} props.title - Title for the history panel
 * @param {string} props.emptyMessage - Message to display when there are no simulations
 */
const SimulationHistory = ({ 
  simulations = [], 
  onSelect, 
  title = 'Simulation History',
  emptyMessage = 'No simulations available'
}) => {
  if (simulations.length === 0) {
    return (
      <div className="bg-surface p-lg rounded-lg shadow-card">
        <h3 className="text-lg font-semibold text-white mb-md">{title}</h3>
        <div className="text-center py-lg">
          <div className="text-gray-500 mb-md">
            <Clock className="w-8 h-8 mx-auto opacity-50" />
          </div>
          <p className="text-gray-400">{emptyMessage}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="bg-surface p-lg rounded-lg shadow-card">
      <h3 className="text-lg font-semibold text-white mb-md">{title}</h3>
      <div className="space-y-sm max-h-60 overflow-y-auto">
        {simulations.map((sim, index) => (
          <button
            key={index}
            onClick={() => onSelect(sim)}
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
    </div>
  )
}

export default SimulationHistory

