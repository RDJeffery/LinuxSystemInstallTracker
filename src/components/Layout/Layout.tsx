import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useApp } from '../../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useApp();

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: theme.bg.primary,
        color: theme.fg.primary
      }}
    >
      <Sidebar />
      <div className="flex flex-col lg:ml-64 min-h-screen">
        <Header />
        <main className="flex-grow p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;