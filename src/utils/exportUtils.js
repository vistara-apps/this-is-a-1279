/**
 * exportUtils.js
 * 
 * Utility functions for exporting simulation data in various formats
 */

/**
 * Exports simulation data as JSON
 * 
 * @param {Object} simulation - The simulation data to export
 * @returns {string} The JSON string representation of the simulation
 */
export const exportAsJson = (simulation) => {
  return JSON.stringify(simulation, null, 2);
};

/**
 * Exports simulation data as CSV
 * 
 * @param {Object} simulation - The simulation data to export
 * @returns {string} The CSV string representation of the simulation
 */
export const exportAsCsv = (simulation) => {
  // Extract vote distribution data
  const voteDistributionRows = simulation.voteDistribution.map(vote => {
    return {
      option: vote.option,
      votes: vote.votes,
      percentage: vote.percentage
    };
  });
  
  // Create CSV header
  let csv = 'Option,Votes,Percentage\n';
  
  // Add vote distribution rows
  voteDistributionRows.forEach(row => {
    csv += `"${row.option}",${row.votes},${row.percentage}\n`;
  });
  
  return csv;
};

/**
 * Exports simulation timeline data as CSV
 * 
 * @param {Object} simulation - The simulation data to export
 * @returns {string} The CSV string representation of the timeline
 */
export const exportTimelineAsCsv = (simulation) => {
  if (!simulation.votingTimeline) {
    return '';
  }
  
  // Create CSV header
  let csv = 'Day,Votes,Label\n';
  
  // Add timeline rows
  simulation.votingTimeline.forEach(day => {
    csv += `${day.day},${day.votes},"${day.label}"\n`;
  });
  
  return csv;
};

/**
 * Downloads data as a file
 * 
 * @param {string} data - The data to download
 * @param {string} filename - The filename to use
 * @param {string} type - The MIME type of the file
 */
export const downloadFile = (data, filename, type = 'application/json') => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Exports and downloads simulation data in the specified format
 * 
 * @param {Object} simulation - The simulation data to export
 * @param {string} format - The format to export as ('json' or 'csv')
 */
export const exportAndDownload = (simulation, format = 'json') => {
  const timestamp = new Date().toISOString().slice(0, 10);
  
  if (format === 'json') {
    const jsonData = exportAsJson(simulation);
    downloadFile(
      jsonData, 
      `solana-vote-simulation-${timestamp}.json`, 
      'application/json'
    );
  } else if (format === 'csv') {
    const csvData = exportAsCsv(simulation);
    downloadFile(
      csvData, 
      `solana-vote-distribution-${timestamp}.csv`, 
      'text/csv'
    );
    
    // Also export timeline if available
    if (simulation.votingTimeline) {
      const timelineData = exportTimelineAsCsv(simulation);
      downloadFile(
        timelineData, 
        `solana-vote-timeline-${timestamp}.csv`, 
        'text/csv'
      );
    }
  }
};

