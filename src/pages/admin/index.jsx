
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import OverviewStats from '@/components/admin/OverviewStats';

const AdminDashboard = () => {
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
              Admin Dashboard
            </h1>
            <p className="text-dark-text-secondary">
              Welcome to the admin panel. Monitor and manage your platform.
            </p>
          </div>

          <OverviewStats />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="dark-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-3">Recent Activity</h3>
              <p className="text-dark-text-secondary text-sm">
                Monitor recent user activities and system changes.
              </p>
            </div>
            
            <div className="dark-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-3">System Health</h3>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">All systems operational</span>
              </div>
            </div>
            
            <div className="dark-card p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-dark-text-primary mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="btn-primary text-sm w-full">Add Recommendation</button>
                <button className="btn-secondary text-sm w-full">Manage Rankings</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
