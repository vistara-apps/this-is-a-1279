/**
 * VoteSimulationService.js
 * 
 * This service handles the business logic for simulating Solana votes.
 * It provides realistic simulation of Solana governance mechanics including
 * vote weight calculations, quorum determination, and vote distribution.
 */

/**
 * Simulates a Solana vote based on the provided parameters
 * 
 * @param {Object} params - The vote simulation parameters
 * @param {number} params.voteWeight - Weight assigned to each vote (1-1000)
 * @param {number} params.quorum - Minimum participation required for valid vote (1-100%)
 * @param {number} params.votingPeriod - Duration of the voting period in days (1-30)
 * @param {number} params.totalVoters - Total number of eligible voters (10-10000)
 * @param {string[]} params.voteOptions - Array of voting options
 * @param {number} params.proposalThreshold - Minimum threshold for proposal acceptance (1-100%)
 * @param {boolean} params.useTokenWeights - Whether to use token-based vote weighting
 * @param {boolean} params.allowDelegation - Whether to allow vote delegation
 * @param {number} params.delegationRate - Percentage of voters who delegate their votes (0-100%)
 * @returns {Object} The simulation result
 */
export const simulateVote = async (params) => {
  // Destructure parameters with defaults
  const {
    voteWeight = 100,
    quorum = 50,
    votingPeriod = 7,
    totalVoters = 1000,
    voteOptions = ['Option A', 'Option B', 'Option C'],
    proposalThreshold = 50,
    useTokenWeights = false,
    allowDelegation = false,
    delegationRate = 20,
  } = params;

  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Calculate participation based on voting period (longer period = higher participation)
  // and other factors like proposal complexity
  const baseParticipation = Math.min(0.3 + (votingPeriod / 30) * 0.5, 0.8);
  const participationVariance = Math.random() * 0.2 - 0.1; // +/- 10%
  const participationRate = Math.max(0.1, Math.min(0.9, baseParticipation + participationVariance));
  
  // Calculate total votes
  let totalVotes = Math.floor(totalVoters * participationRate);
  
  // Calculate delegation effects if enabled
  let delegatedVotes = 0;
  let activeDelegates = 0;
  
  if (allowDelegation) {
    // Calculate how many voters delegate their votes
    const delegators = Math.floor(totalVoters * (delegationRate / 100));
    
    // Delegates are typically more engaged, so they have higher participation
    activeDelegates = Math.floor(delegators * 0.7);
    
    // Delegated votes are concentrated among fewer voters (delegates)
    delegatedVotes = Math.floor(activeDelegates * voteWeight * 1.5);
    
    // Adjust total votes to account for delegation
    // (some votes are now delegated instead of direct)
    totalVotes = Math.max(totalVotes - Math.floor(delegators * participationRate), 0) + activeDelegates;
  }

  // Calculate effective voting power
  const effectiveVotingPower = totalVotes * voteWeight + (allowDelegation ? delegatedVotes : 0);
  
  // Distribute votes among options with realistic patterns
  // First option often gets slightly more votes in real elections
  const votes = voteOptions.map((option, index) => {
    // Base weight with some randomness
    let baseWeight = Math.random();
    
    // First option gets a slight boost (incumbent advantage)
    if (index === 0) baseWeight += 0.2;
    
    // Last option typically gets fewer votes
    if (index === voteOptions.length - 1) baseWeight *= 0.8;
    
    return {
      option,
      votes: 0, // Will be calculated after all weights are determined
      percentage: 0, // Will be calculated after all votes are distributed
      voterCount: 0, // Number of unique voters (for token-weighted voting)
    };
  });
  
  // Calculate total weight for normalization
  const totalWeight = votes.reduce((sum, v) => sum + v.baseWeight, 0);
  
  // Distribute votes based on weights
  let remainingVotes = totalVotes;
  
  // Distribute all but the last option's votes
  for (let i = 0; i < votes.length - 1; i++) {
    const voteShare = Math.floor(totalVotes * (votes[i].baseWeight / totalWeight));
    votes[i].votes = voteShare;
    votes[i].voterCount = useTokenWeights ? 
      Math.floor(voteShare / (Math.random() * 2 + 1)) : // Some voters have more tokens
      voteShare; // One vote per voter
    remainingVotes -= voteShare;
  }
  
  // Assign remaining votes to the last option to ensure total adds up
  votes[votes.length - 1].votes = remainingVotes;
  votes[votes.length - 1].voterCount = useTokenWeights ?
    Math.floor(remainingVotes / (Math.random() * 2 + 1)) :
    remainingVotes;
  
  // Calculate percentages
  const totalDistributedVotes = votes.reduce((sum, v) => sum + v.votes, 0);
  votes.forEach(v => {
    v.percentage = (v.votes / totalDistributedVotes) * 100;
  });
  
  // Sort by votes to determine winner
  votes.sort((a, b) => b.votes - a.votes);
  
  // Check if quorum was met
  const quorumMet = (participationRate * 100) >= quorum;
  
  // Check if proposal threshold was met
  const thresholdMet = votes[0].percentage >= proposalThreshold;
  
  // Determine final status
  let status = 'Failed';
  if (!quorumMet) {
    status = 'Failed (Quorum not met)';
  } else if (!thresholdMet) {
    status = 'Failed (Threshold not met)';
  } else {
    status = 'Passed';
  }
  
  // Create time-based voting pattern (early votes, mid-period lull, late surge)
  const votingTimeline = generateVotingTimeline(votingPeriod, totalVotes);
  
  // Return comprehensive simulation result
  return {
    totalVotes,
    totalVoters,
    participationRate: Math.round(participationRate * 100 * 100) / 100, // Two decimal places
    quorumMet,
    quorumPercentage: quorum,
    thresholdMet,
    thresholdPercentage: proposalThreshold,
    winningOption: votes[0].option,
    winningVotes: votes[0].votes,
    winningPercentage: Math.round(votes[0].percentage * 100) / 100,
    voteDistribution: votes,
    effectiveVotingPower,
    delegationStats: allowDelegation ? {
      delegators: Math.floor(totalVoters * (delegationRate / 100)),
      activeDelegates,
      delegatedVotes,
      delegationImpact: Math.round((delegatedVotes / effectiveVotingPower) * 100 * 100) / 100
    } : null,
    votingTimeline,
    timestamp: new Date().toISOString(),
    status,
    simulationParameters: {
      ...params,
      proposalThreshold,
      useTokenWeights,
      allowDelegation,
      delegationRate
    }
  };
};

