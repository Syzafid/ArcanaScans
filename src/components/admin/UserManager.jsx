
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Also delete user's bookmarks
    localStorage.removeItem(`bookmarks_${userId}`);
    
    setUsers(updatedUsers);
    toast({
      title: "User Deleted",
      description: "User and their data have been removed successfully.",
    });
  };

  const toggleUserStatus = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive }
        : user
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    
    toast({
      title: "User Status Updated",
      description: "User status has been changed successfully.",
    });
  };

  const updateUserRole = (userId, newRole) => {
    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { ...user, role: newRole }
        : user
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setEditingUser(null);
    
    toast({
      title: "User Role Updated",
      description: "User role has been changed successfully.",
    });
  };

  return (
    <div className="dark-card p-6 rounded-xl">
      <h2 className="text-2xl font-bold text-dark-text-primary mb-6">User Management</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-3 px-4 text-dark-text-secondary">Name</th>
              <th className="text-left py-3 px-4 text-dark-text-secondary">Email</th>
              <th className="text-left py-3 px-4 text-dark-text-secondary">Role</th>
              <th className="text-left py-3 px-4 text-dark-text-secondary">Status</th>
              <th className="text-left py-3 px-4 text-dark-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-dark-border/50"
              >
                <td className="py-3 px-4 text-dark-text-primary">{user.name}</td>
                <td className="py-3 px-4 text-dark-text-secondary">{user.email}</td>
                <td className="py-3 px-4">
                  {editingUser === user.id ? (
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value)}
                      className="bg-dark-bg border border-dark-border rounded px-2 py-1 text-dark-text-primary"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' 
                        ? 'bg-red-400/20 text-red-400' 
                        : 'bg-blue-400/20 text-blue-400'
                    }`}>
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.isActive !== false 
                      ? 'bg-green-400/20 text-green-400' 
                      : 'bg-red-400/20 text-red-400'
                  }`}>
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                      className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                      title="Edit Role"
                    >
                      <Edit className="w-4 h-4 text-primary" />
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className="p-2 hover:bg-green-400/10 rounded-lg transition-colors"
                      title="Toggle Status"
                    >
                      {user.isActive !== false ? 
                        <UserX className="w-4 h-4 text-orange-400" /> : 
                        <UserCheck className="w-4 h-4 text-green-400" />
                      }
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="text-center py-8 text-dark-text-secondary">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManager;
