import React from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { theme, systemInfo, refreshSystemInfo } = useApp();

  return (
    <header 
      className="p-4 flex justify-between items-center"
      style={{ 
        backgroundColor: theme.bg.secondary,
        borderBottom: `1px solid ${theme.border.primary}`
      }}
    >
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold" style={{ color: theme.accent.blue }}>
          {systemInfo.system.hostname}
        </h1>
        <span 
          className="px-2 py-1 rounded text-sm"
          style={{ 
            backgroundColor: theme.bg.tertiary,
            color: theme.fg.secondary
          }}
        >
          {systemInfo.system.baseInstall}
        </span>
      </div>
      
      <button
        onClick={refreshSystemInfo}
        className="px-3 py-1 rounded flex items-center gap-2 hover:opacity-80 transition-opacity"
        style={{ 
          backgroundColor: theme.bg.tertiary,
          color: theme.accent.blue
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
          />
        </svg>
        Refresh
      </button>
    </header>
  );
}; 