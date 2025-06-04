import React from 'react';
import { useApp } from '../context/AppContext';
import { Info } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme } = useApp();

  return (
    <div className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: theme.bg.primary }}>
      <div 
        className="px-6 py-4 border-b"
        style={{ 
          backgroundColor: theme.bg.secondary,
          borderColor: theme.border.primary
        }}
      >
        <h2 className="text-xl font-bold" style={{ color: theme.fg.primary }}>Settings</h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: theme.accent.blue }}>About</h3>
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: theme.bg.tertiary }}
            >
              <div className="flex items-center mb-4">
                <Info size={20} className="mr-2" style={{ color: theme.accent.blue }} />
                <p className="font-medium" style={{ color: theme.fg.primary }}>Arch Linux System Manager v1.0</p>
              </div>
              <p style={{ color: theme.fg.secondary }}>
                A tool to help you keep track of installed packages, system information, and generate installation scripts for your Arch Linux system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;