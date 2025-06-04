import React from 'react';
import { Cpu, HardDrive, MonitorSmartphone, Palette } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const SystemInfoCard: React.FC = () => {
  const { systemInfo, theme } = useApp();

  const systemItems = [
    { 
      label: 'System', 
      icon: <Cpu size={20} />, 
      items: [
        { key: 'Hostname', value: systemInfo.hostname },
        { key: 'Base Install', value: systemInfo.baseInstall },
        { key: 'Kernel', value: systemInfo.kernel },
        { key: 'Bootloader', value: systemInfo.bootloader },
      ]
    },
    { 
      label: 'Display', 
      icon: <MonitorSmartphone size={20} />, 
      items: [
        { key: 'Login Manager', value: systemInfo.loginManager },
      ]
    },
    { 
      label: 'Appearance', 
      icon: <Palette size={20} />, 
      items: [
        { key: 'Font', value: systemInfo.font },
        { key: 'Theme', value: systemInfo.theme },
        { key: 'Icon Theme', value: systemInfo.iconTheme },
        { key: 'Cursor Theme', value: systemInfo.cursorTheme },
      ]
    },
  ];

  return (
    <div className="rounded-lg overflow-hidden shadow-md" style={{ backgroundColor: theme.bg.primary }}>
      <div 
        className="px-6 py-4 border-b"
        style={{ 
          backgroundColor: theme.bg.secondary,
          borderColor: theme.border.primary
        }}
      >
        <h2 className="text-xl font-bold flex items-center" style={{ color: theme.fg.primary }}>
          <HardDrive className="mr-2" size={20} style={{ color: theme.accent.blue }} />
          System Information
        </h2>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {systemItems.map((section) => (
          <div 
            key={section.label} 
            className="p-4 rounded-lg"
            style={{ backgroundColor: theme.bg.tertiary }}
          >
            <h3 className="text-lg font-semibold mb-3 flex items-center" style={{ color: theme.accent.blue }}>
              {section.icon}
              <span className="ml-2">{section.label}</span>
            </h3>
            <div className="space-y-2">
              {section.items.map((item) => (
                <div key={item.key} className="flex justify-between">
                  <span style={{ color: theme.fg.secondary }}>
                    {item.key}:
                  </span>
                  <span style={{ color: theme.fg.primary }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemInfoCard;