import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Layout, 
  Home, 
  Monitor, 
  Users, 
  Code, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { theme } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  
  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Dashboard' },
    { path: '/system', icon: <Monitor size={20} />, label: 'System Info' },
    { path: '/categories', icon: <Layout size={20} />, label: 'Categories' },
    { path: '/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/script', icon: <Code size={20} />, label: 'Generate Script' },
    { path: '/settings', icon: <Settings size={20} />, label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-50 p-2 rounded-md lg:hidden"
        style={{ 
          backgroundColor: theme.bg.tertiary,
          color: theme.fg.primary
        }}
      >
        <Menu size={24} />
      </button>

      {/* Mobile sidebar */}
      <div 
        className={`
          fixed inset-0 z-40 lg:hidden
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={() => setMobileOpen(false)}
      >
        <div 
          className="w-64 h-full"
          style={{ backgroundColor: theme.bg.primary }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: theme.border.primary }}
            >
              <h2 className="text-xl font-bold" style={{ color: theme.accent.blue }}>Arch Manager</h2>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center py-2 px-4 transition-colors
                        ${isActive(item.path) ? 'bg-opacity-20' : 'hover:bg-opacity-10'}
                      `}
                      style={{ 
                        backgroundColor: isActive(item.path) ? theme.accent.blue : 'transparent',
                        color: isActive(item.path) ? theme.accent.blue : theme.fg.secondary
                      }}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div 
        className={`
          fixed top-0 left-0 h-full z-30
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-64'}
          hidden lg:block
        `}
        style={{ backgroundColor: theme.bg.primary }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: theme.border.primary }}
          >
            {!collapsed && (
              <h2 className="text-xl font-bold truncate" style={{ color: theme.accent.blue }}>Arch Manager</h2>
            )}
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded transition-colors hover:opacity-80 lg:block hidden"
              style={{ color: theme.fg.secondary }}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center py-2 px-4 transition-colors
                      ${isActive(item.path) ? 'bg-opacity-20' : 'hover:bg-opacity-10'}
                    `}
                    style={{ 
                      backgroundColor: isActive(item.path) ? theme.accent.blue : 'transparent',
                      color: isActive(item.path) ? theme.accent.blue : theme.fg.secondary
                    }}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;