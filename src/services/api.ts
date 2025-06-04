import { SystemInfo } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export const fetchSystemInfo = async (): Promise<SystemInfo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/system-info`);
    if (!response.ok) {
      throw new Error('Failed to fetch system information');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching system information:', error);
    // Return default values if the API call fails
    return {
      system: {
        hostname: 'Unknown',
        baseInstall: 'Unknown',
        kernel: 'Unknown',
        bootloader: 'Unknown',
        loginManager: 'Unknown',
        font: 'Unknown',
        theme: 'Unknown',
        iconTheme: 'Unknown',
        cursorTheme: 'Unknown'
      },
      users: [],
      drivers: {
        graphics: 'Unknown',
        audio: 'Unknown'
      },
      packages: {
        coreOsUtilities: [],
        extraUtilities: [],
        webBrowsers: [],
        textEditors: [],
        launchers: [],
        applications: []
      },
      themes: {
        fonts: [],
        themes: [],
        iconThemes: [],
        cursorThemes: []
      }
    };
  }
}; 