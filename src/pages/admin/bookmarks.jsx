
import AdminSidebar from '../../components/admin/AdminSidebar';
import { motion } from 'framer-motion';
import { Bookmark, Trash2, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const getCoverUrl = (mangaId, fileName) => {
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`;
};


const AdminBookmarks = () => {
  const [allBookmarks, setAllBookmarks] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAllBookmarks();
  }, []);

 const loadAllBookmarks = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const bookmarksData = [];

  users.forEach(user => {
    const userBookmarks = JSON.parse(localStorage.getItem((`bookmarks_demo-user`)) || '[]');
    userBookmarks.forEach(bookmark => {
      bookmarksData.push({
        ...bookmark,
        userId: user.id,
        userName: user.name,
        userEmail: user.email
      });
    });
  });

  setAllBookmarks(bookmarksData);
};


  const removeBookmark = (userId, mangaId) => {
    // Remove from user's bookmarks
    const userBookmarks = JSON.parse(localStorage.getItem(`bookmarks_demo-user`) || '[]');
    const updatedBookmarks = userBookmarks.filter(bookmark => bookmark.id !== mangaId);
    localStorage.setItem(`bookmarks_demo-user`, JSON.stringify(updatedBookmarks));
    
    // Reload all bookmarks
    loadAllBookmarks();
    
    toast({
      title: "Bookmark Removed",
      description: "Bookmark has been removed from user's collection.",
    });
  };

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
              Bookmark Management
            </h1>
            <p className="text-dark-text-secondary">
              View and manage all user bookmarks.
            </p>
          </div>

          <div className="dark-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
              All User Bookmarks ({allBookmarks.length})
            </h3>
            
            {allBookmarks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-border">
                      <th className="text-left py-3 px-4 text-dark-text-secondary">Manga</th>
                      <th className="text-left py-3 px-4 text-dark-text-secondary">User</th>
                      <th className="text-left py-3 px-4 text-dark-text-secondary">Added</th>
                      <th className="text-left py-3 px-4 text-dark-text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBookmarks.map((bookmark, index) => (
                      <motion.tr
                        key={`${bookmark.userId}-${bookmark.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-dark-border/50"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                bookmark.coverFileName
                                  ? getCoverUrl(bookmark.id, bookmark.coverFileName)
                                  : '/placeholder.svg'
                              }
                              alt={bookmark.title}
                              className="w-10 h-12 object-cover rounded"
                              onError={(e) => {
                                e.target.src = '/placeholder.svg';
                              }}
                            />

                            <div>
                              <p className="text-dark-text-primary font-medium">{bookmark.title}</p>
                              <p className="text-xs text-dark-text-secondary">{bookmark.status}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-dark-text-muted" />
                            <div>
                              <p className="text-dark-text-primary text-sm">{bookmark.userName}</p>
                              <p className="text-xs text-dark-text-secondary">{bookmark.userEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-dark-text-secondary text-sm">
                          {bookmark.addedAt ? new Date(bookmark.addedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => removeBookmark(bookmark.userId, bookmark.id)}
                            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                            title="Remove Bookmark"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-dark-text-secondary">
                <Bookmark className="w-12 h-12 mx-auto mb-4 text-dark-text-muted" />
                <p>No bookmarks found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminBookmarks;
