import React from 'react';
import { useApp } from '../../context/AppContext';
import { Package2, Clock } from 'lucide-react';

const RecentlyAdded: React.FC = () => {
  const { entries, theme } = useApp();
  
  // Get the 5 most recently added entries
  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 5);

  return (
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
        <h2 className="text-xl font-bold flex items-center" style={{ color: theme.fg.primary }}>
          <Clock className="mr-2" size={20} />
          Recently Added
        </h2>
      </div>
      
      <div className="p-6">
        {recentEntries.length === 0 ? (
          <p className="text-center" style={{ color: theme.fg.secondary }}>
            No entries added yet
          </p>
        ) : (
          <div className="space-y-4">
            {recentEntries.map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center p-3 rounded-md transition-colors hover:opacity-80"
                style={{ backgroundColor: theme.bg.tertiary }}
              >
                <Package2 
                  className="mr-3" 
                  size={20} 
                  style={{ color: entry.isInstalled ? theme.accent.green : theme.accent.red }} 
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: theme.fg.primary }}>
                    {entry.package}
                  </p>
                  <p className="text-sm truncate" style={{ color: theme.fg.secondary }}>
                    {entry.description}
                  </p>
                </div>
                <div className="ml-4 text-sm" style={{ color: theme.fg.muted }}>
                  {new Date(entry.addedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentlyAdded;