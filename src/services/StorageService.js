/**
 * StorageService.js
 * 
 * Service for handling local storage of simulation data
 */

const STORAGE_KEY = 'solana-vote-tester-simulations';
const MAX_STORED_SIMULATIONS = 20;

/**
 * Saves a simulation to local storage
 * 
 * @param {Object} simulation - The simulation data to save
 * @returns {boolean} Whether the save was successful
 */
export const saveSimulation = (simulation) => {
  try {
    // Get existing simulations
    const existingSimulations = getSimulations();
    
    // Add new simulation to the beginning of the array
    const updatedSimulations = [simulation, ...existingSimulations].slice(0, MAX_STORED_SIMULATIONS);
    
    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSimulations));
    
    return true;
  } catch (error) {
    console.error('Error saving simulation:', error);
    return false;
  }
};

/**
 * Gets all saved simulations from local storage
 * 
 * @returns {Array} Array of saved simulations
 */
export const getSimulations = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    
    if (!storedData) {
      return [];
    }
    
    return JSON.parse(storedData);
  } catch (error) {
    console.error('Error retrieving simulations:', error);
    return [];
  }
};

/**
 * Clears all saved simulations from local storage
 * 
 * @returns {boolean} Whether the clear was successful
 */
export const clearSimulations = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing simulations:', error);
    return false;
  }
};

/**
 * Deletes a specific simulation from local storage
 * 
 * @param {string} simulationId - The ID (timestamp) of the simulation to delete
 * @returns {boolean} Whether the deletion was successful
 */
export const deleteSimulation = (simulationId) => {
  try {
    // Get existing simulations
    const existingSimulations = getSimulations();
    
    // Filter out the simulation to delete
    const updatedSimulations = existingSimulations.filter(
      sim => sim.timestamp !== simulationId
    );
    
    // Save the updated list
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSimulations));
    
    return true;
  } catch (error) {
    console.error('Error deleting simulation:', error);
    return false;
  }
};

/**
 * Gets a specific simulation from local storage
 * 
 * @param {string} simulationId - The ID (timestamp) of the simulation to get
 * @returns {Object|null} The simulation data or null if not found
 */
export const getSimulation = (simulationId) => {
  try {
    // Get existing simulations
    const existingSimulations = getSimulations();
    
    // Find the simulation with the matching ID
    return existingSimulations.find(sim => sim.timestamp === simulationId) || null;
  } catch (error) {
    console.error('Error getting simulation:', error);
    return null;
  }
};

