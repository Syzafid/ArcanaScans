import { motion } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ChapterGapConfirmation = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  currentChapter, 
  nextChapter,
  direction = 'next' 
}) => {
  if (!isOpen) return null;

  // Fallback jika data kosong
  const current = currentChapter || '?';
  const next = nextChapter || '?';

  const actionText = direction === 'next' ? 'melanjutkan' : 'kembali';
  const chapterText = direction === 'next' ? 'berikutnya' : 'sebelumnya';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-md mx-4 bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-2xl"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mr-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-white">Chapter Gap Detected</h3>
          <button
            onClick={onClose}
            className="ml-auto p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        <div className="text-gray-300 mb-6">
          <p className="mb-2">
            Chapter {chapterText} adalah chapter <span className="font-semibold text-primary">{next}</span> 
            (terdapat gap dari chapter <span className="font-semibold">{current}</span>).
          </p>
          <p>Apakah Anda tetap ingin {actionText}?</p>
        </div>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary/80 transition-colors"
          >
            Tetap Lanjut
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Batal
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChapterGapConfirmation;
