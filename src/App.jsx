import React from 'react'
import AppShell from './components/AppShell'
import VoteSimulator from './components/VoteSimulator'
import { NotificationProvider } from './context/NotificationContext'

function App() {
  return (
    <NotificationProvider>
      <AppShell>
        <div className="max-w-5xl mx-auto">
          <header className="mb-xl">
            <h1 className="text-4xl font-semibold text-white mb-md">Solana Vote Tester</h1>
            <p className="text-gray-400 text-base leading-7">
              A free and easy way for developers to test their Solana voting applications before deployment.
              Configure vote parameters, simulate voting behavior, and analyze results without spending real SOL.
            </p>
          </header>
          
          <VoteSimulator />
          
          <footer className="mt-xl pt-lg border-t border-gray-700 text-center text-sm text-gray-500">
            <p>Solana Vote Tester - Free Solana vote testing for developers</p>
            <p className="mt-sm">
              <a 
                href="https://github.com/vistara-apps/this-is-a-1279" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                GitHub Repository
              </a>
            </p>
          </footer>
        </div>
      </AppShell>
    </NotificationProvider>
  )
}

export default App