/**
 * Generates a realistic voting timeline over the voting period
 * 
 * @param {number} votingPeriod - Voting period in days
 * @param {number} totalVotes - Total number of votes cast
 * @returns {Array} Array of daily vote counts
 */
function generateVotingTimeline(votingPeriod, totalVotes) {
  const timeline = [];
  
  // Common voting pattern: 
  // - Initial surge (25-30%)
  // - Mid-period lull (30-40%)
  // - Final surge before deadline (30-45%)
  
  const initialSurgePercentage = 0.25 + Math.random() * 0.05;
  const finalSurgePercentage = 0.3 + Math.random() * 0.15;
  const midPeriodPercentage = 1 - initialSurgePercentage - finalSurgePercentage;
  
  // Calculate votes per phase
  const initialVotes = Math.floor(totalVotes * initialSurgePercentage);
  const finalVotes = Math.floor(totalVotes * finalSurgePercentage);
  const midPeriodVotes = totalVotes - initialVotes - finalVotes;
  
  // Distribute initial surge (first 20% of voting period)
  const initialDays = Math.max(1, Math.floor(votingPeriod * 0.2));
  for (let i = 0; i < initialDays; i++) {
    const dayShare = i === 0 ? 0.5 : 0.5 / (initialDays - 1); // First day gets 50% of initial surge
    timeline.push({
      day: i + 1,
      votes: Math.floor(initialVotes * dayShare),
      label: `Day ${i + 1}`
    });
  }
  
  // Distribute mid-period votes (middle 60% of voting period)
  const midDays = Math.max(1, Math.floor(votingPeriod * 0.6));
  for (let i = 0; i < midDays; i++) {
    timeline.push({
      day: initialDays + i + 1,
      votes: Math.floor(midPeriodVotes / midDays),
      label: `Day ${initialDays + i + 1}`
    });
  }
  
  // Distribute final surge (last 20% of voting period)
  const finalDays = Math.max(1, votingPeriod - initialDays - midDays);
  for (let i = 0; i < finalDays; i++) {
    const dayShare = i === finalDays - 1 ? 0.6 : 0.4 / (finalDays - 1); // Last day gets 60% of final surge
    timeline.push({
      day: initialDays + midDays + i + 1,
      votes: Math.floor(finalVotes * dayShare),
      label: `Day ${initialDays + midDays + i + 1}`
    });
  }
  
  return timeline;
}

/**
 * Validates vote simulation parameters
 * 
 * @param {Object} params - The vote simulation parameters
 * @returns {Object} Validation result with isValid flag and any error messages
 */
export const validateSimulationParams = (params) => {
  const errors = {};
  
  // Validate voteWeight
  if (params.voteWeight < 1 || params.voteWeight > 1000) {
    errors.voteWeight = 'Vote weight must be between 1 and 1000';
  }
  
  // Validate quorum
  if (params.quorum < 1 || params.quorum > 100) {
    errors.quorum = 'Quorum must be between 1% and 100%';
  }
  
  // Validate votingPeriod
  if (params.votingPeriod < 1 || params.votingPeriod > 30) {
    errors.votingPeriod = 'Voting period must be between 1 and 30 days';
  }
  
  // Validate totalVoters
  if (params.totalVoters < 10 || params.totalVoters > 10000) {
    errors.totalVoters = 'Total voters must be between 10 and 10,000';
  }
  
  // Validate voteOptions
  if (!params.voteOptions || params.voteOptions.length < 2) {
    errors.voteOptions = 'At least 2 vote options are required';
  } else {
    // Check for empty options
    const emptyOptions = params.voteOptions.filter(option => !option.trim());
    if (emptyOptions.length > 0) {
      errors.voteOptions = 'Vote options cannot be empty';
    }
  }
  
  // Validate proposalThreshold if provided
  if (params.proposalThreshold !== undefined) {
    if (params.proposalThreshold < 1 || params.proposalThreshold > 100) {
      errors.proposalThreshold = 'Proposal threshold must be between 1% and 100%';
    }
  }
  
  // Validate delegationRate if delegation is enabled
  if (params.allowDelegation && params.delegationRate !== undefined) {
    if (params.delegationRate < 0 || params.delegationRate > 100) {
      errors.delegationRate = 'Delegation rate must be between 0% and 100%';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

