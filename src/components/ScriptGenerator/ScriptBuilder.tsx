import React, { useState } from 'react';
import { Download, Copy, Code, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { categories } from '../../data/initialData';
import { CategoryType } from '../../types';

const ScriptBuilder: React.FC = () => {
  const { generateInstallScript, theme } = useApp();
  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
  const [script, setScript] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleCategoryToggle = (categoryId: CategoryType) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(cat => cat.id));
    }
  };

  const handleGenerateScript = () => {
    const generatedScript = generateInstallScript(
      selectedCategories.length > 0 ? selectedCategories : undefined
    );
    setScript(generatedScript);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arch-install-script.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
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
            <Code className="mr-2" size={20} />
            Installation Script Generator
          </h2>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold" style={{ color: theme.fg.primary }}>Select Categories</h3>
              <button
                onClick={handleSelectAll}
                className="text-sm px-3 py-1 rounded-md transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: theme.bg.tertiary,
                  color: theme.fg.primary
                }}
              >
                {selectedCategories.length === categories.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className={`
                    flex items-center p-3 rounded-md cursor-pointer
                    border transition-colors hover:opacity-80
                  `}
                  style={{ 
                    backgroundColor: selectedCategories.includes(category.id)
                      ? theme.accent.blue + '20'
                      : theme.bg.tertiary,
                    borderColor: selectedCategories.includes(category.id)
                      ? theme.accent.blue
                      : 'transparent'
                  }}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <div 
                    className="w-5 h-5 rounded-md flex items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: selectedCategories.includes(category.id)
                        ? theme.accent.blue
                        : 'transparent',
                      border: selectedCategories.includes(category.id)
                        ? 'none'
                        : `1px solid ${theme.border.primary}`
                    }}
                  >
                    {selectedCategories.includes(category.id) && (
                      <CheckCircle2 size={16} style={{ color: theme.bg.primary }} />
                    )}
                  </div>
                  <span className="truncate" style={{ color: theme.fg.primary }}>{category.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleGenerateScript}
            className="w-full py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: theme.accent.blue,
              color: theme.bg.primary
            }}
          >
            Generate Script
          </button>
        </div>
      </div>
      
      {script && (
        <div 
          className="rounded-lg shadow-md overflow-hidden animate-fade-in"
          style={{ backgroundColor: theme.bg.primary }}
        >
          <div 
            className="px-6 py-4 border-b flex justify-between items-center"
            style={{ 
              backgroundColor: theme.bg.secondary,
              borderColor: theme.border.primary
            }}
          >
            <h2 className="text-xl font-bold" style={{ color: theme.fg.primary }}>Generated Script</h2>
            <div className="flex space-x-2">
              <button
                onClick={handleCopyScript}
                className="p-2 rounded-md transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: theme.bg.tertiary,
                  color: theme.fg.primary
                }}
                title="Copy to clipboard"
              >
                {copied ? <CheckCircle2 size={20} style={{ color: theme.accent.green }} /> : <Copy size={20} />}
              </button>
              <button
                onClick={handleDownloadScript}
                className="p-2 rounded-md transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: theme.bg.tertiary,
                  color: theme.fg.primary
                }}
                title="Download script"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <pre 
              className="p-4 rounded-md overflow-auto whitespace-pre-wrap max-h-96 font-mono text-sm"
              style={{ 
                backgroundColor: theme.bg.secondary,
                color: theme.fg.primary
              }}
            >
              {script}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScriptBuilder;