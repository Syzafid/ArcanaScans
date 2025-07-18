
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const pages = [];

    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const nextHundred = Math.min(
    Math.ceil((currentPage + 100) / 100) * 100,
    totalPages
  );

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* Prev Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md bg-gray-800 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
      </motion.button>

      {/* Visible page buttons */}
      {visiblePages.map((page) => (
        <motion.button
          key={page}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-md border transition-colors duration-200 ${
            page === currentPage
              ? 'bg-primary text-white border-primary'
              : 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700'
          }`}
        >
          {page}
        </motion.button>
      ))}

      {/* Ellipsis and next 100 */}
      {nextHundred > visiblePages[visiblePages.length - 1] && nextHundred <= totalPages && (
        <>
          <span className="px-2 text-gray-400">...</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(nextHundred)}
            className="px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white hover:bg-gray-700 transition-colors duration-200"
          >
            {nextHundred}
          </motion.button>
        </>
      )}

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md bg-gray-800 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors duration-200"
      >
        <ArrowRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
};


export default Pagination;
