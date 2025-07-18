
import AdminSidebar from '../../components/admin/AdminSidebar';
import UserManager from '../../components/admin/UserManager';
import { motion } from 'framer-motion';

const AdminUsers = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-dark-text-primary mb-2 gradient-text">
              User Management
            </h1>
            <p className="text-dark-text-secondary">
              Manage user accounts and permissions.
            </p>
          </div>

          <UserManager />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminUsers;
