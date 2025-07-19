"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Bookmark, BookmarkCheck, BookOpen, Info } from "lucide-react";
import { getCoverUrl } from "../lib/mangadex";
import { useAuth } from "../contexts/AuthContext";
import useBookmark from "../hooks/useBookmark";
import Image from "next/image";

const RankingSidebar = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmark();

  useEffect(() => {
    loadRankings();
  }, []);

  const loadRankings = () => {
    try {
      const savedRankings = JSON.parse(localStorage.getItem("rankingList") || "[]");
      const dataToSet =
        savedRankings.length > 0
          ? savedRankings
          : [
              {
                id: "rank-1",
                title: "One Piece",
                rank: 1,
                cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                score: 9.8,
                mangaId: "rank-1",
              },
              {
                id: "rank-2",
                title: "Attack on Titan",
                rank: 2,
                cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                score: 9.5,
                mangaId: "rank-2",
              },
              {
                id: "rank-3",
                title: "Demon Slayer",
                rank: 3,
                cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                score: 9.3,
                mangaId: "rank-3",
              },
              {
                id: "rank-4",
                title: "My Hero Academia",
                rank: 4,
                cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                score: 9.1,
                mangaId: "rank-4",
              },
              {
                id: "rank-5",
                title: "Jujutsu Kaisen",
                rank: 5,
                cover: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                score: 9.0,
                mangaId: "rank-5",
              },
            ];
      setRankings(dataToSet.sort((a, b) => a.rank - b.rank));
    } catch (error) {
      console.error("Error loading rankings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = (manga, e) => {
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

    const bookmarkData = {
      id: manga.mangaId || manga.id,
      attributes: {
        title: { en: manga.title },
        description: { en: "Top ranked manga" },
      },
      relationships: [
        {
          type: "cover_art",
          attributes: {
            fileName: manga.coverFileName || manga.cover || "",
          },
        },
      ],
    };

    toggleBookmark(bookmarkData);
  };

  if (loading) {
    return (
      <div className="dark-card p-6">
        <div className="flex items-center mb-4">
          <Trophy className="w-5 h-5 text-accent mr-2" />
          <h3 className="text-lg font-semibold text-dark-text-primary">Top Rankings</h3>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
              <div className="w-12 h-16 bg-gray-700 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dark-card p-6">
      <div className="flex items-center mb-4">
        <Trophy className="w-5 h-5 text-accent mr-2" />
        <h3 className="text-lg font-semibold text-dark-text-primary">🏆 Top Rankings</h3>
      </div>

      <div className="space-y-4">
        {rankings.length > 0 ? (
          rankings.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="flex items-center space-x-3 hover:bg-gray-800/50 p-3 rounded-lg transition-colors hover-lift">
                {/* Bookmark Button */}
                {user && user.role === "user" && (
                  <button
                    onClick={(e) => handleBookmark(item, e)}
                    className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    {isBookmarked(item.mangaId || item.id) ? (
                      <BookmarkCheck className="w-3 h-3 text-accent" />
                    ) : (
                      <Bookmark className="w-3 h-3 text-white" />
                    )}
                  </button>
                )}

                <div className="w-8 h-8 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-white">#{item.rank}</span>
                </div>

                <Link href={`/manga/${item.mangaId || item.id}`} className="flex items-center space-x-3 flex-1">
                <Image
                  src={
                    item.cover ||
                    (item.mangaId && item.coverFileName
                      ? getCoverUrl(item.mangaId, item.coverFileName, "256")
                      : "/placeholder.svg")
                  }
                  alt={item.title}
                  width={48}
                  height={64}
                  className="object-cover rounded border border-dark-border"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                  // unoptimized // Jika belum yakin domain sudah terdaftar di next.config.js
                />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-dark-text-primary truncate group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-dark-text-secondary">Rank #{item.rank}</p>
                    {item.score && <p className="text-xs text-accent">★ {item.score}</p>}
                  </div>
                </Link>
              </div>

              {/* Action buttons on hover */}
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <Link
                  href={`/read/${item.mangaId || item.id}`}
                  className="p-1 bg-primary/80 hover:bg-primary rounded text-white text-xs"
                  title="Read Now"
                >
                  <BookOpen className="w-3 h-3" />
                </Link>
                <Link
                  href={`/manga/${item.mangaId || item.id}`}
                  className="p-1 bg-dark-text-secondary/80 hover:bg-dark-text-secondary rounded text-white text-xs"
                  title="More Info"
                >
                  <Info className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-dark-text-muted text-sm">No rankings available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingSidebar;
