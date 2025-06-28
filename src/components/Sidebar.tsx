import React from 'react';
import { Shield, Layers, Settings, Info, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  activeTab: 'steganography' | 'compression';
  setActiveTab: (tab: 'steganography' | 'compression') => void;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, setActiveTab, onClose }) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 border-r border-gray-700 transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-6">
          <div className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('steganography');
                onClose();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'steganography'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Shield className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Steganography</div>
                <div className="text-xs opacity-75">Hide & Extract Messages</div>
              </div>
            </button>
            
            <button
              onClick={() => {
                setActiveTab('compression');
                onClose();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === 'compression'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Layers className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Compression</div>
                <div className="text-xs opacity-75">Optimize File Sizes</div>
              </div>
            </button>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                <Info className="w-5 h-5" />
                <span>About</span>
              </button>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-white mb-2">Algorithm Info</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Using advanced masking and filtering techniques for secure data embedding and extraction.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};