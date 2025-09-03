# Solana Vote Tester API Documentation

This document provides comprehensive documentation for the Solana Vote Tester API, which allows developers to simulate Solana voting behavior without using real SOL or network fees.

## Overview

The Solana Vote Tester API provides a way to simulate Solana governance votes with various parameters. It allows developers to test their voting applications in a realistic environment before deploying to the Solana network.

## Vote Simulation Service

### `simulateVote(params)`

Simulates a Solana vote based on the provided parameters.

#### Parameters

| Parameter | Type | Description | Required | Default | Range |
|-----------|------|-------------|----------|---------|-------|
| voteWeight | number | Weight assigned to each vote | Yes | 100 | 1-1000 |
| quorum | number | Minimum participation required for valid vote (%) | Yes | 50 | 1-100 |
| votingPeriod | number | Duration of the voting period in days | Yes | 7 | 1-30 |
| totalVoters | number | Total number of eligible voters | Yes | 1000 | 10-10000 |
| voteOptions | string[] | Array of voting options | Yes | ['Option A', 'Option B', 'Option C'] | Min 2 options |
| proposalThreshold | number | Minimum threshold for proposal acceptance (%) | No | 50 | 1-100 |
| useTokenWeights | boolean | Whether to use token-based vote weighting | No | false | - |
| allowDelegation | boolean | Whether to allow vote delegation | No | false | - |
| delegationRate | number | Percentage of voters who delegate their votes | No | 20 | 0-100 |

#### Returns

The function returns a Promise that resolves to a simulation result object with the following properties:

```javascript
{
  totalVotes: number,              // Total number of votes cast
  totalVoters: number,             // Total number of eligible voters
  participationRate: number,       // Percentage of eligible voters who participated
  quorumMet: boolean,              // Whether the quorum requirement was met
  quorumPercentage: number,        // The quorum percentage required
  thresholdMet: boolean,           // Whether the proposal threshold was met
  thresholdPercentage: number,     // The proposal threshold percentage required
  winningOption: string,           // The option that received the most votes
  winningVotes: number,            // Number of votes for the winning option
  winningPercentage: number,       // Percentage of votes for the winning option
  voteDistribution: Array,         // Distribution of votes among options
  effectiveVotingPower: number,    // Total effective voting power
  delegationStats: Object|null,    // Statistics about delegation (if enabled)
  votingTimeline: Array,           // Timeline of votes over the voting period
  timestamp: string,               // ISO timestamp of when the simulation was run
  status: string,                  // Final status of the vote (Passed/Failed)
  simulationParameters: Object     // The parameters used for the simulation
}
```

#### Example

```javascript
import { simulateVote } from '../services/VoteSimulationService';

// Define simulation parameters
const params = {
  voteWeight: 100,
  quorum: 50,
  votingPeriod: 7,
  totalVoters: 1000,
  voteOptions: ['Proposal A', 'Proposal B', 'Proposal C'],
  proposalThreshold: 50,
  useTokenWeights: true,
  allowDelegation: true,
  delegationRate: 20
};

// Run simulation
const result = await simulateVote(params);
console.log(result);
```

### `validateSimulationParams(params)`

Validates vote simulation parameters.

#### Parameters

The same parameters object as `simulateVote`.

#### Returns

```javascript
{
  isValid: boolean,        // Whether the parameters are valid
  errors: Object|undefined // Object with error messages for invalid parameters
}
```

#### Example

```javascript
import { validateSimulationParams } from '../services/VoteSimulationService';

const params = {
  voteWeight: 100,
  quorum: 50,
  votingPeriod: 7,
  totalVoters: 1000,
  voteOptions: ['Proposal A', 'Proposal B']
};

const validation = validateSimulationParams(params);
if (!validation.isValid) {
  console.error('Invalid parameters:', validation.errors);
}
```

## Storage Service

### `saveSimulation(simulation)`

Saves a simulation to local storage.

#### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| simulation | Object | The simulation result to save | Yes |

#### Returns

`boolean` - Whether the save was successful.

#### Example

```javascript
import { saveSimulation } from '../services/StorageService';

// Save the current simulation
const saved = saveSimulation(simulationResult);
if (saved) {
  console.log('Simulation saved successfully');
}
```

### `getSimulations()`

Gets all saved simulations from local storage.

#### Returns

`Array` - Array of saved simulations.

#### Example

```javascript
import { getSimulations } from '../services/StorageService';

// Get all saved simulations
const savedSimulations = getSimulations();
console.log(`Found ${savedSimulations.length} saved simulations`);
```

### `clearSimulations()`

Clears all saved simulations from local storage.

#### Returns

`boolean` - Whether the clear was successful.

#### Example

```javascript
import { clearSimulations } from '../services/StorageService';

// Clear all saved simulations
const cleared = clearSimulations();
if (cleared) {
  console.log('All simulations cleared');
}
```

### `deleteSimulation(simulationId)`

Deletes a specific simulation from local storage.

#### Parameters

| Parameter | Type | Description | Required |
|-----------|------|-------------|----------|
| simulationId | string | The ID (timestamp) of the simulation to delete | Yes |

#### Returns

`boolean` - Whether the deletion was successful.

#### Example

```javascript
import { deleteSimulation } from '../services/StorageService';

// Delete a specific simulation
const deleted = deleteSimulation(simulation.timestamp);
if (deleted) {
  console.log('Simulation deleted successfully');
}
```

## Export Utilities

### `exportAndDownload(simulation, format)`

Exports and downloads simulation data in the specified format.

#### Parameters

| Parameter | Type | Description | Required | Default |
|-----------|------|-------------|----------|---------|
| simulation | Object | The simulation data to export | Yes | - |
| format | string | The format to export as ('json' or 'csv') | No | 'json' |

#### Example

```javascript
import { exportAndDownload } from '../utils/exportUtils';

// Export as JSON
exportAndDownload(simulationResult, 'json');

// Export as CSV
exportAndDownload(simulationResult, 'csv');
```

## Notification System

### `useNotification()`

Hook for using the notification system.

#### Returns

```javascript
{
  notifications: Array,                // Array of current notifications
  addNotification: Function,           // Add a custom notification
  removeNotification: Function,        // Remove a notification by ID
  success: Function,                   // Show a success notification
  error: Function,                     // Show an error notification
  warning: Function,                   // Show a warning notification
  info: Function,                      // Show an info notification
  clearAll: Function                   // Clear all notifications
}
```

#### Example

```javascript
import { useNotification } from '../context/NotificationContext';

function MyComponent() {
  const { success, error, info, warning } = useNotification();
  
  const handleAction = () => {
    try {
      // Do something
      success('Action completed successfully');
    } catch (err) {
      error('An error occurred');
    }
  };
  
  return (
    <button onClick={handleAction}>
      Perform Action
    </button>
  );
}
```

## Validation Utilities

### `validateVoteParams(params)`

Validates a complete set of vote simulation parameters.

#### Parameters

The same parameters object as `simulateVote`.

#### Returns

```javascript
{
  isValid: boolean,        // Whether the parameters are valid
  errors: Object|undefined // Object with error messages for invalid parameters
}
```

#### Example

```javascript
import { validateVoteParams } from '../utils/validators';

const params = {
  voteWeight: 100,
  quorum: 50,
  votingPeriod: 7,
  totalVoters: 1000,
  voteOptions: ['Proposal A', 'Proposal B']
};

const validation = validateVoteParams(params);
if (!validation.isValid) {
  console.error('Invalid parameters:', validation.errors);
}
```

