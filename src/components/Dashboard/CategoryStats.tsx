import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3 } from 'lucide-react';

const CategoryStats: React.FC = () => {
  const { entries, theme } = useApp();

  // Group entries by category
  const categoryStats = entries.reduce((acc: { [key: string]: number }, entry) => {
    const category = entry.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // Convert to array and sort by count
  const sortedStats = Object.entries(categoryStats)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

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
          <BarChart3 className="mr-2" size={20} style={{ color: theme.accent.blue }} />
          Category Statistics
        </h2>
      </div>
      
      <div className="p-6">
        {sortedStats.length > 0 ? (
          <div className="space-y-4">
            {sortedStats.map(({ category, count }) => (
              <div 
                key={category}
                className="p-4 rounded-lg"
                style={{ backgroundColor: theme.bg.tertiary }}
              >
                <div className="flex justify-between items-center">
                  <span style={{ color: theme.fg.primary }}>{category}</span>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: `${theme.accent.blue}20`,
                      color: theme.accent.blue
                    }}
                  >
                    {count} {count === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.secondary }}>
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      backgroundColor: theme.accent.blue,
                      width: `${(count / Math.max(...sortedStats.map(s => s.count))) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p style={{ color: theme.fg.muted }}>
              No categories have been added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryStats;