import React, { useState, useMemo } from 'react';
import { 
  Edit,
  Trash2,
  Search,
  Filter,
  Check,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Entry, CategoryType } from '../../types';
import EntryForm from './EntryForm';

interface EntryListProps {
  category?: CategoryType;
  showCategory?: boolean;
}

const EntryList: React.FC<EntryListProps> = ({ 
  category,
  showCategory = false,
}) => {
  const { entries, updateEntry, removeEntry, darkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'installed' | 'not-installed'>('all');
  const [sortField, setSortField] = useState<'name' | 'category'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  
  const filteredEntries = useMemo(() => {
    let result = entries;
    
    // Filter by category if provided
    if (category) {
      result = result.filter(entry => entry.category === category);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(entry => 
        entry.name.toLowerCase().includes(term) || 
        entry.description.toLowerCase().includes(term)
      );
    }
    
    // Filter by status
    if (statusFilter === 'installed') {
      result = result.filter(entry => entry.isInstalled);
    } else if (statusFilter === 'not-installed') {
      result = result.filter(entry => !entry.isInstalled);
    }
    
    // Sort entries
    result = [...result].sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortDirection === 'asc' 
          ? a.category.localeCompare(b.category)
          : b.category.localeCompare(a.category);
      }
    });
    
    return result;
  }, [entries, category, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: 'name' | 'category') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleInstalled = (id: string, isInstalled: boolean) => {
    updateEntry(id, { isInstalled });
  };

  const handleEdit = (entry: Entry) => {
    setEditingEntry(entry);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      removeEntry(id);
    }
  };

  const handleEditCancel = () => {
    setEditingEntry(null);
  };

  const handleEditSave = (editedEntry: Entry) => {
    updateEntry(editedEntry.id, editedEntry);
    setEditingEntry(null);
  };

  // Get category name from kebab case
  const formatCategoryName = (categoryId: string): string => {
    return categoryId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className={`
      rounded-lg shadow-md overflow-hidden
      ${darkMode ? 'bg-slate-800' : 'bg-white'}
    `}>
      {/* Filters */}
      <div className={`
        p-4 
        ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}
        border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}
      `}>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
            </div>
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-2 rounded-md 
                ${darkMode 
                  ? 'bg-slate-800 text-white border-slate-700 focus:border-indigo-500' 
                  : 'bg-white text-slate-900 border-slate-300 focus:border-indigo-500'
                }
                border focus:outline-none focus:ring-2 focus:ring-indigo-500/50
              `}
            />
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className={`
                  appearance-none pl-10 pr-8 py-2 rounded-md
                  ${darkMode 
                    ? 'bg-slate-800 text-white border-slate-700' 
                    : 'bg-white text-slate-900 border-slate-300'
                  }
                  border focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                `}
              >
                <option value="all">All Status</option>
                <option value="installed">Installed</option>
                <option value="not-installed">Not Installed</option>
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={18} className={darkMode ? 'text-slate-400' : 'text-slate-500'} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Entries table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={`
            ${darkMode ? 'bg-slate-900 text-slate-200' : 'bg-slate-100 text-slate-700'}
          `}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                <button 
                  className="flex items-center font-medium" 
                  onClick={() => handleSort('name')}
                >
                  Name
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  )}
                </button>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Description
              </th>
              {showCategory && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <button 
                    className="flex items-center font-medium" 
                    onClick={() => handleSort('category')}
                  >
                    Category
                    {sortField === 'category' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </button>
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={`
            ${darkMode ? 'divide-y divide-slate-700' : 'divide-y divide-slate-200'}
          `}>
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <tr 
                  key={entry.id}
                  className={`
                    ${darkMode ? 'hover:bg-slate-750' : 'hover:bg-slate-50'}
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {entry.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className={`
                      max-w-md
                      ${darkMode ? 'text-slate-300' : 'text-slate-600'}
                    `}>
                      {entry.description}
                    </div>
                  </td>
                  {showCategory && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        inline-flex text-xs px-2 py-1 rounded-full
                        ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}
                      `}>
                        {formatCategoryName(entry.category)}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleInstalled(entry.id, !entry.isInstalled)}
                      className={`
                        inline-flex items-center text-xs px-2 py-1 rounded-full
                        ${entry.isInstalled
                          ? darkMode 
                            ? 'bg-green-900/50 text-green-300 hover:bg-green-900' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                          : darkMode 
                            ? 'bg-red-900/50 text-red-300 hover:bg-red-900' 
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }
                      `}
                    >
                      {entry.isInstalled ? (
                        <>
                          <Check size={14} className="mr-1" />
                          Installed
                        </>
                      ) : (
                        <>
                          <X size={14} className="mr-1" />
                          Not Installed
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(entry)}
                      className={`
                        p-1 rounded-md mr-2
                        ${darkMode 
                          ? 'text-indigo-400 hover:bg-slate-700' 
                          : 'text-indigo-600 hover:bg-slate-100'
                        }
                      `}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className={`
                        p-1 rounded-md
                        ${darkMode 
                          ? 'text-red-400 hover:bg-slate-700' 
                          : 'text-red-600 hover:bg-slate-100'
                        }
                      `}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={showCategory ? 5 : 4} 
                  className="px-6 py-4 text-center text-sm"
                >
                  No entries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Edit modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`
            max-w-lg w-full mx-4 rounded-lg shadow-xl overflow-hidden
            ${darkMode ? 'bg-slate-800' : 'bg-white'}
          `}>
            <div className={`
              px-6 py-4 border-b
              ${darkMode ? 'border-slate-700' : 'border-slate-200'}
            `}>
              <h2 className="text-xl font-bold">Edit Entry</h2>
            </div>
            <EntryForm
              entry={editingEntry}
              onCancel={handleEditCancel}
              onSave={handleEditSave}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryList;