
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ArrowUp, ArrowDown, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MangaSearch from './MangaSearch';

const RankingManager = () => {
  const [rankings, setRankings] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = () => {
    const savedRankings = JSON.parse(localStorage.getItem('rankingList') || '[]');
    // Sort by rank
    const sortedRankings = savedRankings.sort((a, b) => a.rank - b.rank);
    setRankings(sortedRankings);
  };

  const addToRanking = (manga) => {
    // Check if manga already exists in ranking
    if (rankings.find(item => item.id === manga.id)) {
      toast({
        title: "Already in Ranking",
        description: "This manga is already in the ranking list.",
        variant: "destructive"
      });
      return;
    }

    const newRank = rankings.length + 1;
    const newRankingItem = {
      ...manga,
      rank: newRank,
      addedAt: new Date().toISOString()
    };

    const updatedRankings = [...rankings, newRankingItem];
    localStorage.setItem('rankingList', JSON.stringify(updatedRankings));
    setRankings(updatedRankings);
    
    toast({
      title: "Added to Ranking",
      description: `${manga.title} has been added to ranking at position ${newRank}.`,
    });
  };

  const removeFromRanking = (mangaId) => {
    const updatedRankings = rankings
      .filter(item => item.id !== mangaId)
      .map((item, index) => ({ ...item, rank: index + 1 })); // Reorder ranks

    localStorage.setItem('rankingList', JSON.stringify(updatedRankings));
    setRankings(updatedRankings);
    
    toast({
      title: "Removed from Ranking",
      description: "Item has been removed and rankings have been reordered.",
    });
  };

  const moveRanking = (mangaId, direction) => {
    const currentIndex = rankings.findIndex(item => item.id === mangaId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= rankings.length) return;

    const updatedRankings = [...rankings];
    [updatedRankings[currentIndex], updatedRankings[newIndex]] = 
    [updatedRankings[newIndex], updatedRankings[currentIndex]];

    // Update rank numbers
    updatedRankings.forEach((item, index) => {
      item.rank = index + 1;
    });

    localStorage.setItem('rankingList', JSON.stringify(updatedRankings));
    setRankings(updatedRankings);
    
    toast({
      title: "Ranking Updated",
      description: "Ranking order has been updated.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-dark-text-primary mb-2">Manage Rankings</h2>
        <p className="text-dark-text-secondary">Create and manage the top manga rankings</p>
      </div>

      {/* Add to Ranking */}
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Add to Ranking</h3>
        <MangaSearch 
          onAdd={addToRanking}
          buttonText="Add to Ranking"
          placeholder="Search manga to add to ranking..."
        />
      </div>

      {/* Current Rankings */}
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
          Current Rankings ({rankings.length})
        </h3>
        
        {rankings.length > 0 ? (
          <div className="space-y-4">
            {rankings.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="dark-card p-4 rounded-xl bg-dark-bg/50 flex items-center space-x-4"
              >
                {/* Rank Number */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    item.rank === 1 ? 'bg-yellow-400/20 text-yellow-400' :
                    item.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                    item.rank === 3 ? 'bg-orange-400/20 text-orange-400' :
                    'bg-primary/20 text-primary'
                  }`}>
                    {item.rank}
                  </div>
                </div>

                {/* Manga Info */}
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-12 h-16 object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/placeholder.svg';
                  }}
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-dark-text-primary truncate" title={item.title}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-dark-text-secondary">
                    Rank #{item.rank}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => moveRanking(item.id, 'up')}
                    disabled={item.rank === 1}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4 text-primary" />
                  </button>
                  <button
                    onClick={() => moveRanking(item.id, 'down')}
                    disabled={item.rank === rankings.length}
                    className="p-2 hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4 text-primary" />
                  </button>
                  <button
                    onClick={() => removeFromRanking(item.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-dark-text-secondary">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-dark-text-muted" />
            <p>No rankings added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingManager;
