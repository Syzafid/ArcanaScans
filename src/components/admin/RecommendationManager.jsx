
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MangaSearch from './MangaSearch';
import Image from 'next/image';

const RecommendationManager = () => {
  const [recommendations, setRecommendations] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = () => {
    const savedRecommendations = JSON.parse(localStorage.getItem('recommendationList') || '[]');
    setRecommendations(savedRecommendations);
  };

  const addRecommendation = (manga) => {
    const newRecommendation = {
      ...manga,
      addedAt: new Date().toISOString()
    };

    const updatedRecommendations = [...recommendations, newRecommendation];
    localStorage.setItem('recommendationList', JSON.stringify(updatedRecommendations));
    setRecommendations(updatedRecommendations);
    
    toast({
      title: "Recommendation Added",
      description: `${manga.title} has been added to recommendations.`,
    });
  };

  const removeRecommendation = (mangaId) => {
    const updatedRecommendations = recommendations.filter(rec => rec.id !== mangaId);
    localStorage.setItem('recommendationList', JSON.stringify(updatedRecommendations));
    setRecommendations(updatedRecommendations);
    
    toast({
      title: "Recommendation Removed",
      description: "Recommendation has been removed successfully.",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-dark-text-primary mb-2">Manage Recommendations</h2>
        <p className="text-dark-text-secondary">Add manga to the homepage recommendation carousel</p>
      </div>

      {/* Add New Recommendation */}
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">Add New Recommendation</h3>
        <MangaSearch 
          onAdd={addRecommendation}
          buttonText="Add to Recommendations"
          placeholder="Search manga to add to recommendations..."
        />
      </div>

      {/* Current Recommendations */}
      <div className="dark-card p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-dark-text-primary mb-4">
          Current Recommendations ({recommendations.length})
        </h3>
        
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendations.map((recommendation, index) => (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="dark-card p-4 rounded-xl bg-dark-bg/50"
              >
                <div className="flex space-x-4">
              <Image
                src={recommendation.cover || '/placeholder.svg'}
                alt={recommendation.title}
                width={64}
                height={80}
                className="object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
                unoptimized // Optional: hilangkan jika kamu yakin domain sudah di-allow di next.config.js
              />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-dark-text-primary mb-2 truncate" title={recommendation.title}>
                      {recommendation.title}
                    </h4>
                    <p className="text-xs text-dark-text-secondary mb-3">
                      Added: {new Date(recommendation.addedAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => removeRecommendation(recommendation.id)}
                      className="btn-destructive text-xs flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-dark-text-secondary">
            <Star className="w-12 h-12 mx-auto mb-4 text-dark-text-muted" />
            <p>No recommendations added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationManager;
