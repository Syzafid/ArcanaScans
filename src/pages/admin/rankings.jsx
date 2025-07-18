
import AdminSidebar from '@/components/admin/AdminSidebar';
import RankingManager from '@/components/admin/RankingManager';
import { motion } from 'framer-motion';

const AdminRankings = () => {
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
              Ranking Management
            </h1>
            <p className="text-dark-text-secondary">
              Create and manage top manga rankings.
            </p>
          </div>

          <RankingManager />
        </motion.div>
      </div>
    </div>
  );
};

export default AdminRankings;
