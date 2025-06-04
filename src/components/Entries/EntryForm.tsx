import React, { useState } from 'react';
import { categories } from '../../data/initialData';
import { Entry, CategoryType } from '../../types';
import { useApp } from '../../context/AppContext';

interface EntryFormProps {
  entry?: Entry;
  category?: CategoryType;
  onCancel: () => void;
  onSave: (entry: Entry) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ 
  entry, 
  category,
  onCancel, 
  onSave 
}) => {
  const { darkMode } = useApp();
  
  const [formData, setFormData] = useState<Omit<Entry, 'id'> & { id?: string }>({
    id: entry?.id,
    name: entry?.name || '',
    description: entry?.description || '',
    category: entry?.category || category || 'applications',
    packageName: entry?.packageName || '',
    installCommand: entry?.installCommand || '',
    configLocation: entry?.configLocation || '',
    notes: entry?.notes || '',
    isInstalled: entry?.isInstalled ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Entry);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label 
          htmlFor="name" 
          className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
        >
          Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`
            mt-1 block w-full rounded-md 
            ${darkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
            }
            shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          `}
        />
      </div>
      
      <div>
        <label 
          htmlFor="description" 
          className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={2}
          className={`
            mt-1 block w-full rounded-md 
            ${darkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
            }
            shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          `}
        />
      </div>
      
      <div>
        <label 
          htmlFor="category" 
          className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
        >
          Category *
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className={`
            mt-1 block w-full rounded-md 
            ${darkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
            }
            shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          `}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label 
          htmlFor="packageName" 
          className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
        >
          Package Name
        </label>
        <input
          type="text"
          id="packageName"
          name="packageName"
          value={formData.packageName}
          onChange={handleChange}
          placeholder="e.g., firefox, neovim"
          className={`
            mt-1 block w-full rounded-md 
            ${darkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
            }
            shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          `}
        />
      </div>
      
      <div>
        <label 
          htmlFor="installCommand" 
          className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
        >
          Install Command
        </label>
        <input
          type="text"
          id="installCommand"
          name="installCommand"
          value={formData.installCommand}
          onChange={handleChange}
          placeholder="e.g., pacman -S firefox"
          className={`
            mt-1 block w-full rounded-md 
            ${darkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
            }
            shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          `}
        />
      </div>
      
      <div>
        <label 
          htmlFor="configLocation" 
          className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
        >
          Config Location
        </label>
        <input
          type="text"
          id="configLocation"
          name="configLocation"
          value={formData.configLocation}
          onChange={handleChange}
          placeholder="e.g., ~/.config/nvim"
          className={`
            mt-1 block w-full rounded-md 
            ${darkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
            }
            shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          `}
        />
      </div>
      
      <div>
        <label 
          htmlFor="notes" 
          className={`block text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
        >
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={2}
          placeholder="Additional notes or instructions"
          className={`
            mt-1 block w-full rounded-md 
            ${darkMode 
              ? 'bg-slate-700 border-slate-600 text-white' 
              : 'bg-white border-slate-300 text-slate-900'
            }
            shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          `}
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isInstalled"
          name="isInstalled"
          checked={formData.isInstalled}
          onChange={(e) => setFormData(prev => ({ ...prev, isInstalled: e.target.checked }))}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label 
          htmlFor="isInstalled" 
          className={`ml-2 block text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
        >
          Currently Installed
        </label>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className={`
            px-4 py-2 rounded-md text-sm font-medium 
            ${darkMode 
              ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' 
              : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
            }
          `}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`
            px-4 py-2 rounded-md text-sm font-medium 
            bg-indigo-600 text-white hover:bg-indigo-700
          `}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EntryForm;