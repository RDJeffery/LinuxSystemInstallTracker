export interface SystemInfo {
  system: {
    hostname: string;
    baseInstall: string;
    kernel: string;
    bootloader: string;
    loginManager: string;
    font: string;
    theme: string;
    iconTheme: string;
    cursorTheme: string;
  };
  users: string[];
  drivers: {
    graphics: string;
    audio: string;
  };
  packages: {
    coreOsUtilities: string[];
    extraUtilities: string[];
    webBrowsers: string[];
    textEditors: string[];
    launchers: string[];
    applications: string[];
  };
  themes: {
    fonts: string[];
    themes: string[];
    iconThemes: string[];
    cursorThemes: string[];
  };
}

export interface User {
  username: string;
  isRoot: boolean;
}

export type CategoryType = 
  | 'drivers'
  | 'core-utilities'
  | 'extra-utilities'
  | 'web-browsers'
  | 'text-editors'
  | 'launchers'
  | 'applications'
  | 'not-using'
  | 'scripts'
  | 'locations'
  | 'fonts'
  | 'themes'
  | 'icon-themes'
  | 'cursor-themes';

export interface Category {
  id: CategoryType;
  label: string;
  description: string;
  icon: string;
}

export interface Entry {
  id: string;
  name: string;
  description: string;
  category: CategoryType;
  packageName?: string;
  installCommand?: string;
  configLocation?: string;
  notes?: string;
  isInstalled: boolean;
}