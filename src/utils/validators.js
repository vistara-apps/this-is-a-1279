/**
 * validators.js
 * 
 * Utility functions for input validation throughout the application
 */

/**
 * Validates a numeric input within a specified range
 * 
 * @param {number} value - The value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @param {boolean} allowEmpty - Whether to allow empty values
 * @returns {Object} Validation result with isValid flag and error message
 */
export const validateNumericRange = (value, min, max, allowEmpty = false) => {
  // Check for empty value if allowed
  if ((value === '' || value === null || value === undefined) && allowEmpty) {
    return { isValid: true };
  }
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid number' 
    };
  }
  
  // Check range
  if (numValue < min || numValue > max) {
    return { 
      isValid: false, 
      error: `Value must be between ${min} and ${max}` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validates a text input
 * 
 * @param {string} value - The value to validate
 * @param {number} minLength - Minimum allowed length
 * @param {number} maxLength - Maximum allowed length
 * @param {boolean} allowEmpty - Whether to allow empty values
 * @returns {Object} Validation result with isValid flag and error message
 */
export const validateText = (value, minLength = 1, maxLength = 100, allowEmpty = false) => {
  // Check for empty value if allowed
  if ((value === '' || value === null || value === undefined) && allowEmpty) {
    return { isValid: true };
  }
  
  // Convert to string if it's not already
  const strValue = String(value);
  
  // Check length
  if (strValue.length < minLength) {
    return { 
      isValid: false, 
      error: `Text must be at least ${minLength} characters` 
    };
  }
  
  if (strValue.length > maxLength) {
    return { 
      isValid: false, 
      error: `Text cannot exceed ${maxLength} characters` 
    };
  }
  
  return { isValid: true };
};

/**
 * Validates an array of options
 * 
 * @param {Array} options - The array to validate
 * @param {number} minOptions - Minimum number of options
 * @param {number} maxOptions - Maximum number of options
 * @returns {Object} Validation result with isValid flag and error message
 */
export const validateOptions = (options, minOptions = 2, maxOptions = 10) => {
  // Check if it's an array
  if (!Array.isArray(options)) {
    return { 
      isValid: false, 
      error: 'Options must be an array' 
    };
  }
  
  // Check number of options
  if (options.length < minOptions) {
    return { 
      isValid: false, 
      error: `At least ${minOptions} options are required` 
    };
  }
  
  if (options.length > maxOptions) {
    return { 
      isValid: false, 
      error: `Cannot have more than ${maxOptions} options` 
    };
  }
  
  // Check for empty options
  const emptyOptions = options.filter(option => !String(option).trim());
  if (emptyOptions.length > 0) {
    return { 
      isValid: false, 
      error: 'Options cannot be empty' 
    };
  }
  
  return { isValid: true };
};

/**
 * Validates a complete set of vote simulation parameters
 * 
 * @param {Object} params - The parameters to validate
 * @returns {Object} Validation result with isValid flag and errors object
 */
export const validateVoteParams = (params) => {
  const errors = {};
  
  // Validate voteWeight
  const voteWeightValidation = validateNumericRange(params.voteWeight, 1, 1000);
  if (!voteWeightValidation.isValid) {
    errors.voteWeight = voteWeightValidation.error;
  }
  
  // Validate quorum
  const quorumValidation = validateNumericRange(params.quorum, 1, 100);
  if (!quorumValidation.isValid) {
    errors.quorum = quorumValidation.error;
  }
  
  // Validate votingPeriod
  const votingPeriodValidation = validateNumericRange(params.votingPeriod, 1, 30);
  if (!votingPeriodValidation.isValid) {
    errors.votingPeriod = votingPeriodValidation.error;
  }
  
  // Validate totalVoters
  const totalVotersValidation = validateNumericRange(params.totalVoters, 10, 10000);
  if (!totalVotersValidation.isValid) {
    errors.totalVoters = totalVotersValidation.error;
  }
  
  // Validate voteOptions
  const voteOptionsValidation = validateOptions(params.voteOptions, 2, 10);
  if (!voteOptionsValidation.isValid) {
    errors.voteOptions = voteOptionsValidation.error;
  }
  
  // Validate proposalThreshold if provided
  if (params.proposalThreshold !== undefined) {
    const thresholdValidation = validateNumericRange(params.proposalThreshold, 1, 100);
    if (!thresholdValidation.isValid) {
      errors.proposalThreshold = thresholdValidation.error;
    }
  }
  
  // Validate delegationRate if delegation is enabled
  if (params.allowDelegation && params.delegationRate !== undefined) {
    const delegationRateValidation = validateNumericRange(params.delegationRate, 0, 100);
    if (!delegationRateValidation.isValid) {
      errors.delegationRate = delegationRateValidation.error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

