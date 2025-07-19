"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";
import { getRecommendations } from "../services/backendApi";
import { getCoverUrl } from "../lib/mangadex";
import { useAuth } from "../contexts/AuthContext";
import useBookmark from "../hooks/useBookmark";

const RecommendationCarousel = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState("loading");
  const [imageError, setImageError] = useState(false);

  const { user } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmark();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const isValidMangaDxId = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const data = await getRecommendations();

      if (Array.isArray(data) && data.length > 0) {
        const hasAdminData = data.some(item => !item.id.includes("fallback") && !item.id.includes("error-fallback"));
        setDataSource(hasAdminData ? "admin" : "fallback");

        const transformedData = data.map(item => ({
          id: item.id,
          title: item.title || "Unknown Title",
          description: item.description || "No description available",
          mangaId: item.mangaId,
          author: item.author || "Unknown Author",
          cover: isValidMangaDxId(item.mangaId) && item.coverFileName
            ? getCoverUrl(item.mangaId, item.coverFileName, "256")
            : (item.cover || "/placeholder.svg"),
          isValidMangaDxId: isValidMangaDxId(item.mangaId)
        }));

        setRecommendations(transformedData);
      } else {
        throw new Error("No recommendations data received");
      }
    } catch (error) {
      console.warn("⚠️ Failed to load recommendations:", error.message);
      setDataSource("error");
      setRecommendations([
        {
          id: "emergency-fallback-1",
          title: "No Recommendations Yet",
          description: "Admin belum menambahkan rekomendasi manga.",
          mangaId: "emergency-fallback-1",
          author: "System",
          cover: "/placeholder.svg",
          isValidMangaDxId: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setImageError(false);
    setCurrentIndex((prev) => (prev + 1) % recommendations.length);
  };

  const prevSlide = () => {
    setImageError(false);
    setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
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
        description: { en: manga.description }
      },
      relationships: [
        {
          type: "cover_art",
          attributes: {
            fileName: manga.cover
          }
        }
      ]
    };

    toggleBookmark(bookmarkData);
  };

  if (loading) {
    return (
      <div className="relative h-64 mb-8 rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-xl font-medium">Loading recommendations...</div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="relative h-64 mb-8 rounded-lg overflow-hidden bg-gray-600">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-xl font-semibold mb-2">No recommendations available</h3>
            <p className="text-gray-300">Admin belum menambahkan rekomendasi manga</p>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = recommendations[currentIndex];
  const imageSrc = imageError ? "/placeholder.svg" : currentItem.cover;

  return (
    <div className="relative h-[28rem] mb-12 rounded-xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
      {/* Data Source Indicator */}
      {dataSource === "fallback" && (
        <div className="absolute top-2 left-2 z-20 bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-xs font-medium">Demo Mode</div>
      )}
      {dataSource === "admin" && (
        <div className="absolute top-2 left-2 z-20 bg-green-500 text-green-900 px-2 py-1 rounded text-xs font-medium">Live Data</div>
      )}

      {/* Bookmark Button */}
      {user && user.role === "user" && (
        <button
          onClick={(e) => handleBookmark(currentItem, e)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors backdrop-blur-sm"
        >
          {isBookmarked(currentItem.mangaId || currentItem.id) ? (
            <BookmarkCheck className="w-5 h-5 text-yellow-400" />
          ) : (
            <Bookmark className="w-5 h-5 text-white" />
          )}
        </button>
      )}

      <div className="absolute inset-0 flex items-center">
        {/* Cover Image */}
        <div className="w-1/3 flex justify-center">
          <Image
            src={imageSrc}
            alt={currentItem.title}
            width={288}
            height={384}
            className="object-cover rounded-lg shadow-lg"
            onError={() => {
              console.warn(`❌ Failed to load cover for ${currentItem.title}`);
              setImageError(true);
            }}
          />
        </div>

        {/* Content Section */}
        <div className="w-2/3 px-8 text-white">
          <h2 className="text-3xl font-bold mb-4">{currentItem.title}</h2>
          <p className="text-lg opacity-90 mb-6">{currentItem.description}</p>

          {currentItem.isValidMangaDxId ? (
            <Link href={`/manga/${currentItem.mangaId}`} className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Read Now
            </Link>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-gray-600 px-6 py-2 rounded-full font-semibold cursor-not-allowed"
            >
              Preview Only
            </button>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      {recommendations.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {recommendations.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setImageError(false);
                  setCurrentIndex(index);
                }}
                className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendationCarousel;
