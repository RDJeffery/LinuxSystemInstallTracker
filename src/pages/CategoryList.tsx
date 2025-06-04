import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../data/initialData';
import { useApp } from '../context/AppContext';
import { CheckCircle2, XCircle, Package2, Plus } from 'lucide-react';
import EntryForm from '../components/Entries/EntryForm';
import { Entry } from '../types';

const CategoryList: React.FC = () => {
  const { entries, addEntry, theme } = useApp();
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  
  const categoryCounts = categories.map(category => {
    const categoryEntries = entries.filter(entry => entry.category === category.id);
    const installedCount = categoryEntries.filter(entry => entry.isInstalled).length;
    
    return {
      ...category,
      total: categoryEntries.length,
      installed: installedCount,
    };
  });

  const handleAddEntry = (entry: Entry) => {
    addEntry(entry);
    setIsAddingEntry(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold" style={{ color: theme.fg.primary }}>Categories</h1>
        <button
          onClick={() => setIsAddingEntry(true)}
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80 flex items-center"
          style={{ 
            backgroundColor: theme.accent.blue,
            color: theme.bg.primary
          }}
        >
          <Plus size={18} className="mr-2" />
          Add Entry
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryCounts.map((category) => (
          <Link 
            key={category.id}
            to={`/category/${category.id}`}
            className="block rounded-lg shadow-md overflow-hidden transition-colors hover:opacity-80"
            style={{ backgroundColor: theme.bg.tertiary }}
          >
            <div 
              className="px-6 py-4 border-b"
              style={{ 
                backgroundColor: theme.bg.secondary,
                borderColor: theme.border.primary
              }}
            >
              <h2 className="text-xl font-bold flex items-center" style={{ color: theme.fg.primary }}>
                <Package2 className="mr-2" size={20} />
                {category.label}
              </h2>
            </div>
            
            <div className="p-6">
              <p className="mb-4" style={{ color: theme.fg.secondary }}>
                {category.description}
              </p>
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center">
                  <CheckCircle2 className="mr-1" size={16} style={{ color: theme.accent.green }} />
                  <span style={{ color: theme.fg.primary }}>{category.installed} installed</span>
                </div>
                
                {category.total - category.installed > 0 && (
                  <div className="flex items-center">
                    <XCircle className="mr-1" size={16} style={{ color: theme.accent.red }} />
                    <span style={{ color: theme.fg.primary }}>{category.total - category.installed} not installed</span>
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <div className="w-full rounded-full h-2.5" style={{ backgroundColor: theme.bg.secondary }}>
                  <div 
                    className="h-2.5 rounded-full" 
                    style={{ 
                      backgroundColor: theme.accent.blue,
                      width: category.total > 0 
                        ? `${(category.installed / category.total) * 100}%`
                        : '0%'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Add Entry Modal */}
      {isAddingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div 
            className="max-w-lg w-full mx-4 rounded-lg shadow-xl overflow-hidden"
            style={{ backgroundColor: theme.bg.primary }}
          >
            <div 
              className="px-6 py-4 border-b"
              style={{ 
                backgroundColor: theme.bg.secondary,
                borderColor: theme.border.primary
              }}
            >
              <h2 className="text-xl font-bold" style={{ color: theme.fg.primary }}>Add New Entry</h2>
            </div>
            <EntryForm
              onCancel={() => setIsAddingEntry(false)}
              onSave={handleAddEntry}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList;