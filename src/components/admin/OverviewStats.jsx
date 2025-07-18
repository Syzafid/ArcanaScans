import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Bookmark, Shield } from 'lucide-react';

const OverviewStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalManga: 0,
    totalBookmarks: 0,
    totalAdmins: 0
  });

  // Fungsi ambil jumlah manga dari API MangaDex
  const getTotalMangaFromApi = async () => {
    try {
      const response = await fetch('https://api.mangadex.org/manga?limit=1');
      const data = await response.json();

      if (typeof data.total === 'number') {
        return data.total;
      } else {
        console.warn('⚠️ Respon tidak valid dari API');
        return 0;
      }
    } catch (error) {
      console.error('❌ Gagal ambil data manga dari API:', error);
      return 0;
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const admins = JSON.parse(localStorage.getItem('admins') || '[]');
      const internalManga = JSON.parse(localStorage.getItem('internalMangaList') || '[]');

      let totalBookmarks = 0;
      users.forEach(user => {
        const userBookmarks = JSON.parse(localStorage.getItem(`bookmarks_demo-user`) || '[]');
        totalBookmarks += userBookmarks.length;
      });

      const apiTotal = await getTotalMangaFromApi();
      const totalManga = internalManga.length + apiTotal;

      setStats({
        totalUsers: users.length,
        totalManga,
        totalBookmarks,
        totalAdmins: admins.length
      });
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      title: 'Total Manga',
      value: stats.totalManga,
      icon: BookOpen,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      title: 'Total Bookmarks',
      value: stats.totalBookmarks,
      icon: Bookmark,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      title: 'Total Admins',
      value: stats.totalAdmins,
      icon: Shield,
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="dark-card p-6 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-dark-text-secondary text-sm mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-dark-text-primary">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default OverviewStats;
