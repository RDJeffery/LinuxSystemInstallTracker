import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../data/initialData';
import EntryList from '../components/Entries/EntryList';
import EntryForm from '../components/Entries/EntryForm';
import { Entry, CategoryType } from '../types';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Plus } from 'lucide-react';

const CategoryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addEntry, theme } = useApp();
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  
  const category = categories.find(cat => cat.id === id);
  
  if (!category) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.fg.primary }}>Category Not Found</h2>
        <button
          onClick={() => navigate('/categories')}
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
          style={{ 
            backgroundColor: theme.accent.blue,
            color: theme.bg.primary
          }}
        >
          Back to Categories
        </button>
      </div>
    );
  }

  const handleAddEntry = (entry: Entry) => {
    addEntry(entry);
    setIsAddingEntry(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/categories')}
            className="p-2 rounded-full mr-2 transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: theme.bg.tertiary,
              color: theme.fg.primary
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold" style={{ color: theme.fg.primary }}>{category.label}</h1>
        </div>
        
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
      
      <p className="text-lg" style={{ color: theme.fg.secondary }}>
        {category.description}
      </p>
      
      <EntryList category={id as CategoryType} />
      
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
              <h2 className="text-xl font-bold" style={{ color: theme.fg.primary }}>Add New Entry to {category.label}</h2>
            </div>
            <EntryForm
              category={id as CategoryType}
              onCancel={() => setIsAddingEntry(false)}
              onSave={handleAddEntry}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;