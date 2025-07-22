import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

export default function NewsDetails() {
  const { theme } = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();

  // Theme-based colors
  const themeStyles = {
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      secondaryText: "text-gray-600",
      card: "bg-gray-50",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      tag: "bg-blue-100 text-blue-800",
      publisher: "text-blue-600",
    },
    dark: {
      bg: "bg-gray-800",
      text: "text-gray-100",
      secondaryText: "text-gray-300",
      card: "bg-gray-700",
      button: "bg-purple-600 hover:bg-purple-700 text-white",
      tag: "bg-purple-900 text-purple-200",
      publisher: "text-purple-400",
    },
  };

  const currentTheme = themeStyles[theme];

  // scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: news,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["news", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/articles/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-screen"
      >
        <div
          className={`p-6 rounded-lg ${currentTheme.card} shadow-lg text-center`}
        >
          <p className={`text-lg font-medium ${currentTheme.text}`}>
            Failed to load news. Try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`mt-4 px-4 py-2 rounded ${currentTheme.button} transition`}
          >
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${currentTheme.bg} py-12 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-5xl mx-auto">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`mb-8 px-5 py-2.5 rounded-lg ${currentTheme.button} shadow-md transition flex items-center gap-2`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to News
        </motion.button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-xl shadow-xl mb-8"
        >
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-500"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1
            className={`text-4xl font-bold ${currentTheme.text} mb-4 leading-tight`}
          >
            {news.title}
          </h1>

          {/* Publisher and Date */}
          <div className="flex items-center gap-4 mb-6">
            <p className={`text-sm ${currentTheme.secondaryText}`}>
              Published by:{" "}
              <span className={`font-semibold ${currentTheme.publisher}`}>
                {news.publisher}
              </span>
            </p>
            <span className={`text-sm ${currentTheme.secondaryText}`}>
              {new Date(news.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {news.tags.map((tag, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.05 }}
                className={`${currentTheme.tag} text-sm px-3 py-1 rounded-full font-medium`}
              >
                #{tag}
              </motion.span>
            ))}
          </div>

          {/* Description */}
          <div
            className={`prose max-w-none ${
              theme === "dark" ? "prose-invert" : ""
            } text-lg`}
          >
            {news.description.split("\n").map((paragraph, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="mb-6 leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Floating action button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-8 right-8 p-3 rounded-full ${
            theme === "dark" ? "bg-purple-600" : "bg-blue-600"
          } shadow-lg text-white`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinecap="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
