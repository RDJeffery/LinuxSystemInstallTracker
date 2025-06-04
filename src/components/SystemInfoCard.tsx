import React from 'react';
import { useApp } from '../context/AppContext';

export const SystemInfoCard: React.FC = () => {
  const { systemInfo, theme } = useApp();

  return (
    <div className="p-4 rounded-lg" style={{ backgroundColor: theme.bg.secondary }}>
      <h2 className="text-xl mb-4" style={{ color: theme.accent.blue }}>System Information</h2>
      
      {/* Basic System Info */}
      <div className="mb-6">
        <h3 className="text-lg mb-2" style={{ color: theme.accent.green }}>System</h3>
        <div className="grid grid-cols-2 gap-2">
          <div style={{ color: theme.fg.secondary }}>Hostname:</div>
          <div style={{ color: theme.fg.primary }}>{systemInfo.system.hostname}</div>
          
          <div style={{ color: theme.fg.secondary }}>Base Install:</div>
          <div style={{ color: theme.fg.primary }}>{systemInfo.system.baseInstall}</div>
          
          <div style={{ color: theme.fg.secondary }}>Kernel:</div>
          <div style={{ color: theme.fg.primary }}>{systemInfo.system.kernel}</div>
          
          <div style={{ color: theme.fg.secondary }}>Bootloader:</div>
          <div style={{ color: theme.fg.primary }}>{systemInfo.system.bootloader}</div>
          
          <div style={{ color: theme.fg.secondary }}>Login Manager:</div>
          <div style={{ color: theme.fg.primary }}>{systemInfo.system.loginManager}</div>
        </div>
      </div>

      {/* Users */}
      <div className="mb-6">
        <h3 className="text-lg mb-2" style={{ color: theme.accent.green }}>Users</h3>
        <div className="flex flex-wrap gap-2">
          {systemInfo.users.map((user, index) => (
            <span 
              key={index}
              className="px-2 py-1 rounded"
              style={{ 
                backgroundColor: theme.bg.tertiary,
                color: theme.fg.primary
              }}
            >
              {user}
            </span>
          ))}
        </div>
      </div>

      {/* Drivers */}
      <div className="mb-6">
        <h3 className="text-lg mb-2" style={{ color: theme.accent.green }}>Drivers</h3>
        <div className="grid grid-cols-2 gap-2">
          <div style={{ color: theme.fg.secondary }}>Graphics:</div>
          <div style={{ color: theme.fg.primary }}>{systemInfo.drivers.graphics}</div>
          
          <div style={{ color: theme.fg.secondary }}>Audio:</div>
          <div style={{ color: theme.fg.primary }}>{systemInfo.drivers.audio}</div>
        </div>
      </div>

      {/* Packages */}
      <div className="mb-6">
        <h3 className="text-lg mb-2" style={{ color: theme.accent.green }}>Packages</h3>
        {Object.entries(systemInfo.packages).map(([category, packages]) => (
          <div key={category} className="mb-4">
            <h4 className="text-md mb-2" style={{ color: theme.accent.purple }}>
              {category.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <div className="flex flex-wrap gap-2">
              {packages.map((pkg, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary
                  }}
                >
                  {pkg}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Themes */}
      <div>
        <h3 className="text-lg mb-2" style={{ color: theme.accent.green }}>Themes</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-md mb-2" style={{ color: theme.accent.purple }}>Fonts</h4>
            <div className="flex flex-wrap gap-2">
              {systemInfo.themes.fonts.map((font, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary
                  }}
                >
                  {font}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-md mb-2" style={{ color: theme.accent.purple }}>Themes</h4>
            <div className="flex flex-wrap gap-2">
              {systemInfo.themes.themes.map((theme, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary
                  }}
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-md mb-2" style={{ color: theme.accent.purple }}>Icon Themes</h4>
            <div className="flex flex-wrap gap-2">
              {systemInfo.themes.iconThemes.map((iconTheme, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary
                  }}
                >
                  {iconTheme}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-md mb-2" style={{ color: theme.accent.purple }}>Cursor Themes</h4>
            <div className="flex flex-wrap gap-2">
              {systemInfo.themes.cursorThemes.map((cursorTheme, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary
                  }}
                >
                  {cursorTheme}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 