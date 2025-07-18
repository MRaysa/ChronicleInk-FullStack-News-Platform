import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { tagsQuery } from "../utils/helper";
import useAuth from "../hook/useAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const fetchArticles = async ({ queryKey }) => {
  const [_key, { search, publisher, selectedTags }] = queryKey;
  const tagQuery = selectedTags.join(",");
  const query = `search=${search}&publisher=${publisher}&tags=${tagQuery}`;
  const res = await axios.get(
    `http://localhost:3000/web/api/articles/approved?${query}`
  );
  return res.data;
};

export default function AllArticles() {
  const [search, setSearch] = useState("");
  const [publisher, setPublisher] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles", { search, publisher, selectedTags }],
    queryFn: fetchArticles,
  });

  const { data: publishers = [] } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/publishers");
      if (data) return data;
      return [];
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-700 my-2">
        📰 All Articles
      </h1>

      <div className="grid gap-6 md:grid-cols-3 mb-10">
        <div className="flex flex-col">
          <label
            htmlFor="search"
            className="text-sm font-medium text-gray-700 mb-2"
          >
            🔍 Search by Title
          </label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. AI Revolution"
            className="w-full border-2 rounded-md  py-[6px] px-5 outline-none focus:ring-1"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="publisher"
            className="text-sm font-medium text-gray-700 mb-2"
          >
            🏢 Filter by Publisher
          </label>
          <select
            id="publisher"
            value={publisher}
            onChange={(e) => setPublisher(e.target.value)}
            className="w-full border-2 py-[6px] px-5 rounded"
          >
            <option value="">Select Publisher</option>
            {publishers.map((p) => (
              <option key={p._id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-[150px_1fr]">
        <div className="flex flex-col">
          <label
            htmlFor="tags"
            className="text-sm font-medium text-gray-700 mb-2"
          >
            🏷️ Filter by Tags
          </label>

          <div className="grid grid-cols-1 gap-2">
            {tagsQuery.map((tag) => {
              const value = tag.toLowerCase();
              const isChecked = selectedTags.includes(value);

              return (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={value}
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTags([...selectedTags, value]);
                      } else {
                        setSelectedTags(
                          selectedTags.filter((t) => t !== value)
                        );
                      }
                    }}
                    className="accent-purple-500"
                  />
                  <span className="text-gray-800">{tag}</span>
                </label>
              );
            })}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading && (
            <div className="w-full flex mt-20 justify-center col-span-full">
              <div className="w-8 h-8 border-4 border-dotted border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          {articles.map((article) => (
            <div
              key={article._id}
              className={`relative rounded-xl overflow-hidden border transition shadow-md ${
                article.isPremium
                  ? "bg-gradient-to-br from-yellow-50 via-white to-yellow-100 border-yellow-400 shadow-yellow-300"
                  : "bg-white border-gray-200"
              } hover:shadow-lg`}
            >
              {/* Premium badge */}
              {article.isPremium && (
                <div className="absolute top-3 left-3 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow">
                  <svg
                    className="w-3 h-3 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.562-.955L10 0l2.95 5.955 6.562.955-4.756 4.635 1.122 6.545z" />
                  </svg>
                  Premium
                </div>
              )}

              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />

              <div className="p-5">
                <h2
                  className={`text-lg font-bold mb-1 ${
                    article.isPremium ? "text-yellow-700" : "text-gray-800"
                  }`}
                >
                  {article.title}
                </h2>
                <p className="text-xs text-gray-500 mb-2">
                  Publisher: {article.publisher}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {article.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-700  line-clamp-3 mb-4">
                  {article.description}
                </p>

                <button
                  disabled={article.isPremium && !user.isPremiumTaken}
                  onClick={() => navigate(`/article/${article._id}`)}
                  className={`w-full py-2 text-sm font-semibold rounded-md transition ${
                    article.isPremium && !user.isPremiumTaken
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-yellow-500 text-white hover:bg-yellow-600"
                  }`}
                >
                  {article.isPremium && !user.isPremiumTaken
                    ? "Subscription Required"
                    : "View Details"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
