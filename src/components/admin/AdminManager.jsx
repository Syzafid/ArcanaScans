
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Shield, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminManager = () => {
  const [admins, setAdmins] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = () => {
    const savedAdmins = JSON.parse(localStorage.getItem('admins') || '[]');
    setAdmins(savedAdmins);
  };

  const addAdmin = (e) => {
    e.preventDefault();
    
    // Check if email already exists
    const existingAdmin = admins.find(admin => admin.email === formData.email);
    if (existingAdmin) {
      toast({
        title: "Email Already Exists",
        description: "An admin with this email already exists.",
        variant: "destructive"
      });
      return;
    }

    const newAdmin = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    const updatedAdmins = [...admins, newAdmin];
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    setAdmins(updatedAdmins);
    
    // Reset form
    setFormData({ name: '', email: '', password: '' });
    setShowAddForm(false);
    
    toast({
      title: "Admin Added",
      description: `${formData.name} has been added as an admin.`,
    });
  };

  const deleteAdmin = (adminId) => {
    const updatedAdmins = admins.filter(admin => admin.id !== adminId);
    localStorage.setItem('admins', JSON.stringify(updatedAdmins));
    setAdmins(updatedAdmins);
    
    toast({
      title: "Admin Deleted",
      description: "Admin has been removed successfully.",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-dark-text-primary mb-2">Manage Admins</h2>
          <p className="text-dark-text-secondary">Add and manage admin accounts</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Admin</span>
        </button>
      </div>

      {/* Add Admin Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="dark-card p-6 rounded-xl"
        >
          <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Add New Admin</h3>
          <form onSubmit={addAdmin} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-text-primary mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                Add Admin
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Admins List */}
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
          Current Admins ({admins.length})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="text-left py-3 px-4 text-dark-text-secondary">Name</th>
                <th className="text-left py-3 px-4 text-dark-text-secondary">Email</th>
                <th className="text-left py-3 px-4 text-dark-text-secondary">Created</th>
                <th className="text-left py-3 px-4 text-dark-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <motion.tr
                  key={admin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-dark-border/50"
                >
                  <td className="py-3 px-4 text-dark-text-primary">{admin.name}</td>
                  <td className="py-3 px-4 text-dark-text-secondary">{admin.email}</td>
                  <td className="py-3 px-4 text-dark-text-secondary">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => deleteAdmin(admin.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Delete Admin"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {admins.length === 0 && (
            <div className="text-center py-8 text-dark-text-secondary">
              <Shield className="w-12 h-12 mx-auto mb-4 text-dark-text-muted" />
              <p>No admins found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminManager;
