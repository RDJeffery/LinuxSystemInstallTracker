import React from 'react';
import { useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { systemInfo, theme } = useApp();

  // Get page title based on current path
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/') return 'Dashboard';
    if (path === '/system') return 'System Information';
    if (path.startsWith('/categories')) return 'Categories';
    if (path === '/users') return 'Users';
    if (path === '/script') return 'Generate Installation Script';
    if (path === '/settings') return 'Settings';
    
    // For category detail pages
    if (path.match(/\/category\/[\w-]+/)) {
      const categoryId = path.split('/').pop();
      return `Category: ${categoryId?.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`;
    }
    
    return 'Arch System Manager';
  };

  return (
    <header 
      className="sticky top-0 z-20 px-6 py-4 border-b"
      style={{ 
        backgroundColor: theme.bg.secondary,
        borderColor: theme.border.primary
      }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold" style={{ color: theme.fg.primary }}>
          {getPageTitle()}
        </h1>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm" style={{ color: theme.fg.secondary }}>
            <span className="font-medium" style={{ color: theme.fg.primary }}>
              {systemInfo.system.hostname}
            </span>
            <span className="mx-2">•</span>
            <span>{systemInfo.system.baseInstall}</span>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="p-2 rounded-md transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: theme.bg.tertiary,
              color: theme.fg.primary
            }}
            title="Refresh System Information"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 21h5v-5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;