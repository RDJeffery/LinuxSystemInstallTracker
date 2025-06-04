import React from 'react';
import SystemInfoCard from '../components/Dashboard/SystemInfoCard';
import CategoryStats from '../components/Dashboard/CategoryStats';
import RecentlyAdded from '../components/Dashboard/RecentlyAdded';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useApp();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SystemInfoCard />
        </div>
        
        <div>
          <div 
            className="rounded-lg shadow-md overflow-hidden"
            style={{ backgroundColor: theme.bg.primary }}
          >
            <div 
              className="px-6 py-4 border-b"
              style={{ 
                backgroundColor: theme.bg.secondary,
                borderColor: theme.border.primary
              }}
            >
              <h2 className="text-xl font-bold" style={{ color: theme.fg.primary }}>Quick Actions</h2>
            </div>
            
            <div className="p-6 space-y-3">
              <button
                onClick={() => navigate('/script')}
                className="w-full py-2 px-4 rounded-md text-sm font-medium transition-colors hover:opacity-80 flex items-center justify-center"
                style={{ 
                  backgroundColor: theme.accent.blue,
                  color: theme.bg.primary
                }}
              >
                <Plus size={18} className="mr-2" />
                Generate Install Script
              </button>
              
              <button
                onClick={() => navigate('/categories')}
                className="w-full py-2 px-4 rounded-md text-sm font-medium transition-colors hover:opacity-80 flex items-center justify-center"
                style={{ 
                  backgroundColor: theme.bg.tertiary,
                  color: theme.fg.primary
                }}
              >
                <Plus size={18} className="mr-2" />
                Manage Categories
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CategoryStats />
        </div>
        
        <div>
          <RecentlyAdded />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;