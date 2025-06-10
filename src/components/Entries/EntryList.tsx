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
  const { entries, darkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'installed' | 'not-installed'>('all');
  const [sortField, setSortField] = useState<'name' | 'category'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
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
            </tr>
          </thead>
          <tbody className={`
            divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-200'}
          `}>
            {filteredEntries.map((entry) => (
              <tr key={entry.id} className={`
                ${darkMode ? 'bg-slate-800' : 'bg-white'}
              `}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`
                      text-sm font-medium
                      ${darkMode ? 'text-slate-200' : 'text-slate-900'}
                    `}>
                      {entry.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`
                    text-sm
                    ${darkMode ? 'text-slate-300' : 'text-slate-500'}
                  `}>
                    {entry.description}
                  </span>
                </td>
                {showCategory && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`
                      text-sm
                      ${darkMode ? 'text-slate-300' : 'text-slate-500'}
                    `}>
                      {formatCategoryName(entry.category)}
                    </span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EntryList;