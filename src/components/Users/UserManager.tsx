import React, { useState } from 'react';
import { Plus, Edit, Trash2, User as UserIcon, Save, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

const UserManager: React.FC = () => {
  const { users, addUser, removeUser, theme } = useApp();
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ username: '', isRoot: false });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.username.trim()) {
      addUser(newUser);
      setNewUser({ username: '', isRoot: false });
      setIsAdding(false);
    }
  };

  const handleDeleteUser = (username: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      removeUser(username);
    }
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden" style={{ backgroundColor: theme.bg.primary }}>
      <div 
        className="px-6 py-4 border-b flex justify-between items-center"
        style={{ 
          backgroundColor: theme.bg.secondary,
          borderColor: theme.border.primary
        }}
      >
        <h2 className="text-xl font-bold flex items-center" style={{ color: theme.fg.primary }}>
          <UserIcon className="mr-2" size={20} style={{ color: theme.accent.blue }} />
          Users
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: theme.bg.tertiary,
              color: theme.accent.blue
            }}
          >
            <Plus size={16} className="mr-1" />
            Add User
          </button>
        )}
      </div>
      
      <div className="p-6">
        {isAdding && (
          <form onSubmit={handleAddUser} className="mb-6 p-4 rounded-lg border border-dashed" style={{ borderColor: theme.border.secondary }}>
            <h3 className="text-lg font-semibold mb-3" style={{ color: theme.fg.primary }}>Add New User</h3>
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="username" 
                  className="block text-sm font-medium"
                  style={{ color: theme.fg.secondary }}
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                  required
                  className="mt-1 block w-full rounded-md shadow-sm focus:outline-none focus:ring-2"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    borderColor: theme.border.secondary,
                    color: theme.fg.primary
                  }}
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRoot"
                  checked={newUser.isRoot}
                  onChange={(e) => setNewUser(prev => ({ ...prev, isRoot: e.target.checked }))}
                  className="h-4 w-4 rounded focus:ring-2"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    borderColor: theme.border.secondary
                  }}
                />
                <label 
                  htmlFor="isRoot" 
                  className="ml-2 block text-sm"
                  style={{ color: theme.fg.secondary }}
                >
                  Root User
                </label>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
                  style={{ 
                    backgroundColor: theme.bg.tertiary,
                    color: theme.fg.secondary
                  }}
                >
                  <XCircle size={16} className="mr-1" />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors hover:opacity-80"
                  style={{ 
                    backgroundColor: theme.accent.green,
                    color: theme.bg.primary
                  }}
                >
                  <Save size={16} className="mr-1" />
                  Save
                </button>
              </div>
            </div>
          </form>
        )}
        
        {users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user) => (
              <div 
                key={user.username}
                className="p-4 rounded-lg transition-colors"
                style={{ backgroundColor: theme.bg.tertiary }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <UserIcon className="mr-2" size={18} style={{ color: theme.accent.blue }} />
                    <div>
                      <h3 className="font-semibold" style={{ color: theme.fg.primary }}>{user.username}</h3>
                      {user.isRoot && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: `${theme.accent.yellow}20`,
                            color: theme.accent.yellow
                          }}
                        >
                          Root
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDeleteUser(user.username)}
                      className="p-2 rounded-md transition-colors hover:bg-opacity-20 hover:bg-slate-600"
                      style={{ color: theme.accent.red }}
                      title="Delete user"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p style={{ color: theme.fg.muted }}>
              No users have been added yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;