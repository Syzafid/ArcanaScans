"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { getCoverUrl } from "../lib/mangadex";
import { useAuth } from "../contexts/AuthContext";
import useBookmark from "../hooks/useBookmark";
import Image from "next/image";
import { useState } from "react";

const MangaCard = ({ manga }) => {
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmark();

  const coverArt = manga.relationships?.find((rel) => rel.type === "cover_art");
  const coverFileName = coverArt?.attributes?.fileName;
  const coverUrl = getCoverUrl(manga.id, coverFileName, 256);

  const [imageError, setImageError] = useState(false);

  const title =
    manga.attributes?.title?.en ||
    manga.attributes?.title?.ja ||
    manga.attributes?.title?.["ja-ro"] ||
    Object.values(manga.attributes?.title || {})[0] ||
    "Unknown Title";

  const description =
    manga.attributes?.description?.en ||
    manga.attributes?.description?.ja ||
    Object.values(manga.attributes?.description || {})[0] ||
    "No description available";

  const truncatedDescription =
    description.length > 150 ? `${description.substring(0, 150)}...` : description;

  const getCategoryLabel = (originalLanguage) => {
    switch (originalLanguage) {
      case "ja":
        return { label: "Manga", bgColor: "bg-blue-900", textColor: "text-white" };
      case "ko":
        return { label: "Manhwa", bgColor: "bg-green-600", textColor: "text-white" };
      case "zh":
      case "zh-hans":
      case "zh-hant":
        return { label: "Manhua", bgColor: "bg-yellow-500", textColor: "text-white" };
      default:
        return { label: "Manga", bgColor: "bg-blue-900", textColor: "text-white" };
    }
  };

  const categoryLabel = getCategoryLabel(manga.attributes?.originalLanguage);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Silakan login untuk menyimpan ke library.");
      return;
    }

    if (user.role !== "user") {
      alert("Fitur bookmark hanya tersedia untuk user.");
      return;
    }

    toggleBookmark(manga);
  };

  return (
    <Link href={`/manga/${manga.id}`} className="group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="dark-card-hover overflow-hidden h-full relative"
      >
        <div className="aspect-[3/4] overflow-hidden relative">
          <Image
            src={imageError ? "/placeholder.svg" : coverUrl}
            alt={title}
            width={256}
            height={342}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => {
              console.warn(`❌ Gagal memuat cover untuk ${title}`);
              setImageError(true);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`absolute top-2 left-2 ${categoryLabel.bgColor} ${categoryLabel.textColor} text-xs font-semibold px-2 py-1 rounded shadow-lg`}
          >
            {categoryLabel.label}
          </motion.div>

          {user && user.role === "user" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleBookmark}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-300 backdrop-blur-sm opacity-0 group-hover:opacity-100"
              title={isBookmarked(manga.id) ? "Remove from library" : "Add to library"}
            >
              {isBookmarked(manga.id) ? (
                <BookmarkCheck className="w-4 h-4 text-yellow-400" />
              ) : (
                <Bookmark className="w-4 h-4 text-white" />
              )}
            </motion.button>
          )}
        </div>
        <div className="p-4">
          <motion.h3
            className="font-semibold text-lg mb-2 line-clamp-2 text-dark-text-primary group-hover:text-primary transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h3>
          <p className="text-dark-text-secondary text-sm line-clamp-3 mb-3">
            {truncatedDescription}
          </p>
          <div className="flex flex-wrap gap-1">
            {(manga.attributes?.tags || [])
              .slice(0, 3)
              .map((tag) => (
                <motion.span
                  key={tag.id}
                  whileHover={{ scale: 1.05 }}
                  className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30 hover:bg-primary/30 transition-colors duration-200"
                >
                  {tag.attributes?.name?.en || "Unknown"}
                </motion.span>
              ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MangaCard;
