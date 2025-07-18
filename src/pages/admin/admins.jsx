
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminManager from '../../components/admin/AdminManager';
import { motion } from 'framer-motion';

const AdminAdmins = () => {
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
              Admin Management
            </h1>
            <p className="text-dark-text-secondary">
              Add and manage administrator accounts.
            </p>
          </div>

          <AdminManager />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminAdmins;
