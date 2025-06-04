import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, XCircle } from 'lucide-react';

const SystemInfoEditor: React.FC = () => {
  const { systemInfo, theme } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    hostname: systemInfo.system.hostname,
    baseInstall: systemInfo.system.baseInstall,
    kernel: systemInfo.system.kernel,
    bootloader: systemInfo.system.bootloader,
    loginManager: systemInfo.system.loginManager,
    font: systemInfo.system.font,
    theme: systemInfo.system.theme,
    iconTheme: systemInfo.system.iconTheme,
    cursorTheme: systemInfo.system.cursorTheme
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      hostname: systemInfo.system.hostname,
      baseInstall: systemInfo.system.baseInstall,
      kernel: systemInfo.system.kernel,
      bootloader: systemInfo.system.bootloader,
      loginManager: systemInfo.system.loginManager,
      font: systemInfo.system.font,
      theme: systemInfo.system.theme,
      iconTheme: systemInfo.system.iconTheme,
      cursorTheme: systemInfo.system.cursorTheme
    });
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: theme.bg.primary }}>
      <div 
        className="px-6 py-4 border-b flex justify-between items-center"
        style={{ 
          backgroundColor: theme.bg.secondary,
          borderColor: theme.border.primary
        }}
      >
        <h2 className="text-xl font-bold" style={{ color: theme.fg.primary }}>System Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: theme.bg.tertiary,
              color: theme.accent.blue
            }}
          >
            Edit
          </button>
        )}
      </div>

      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label 
                  htmlFor="hostname" 
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.fg.secondary }}
                >
                  Hostname
                </label>
                <input
                  type="text"
                  id="hostname"
                  name="hostname"
                  value={formData.hostname}
                  onChange={handleChange}
                  className="w-full rounded-md px-3 py-2"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary,
                    border: `1px solid ${theme.border.primary}`
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="baseInstall" 
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.fg.secondary }}
                >
                  Base Install
                </label>
                <input
                  type="text"
                  id="baseInstall"
                  name="baseInstall"
                  value={formData.baseInstall}
                  onChange={handleChange}
                  className="w-full rounded-md px-3 py-2"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary,
                    border: `1px solid ${theme.border.primary}`
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="kernel" 
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.fg.secondary }}
                >
                  Kernel
                </label>
                <input
                  type="text"
                  id="kernel"
                  name="kernel"
                  value={formData.kernel}
                  onChange={handleChange}
                  className="w-full rounded-md px-3 py-2"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary,
                    border: `1px solid ${theme.border.primary}`
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="bootloader" 
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.fg.secondary }}
                >
                  Bootloader
                </label>
                <input
                  type="text"
                  id="bootloader"
                  name="bootloader"
                  value={formData.bootloader}
                  onChange={handleChange}
                  className="w-full rounded-md px-3 py-2"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary,
                    border: `1px solid ${theme.border.primary}`
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="loginManager" 
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.fg.secondary }}
                >
                  Login Manager
                </label>
                <input
                  type="text"
                  id="loginManager"
                  name="loginManager"
                  value={formData.loginManager}
                  onChange={handleChange}
                  className="w-full rounded-md px-3 py-2"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary,
                    border: `1px solid ${theme.border.primary}`
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="font" 
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.fg.secondary }}
                >
                  Font
                </label>
                <input
                  type="text"
                  id="font"
                  name="font"
                  value={formData.font}
                  onChange={handleChange}
                  className="w-full rounded-md px-3 py-2"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary,
                    border: `1px solid ${theme.border.primary}`
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="theme" 
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.fg.secondary }}
                >
                  Theme
                </label>
                <input
                  type="text"
                  id="theme"
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className="w-full rounded-md px-3 py-2"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary,
                    border: `1px solid ${theme.border.primary}`
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="iconTheme" 
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.fg.secondary }}
                >
                  Icon Theme
                </label>
                <input
                  type="text"
                  id="iconTheme"
                  name="iconTheme"
                  value={formData.iconTheme}
                  onChange={handleChange}
                  className="w-full rounded-md px-3 py-2"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary,
                    border: `1px solid ${theme.border.primary}`
                  }}
                />
              </div>

              <div>
                <label 
                  htmlFor="cursorTheme" 
                  className="block text-sm font-medium mb-1"
                  style={{ color: theme.fg.secondary }}
                >
                  Cursor Theme
                </label>
                <input
                  type="text"
                  id="cursorTheme"
                  name="cursorTheme"
                  value={formData.cursorTheme}
                  onChange={handleChange}
                  className="w-full rounded-md px-3 py-2"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.primary,
                    border: `1px solid ${theme.border.primary}`
                  }}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: theme.bg.tertiary,
                  color: theme.fg.secondary
                }}
              >
                <XCircle size={16} className="mr-1" />
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: theme.accent.blue,
                  color: theme.bg.primary
                }}
              >
                <Save size={16} className="mr-1" />
                Save
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: theme.bg.tertiary }}
            >
              <h3 className="text-lg font-semibold mb-3" style={{ color: theme.accent.blue }}>System</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ color: theme.fg.secondary }}>Hostname:</span>
                  <span style={{ color: theme.fg.primary }}>{systemInfo.system.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.fg.secondary }}>Base Install:</span>
                  <span style={{ color: theme.fg.primary }}>{systemInfo.system.baseInstall}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.fg.secondary }}>Kernel:</span>
                  <span style={{ color: theme.fg.primary }}>{systemInfo.system.kernel}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.fg.secondary }}>Bootloader:</span>
                  <span style={{ color: theme.fg.primary }}>{systemInfo.system.bootloader}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.fg.secondary }}>Login Manager:</span>
                  <span style={{ color: theme.fg.primary }}>{systemInfo.system.loginManager}</span>
                </div>
              </div>
            </div>

            <div 
              className="p-4 rounded-lg"
              style={{ backgroundColor: theme.bg.tertiary }}
            >
              <h3 className="text-lg font-semibold mb-3" style={{ color: theme.accent.blue }}>Appearance</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ color: theme.fg.secondary }}>Font:</span>
                  <span style={{ color: theme.fg.primary }}>{systemInfo.system.font}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.fg.secondary }}>Theme:</span>
                  <span style={{ color: theme.fg.primary }}>{systemInfo.system.theme}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.fg.secondary }}>Icon Theme:</span>
                  <span style={{ color: theme.fg.primary }}>{systemInfo.system.iconTheme}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.fg.secondary }}>Cursor Theme:</span>
                  <span style={{ color: theme.fg.primary }}>{systemInfo.system.cursorTheme}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemInfoEditor;