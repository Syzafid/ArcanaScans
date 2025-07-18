"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Shield,
  Star,
  TrendingUp,
  BookOpen,
  Bookmark,
} from "lucide-react";

const AdminSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "Manage Users", icon: Users },
    { path: "/admin/admins", label: "Manage Admins", icon: Shield },
    { path: "/admin/recommendations", label: "Recommendations", icon: Star },
    { path: "/admin/rankings", label: "Rankings", icon: TrendingUp },
    { path: "/admin/content", label: "Content", icon: BookOpen },
    { path: "/admin/bookmarks", label: "Bookmarks", icon: Bookmark },
  ];

  return (
    <div className="w-64 bg-dark-card border-r border-dark-border min-h-screen">
      <div className="p-6 border-b border-dark-border">
        <h2 className="text-xl font-bold gradient-text">Admin Panel</h2>
      </div>

      <nav className="p-4">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.path}
                className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-dark-text-secondary hover:bg-primary/10 hover:text-primary"
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
