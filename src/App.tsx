import React, { useState } from 'react';
import { Shield, Layers, Menu, X, Github, Zap } from 'lucide-react';
import { SteganographyPanel } from './components/SteganographyPanel';
import { CompressionPanel } from './components/CompressionPanel';
import { Sidebar } from './components/Sidebar';

function App() {
  const [activeTab, setActiveTab] = useState<'steganography' | 'compression'>('steganography');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-white hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-400 rounded-xl blur opacity-75"></div>
                  <div className="relative p-2 bg-black rounded-xl">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">CompStegano</h1>
                  <p className="text-xs text-gray-400">Masking & Filtering Suite</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-1 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('steganography')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === 'steganography'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Steganography</span>
                </button>
                <button
                  onClick={() => setActiveTab('compression')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === 'compression'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span className="font-medium">Compression</span>
                </button>
              </div>
              
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="p-6">
            {activeTab === 'steganography' && <SteganographyPanel />}
            {activeTab === 'compression' && <CompressionPanel />}
          </div>
        </main>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-700 p-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('steganography')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
              activeTab === 'steganography'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Steganography</span>
          </button>
          <button
            onClick={() => setActiveTab('compression')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
              activeTab === 'compression'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span className="text-sm font-medium">Compression</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-64">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-400 rounded-lg blur opacity-75"></div>
                <div className="relative p-2 bg-black rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="text-lg font-semibold text-white">CompStegano</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Advanced masking and filtering algorithms for secure media processing
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>Masking Algorithm</span>
              <span>•</span>
              <span>Filtering Techniques</span>
              <span>•</span>
              <span>Real-time Processing</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;