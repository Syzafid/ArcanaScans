import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Library, Settings, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Navigation = () => {
  const router = useRouter();
  const currentPath = router.pathname; // Pengganti location.pathname
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/category', label: 'Category', icon: BookOpen },
  ];

  // Add conditional nav items based on authentication and role
  if (isAuthenticated) {
    if (user?.role === 'user') {
      navItems.push({ path: '/library', label: 'Library', icon: Library });
    }
    if (isAdmin) {
      navItems.push({ path: '/admin', label: 'Admin', icon: Settings });
    }
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-dark-bg/95 backdrop-blur-md border-b border-dark-border sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center space-x-4">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-12 w-12 rounded-full object-cover"
              />
              <span className="text-2xl font-bold gradient-text">ArcanaScans</span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navItems.map((item, index) => {
                const isActive = currentPath === item.path;
                const Icon = item.icon;
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.path}
                      className={`relative inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                        isActive
                          ? 'text-primary bg-primary/10 shadow-glow'
                          : 'text-dark-text-secondary hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {item.label}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary/10 rounded-lg border border-primary/20"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-4 border-l border-dark-border pl-4">
              <AnimatePresence mode="wait">
                {isAuthenticated ? (
                  <motion.div
                    key="authenticated"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="flex items-center space-x-2 bg-dark-card px-3 py-2 rounded-lg">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm text-dark-text-primary">{user?.name || 'User'}</span>
                      {isAdmin && (
                        <span className="px-2 py-1 text-xs bg-accent text-dark-bg rounded-full font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={logout}
                      className="flex items-center space-x-1 text-sm text-dark-text-secondary hover:text-destructive transition-colors duration-300"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center space-x-2"
                  >
                    <Link href="/login" className="btn-primary flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-dark-card border border-dark-border"
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-dark-border mt-4 pt-4 pb-4"
            >
              <div className="space-y-2">
                {navItems.map((item, index) => {
                  const isActive = currentPath === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                          isActive
                            ? 'text-primary bg-primary/10 border border-primary/20'
                            : 'text-dark-text-secondary hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
                
                <div className="border-t border-dark-border pt-4 mt-4">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <div className="flex items-center px-4 py-2 bg-dark-card rounded-lg">
                        <User className="w-4 h-4 text-primary mr-2" />
                        <span className="text-sm">{user?.name}</span>
                        {isAdmin && (
                          <span className="ml-2 px-2 py-1 text-xs bg-accent text-dark-bg rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-300"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn-primary w-full flex items-center justify-center space-x-2"
                    >
                      <User className="w-4 h-4" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;
