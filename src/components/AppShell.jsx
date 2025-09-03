import React from 'react'
import { Activity } from 'lucide-react'

const AppShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-white">
      <header className="border-b border-surface/50 bg-surface/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-lg">
          <div className="flex items-center gap-md">
            <div className="flex items-center gap-sm">
              <div className="p-sm bg-gradient-primary rounded-md">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white">Solana Vote Tester</h1>
                <p className="text-sm text-gray-400">Free Solana vote testing for developers</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-xl">
        {children}
      </main>
    </div>
  )
}

export default AppShell