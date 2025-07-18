
import AdminSidebar from '../../components/admin/AdminSidebar';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const AdminContent = () => {
  const [internalManga, setInternalManga] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    coverUrl: '',
    description: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadInternalManga();
  }, []);

  const loadInternalManga = () => {
    const savedManga = JSON.parse(localStorage.getItem('internalMangaList') || '[]');
    setInternalManga(savedManga);
  };

  const addManga = (e) => {
    e.preventDefault();
    
    const newManga = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    const updatedManga = [...internalManga, newManga];
    localStorage.setItem('internalMangaList', JSON.stringify(updatedManga));
    setInternalManga(updatedManga);
    
    // Reset form
    setFormData({ title: '', author: '', genre: '', coverUrl: '', description: '' });
    setShowAddForm(false);
    
    toast({
      title: "Manga Added",
      description: `${formData.title} has been added to internal collection.`,
    });
  };

  const deleteManga = (mangaId) => {
    const updatedManga = internalManga.filter(manga => manga.id !== mangaId);
    localStorage.setItem('internalMangaList', JSON.stringify(updatedManga));
    setInternalManga(updatedManga);
    
    toast({
      title: "Manga Deleted",
      description: "Manga has been removed from internal collection.",
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-dark-text-primary mb-2 gradient-text">
                Content Management
              </h1>
              <p className="text-dark-text-secondary">
                Manage internal manga collection.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Manga</span>
            </button>
          </div>

          {/* Add Manga Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="dark-card p-6 rounded-xl"
            >
              <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Add New Manga</h3>
              <form onSubmit={addManga} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Genre
                    </label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-text-primary mb-2">
                      Cover URL
                    </label>
                    <input
                      type="url"
                      name="coverUrl"
                      value={formData.coverUrl}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary">
                    Add Manga
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

          {/* Manga List */}
          <div className="dark-card p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
              Internal Manga Collection ({internalManga.length})
            </h3>
            
            {internalManga.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {internalManga.map((manga, index) => (
                  <motion.div
                    key={manga.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="dark-card p-4 rounded-xl bg-dark-bg/50"
                  >
                    <img
                      src={manga.coverUrl}
                      alt={manga.title}
                      className="w-full h-48 object-cover rounded mb-4"
                      onError={(e) => {
                        e.target.src = '/placeholder.svg';
                      }}
                    />
                    <h4 className="font-semibold text-dark-text-primary mb-2">{manga.title}</h4>
                    <p className="text-sm text-dark-text-secondary mb-1">Author: {manga.author}</p>
                    <p className="text-sm text-dark-text-secondary mb-3">Genre: {manga.genre}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => deleteManga(manga.id)}
                        className="btn-destructive text-xs flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-dark-text-secondary">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-dark-text-muted" />
                <p>No manga in internal collection yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminContent;
