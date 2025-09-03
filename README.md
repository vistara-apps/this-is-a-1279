# Solana Vote Tester

![Solana Vote Tester](https://i.imgur.com/5cf0d43f.jpeg)

A free and easy way for developers to test their Solana voting applications before deployment, eliminating the cost barrier during development.

## Features

- **Vote Simulation**: Simulates a Solana vote transaction without requiring real SOL or network fees
- **Parameter Configuration**: Configure vote parameters such as vote weight, quorum, and voting period
- **Outcome Visualization**: View detailed results of the simulated vote with interactive visualizations
- **Advanced Options**: Test token-based voting, delegation, and custom proposal thresholds
- **Export & Save**: Save simulation results and export data in JSON or CSV format

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/vistara-apps/this-is-a-1279.git
   cd this-is-a-1279
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Configure Vote Parameters**:
   - Set the vote weight, quorum percentage, and voting period
   - Define the total number of eligible voters
   - Add or remove vote options
   - Enable advanced options like token-based voting and delegation

2. **Run Simulation**:
   - Click the "Run Vote Simulation" button to generate results
   - View the outcome, including vote distribution and participation rate
   - See if the vote passed based on quorum and threshold requirements

3. **Analyze Results**:
   - Explore detailed visualizations of the vote results
   - View the voting timeline to see how votes were cast over time
   - Analyze the impact of delegation and token-based voting

4. **Save and Export**:
   - Save simulations for future reference
   - Export results in JSON or CSV format for further analysis

## Documentation

- [API Documentation](docs/API.md): Detailed documentation of the simulation API
- [Architecture](docs/ARCHITECTURE.md): Overview of the application architecture
- [Contributing](docs/CONTRIBUTING.md): Guidelines for contributing to the project
- [Deployment](docs/DEPLOYMENT.md): Instructions for deploying the application

## Technology Stack

- **Frontend**: React, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks and Context API
- **Storage**: Local Storage

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Solana Foundation for their governance documentation
- The React and Tailwind CSS communities for their excellent tools and resources

