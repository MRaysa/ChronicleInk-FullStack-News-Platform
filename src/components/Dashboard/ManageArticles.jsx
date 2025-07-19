import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";

export default function AllArticlesPage() {
  const [declineArticle, setDeclineArticle] = useState(null);
  const [declineReason, setDeclineReason] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all-articles", page],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/articles?page=${page}&limit=${limit}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const articles = data?.articles || [];
  const totalPages = data?.totalPages || 1;

  const handleApprove = async (id) => {
    try {
      await axiosInstance.patch(`/articles/approve/${id}`);
      toast.success("Article Approved");
      refetch();
    } catch (error) {
      toast.error("Failed to approve article");
      console.error(error);
    }
  };

  const handleDecline = async (id, reason) => {
    try {
      await axiosInstance.patch(`/articles/decline/${id}`, {
        reason,
      });
      id;
      toast.success("Article Declined");
      refetch();
      setDeclineArticle(null);
    } catch (error) {
      toast.error("Failed to decline article");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/articles/delete/${id}`);
      toast.success("Article Deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete article");
      console.error(error);
    }
  };

  const handleMakePremium = async (id) => {
    try {
      await axiosInstance.patch(`/articles/premium/${id}`);
      toast.success("Marked as Premium");
      refetch();
    } catch (error) {
      toast.error("Failed to mark as premium");
      console.error(error);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">All Articles</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Author</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Photo</th>
              <th className="p-2 border">Posted</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Publisher</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article, index) => (
              <tr key={article._id}>
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{article.title}</td>
                <td className="p-2 border">{article.authorName}</td>
                <td className="p-2 border">{article.authorEmail}</td>
                <td className="p-2 border">
                  <img
                    src={article.authorImage}
                    alt="Author"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="p-2 border">
                  {new Date(article.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border capitalize">{article.status}</td>
                <td className="p-2 border">
                  {article.isPremium ? "Premium" : "Free"}
                </td>
                <td className="p-2 border space-x-1 flex flex-wrap">
                  {article.status === "Approved" ? (
                    <span className="py-2 px-2 bg-green-100 text-sm text-green-600 rounded-full">
                      Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApprove(article._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                  )}
                  {article.status === "Declined" ? (
                    <span className="py-2 px-2 bg-red-100 text-sm text-red-600 rounded-full">
                      Declined
                    </span>
                  ) : (
                    <button
                      onClick={() => setDeclineArticle(article._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Decline
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(article._id)}
                    className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    Delete
                  </button>
                  {article.isPremium ? (
                    <span className="py-2 px-2 bg-yellow-500 text-sm text-white rounded-full">
                      Premium
                    </span>
                  ) : (
                    <button
                      onClick={() => handleMakePremium(article._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                    >
                      Make Premium
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setPage(idx + 1)}
            className={`px-3 py-1 rounded ${
              page === idx + 1 ? "bg-blue-500 text-white" : "bg-gray-100"
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Decline Modal */}
      {declineArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-3">Decline Reason</h3>
            <textarea
              className="w-full border p-2 rounded"
              rows="4"
              placeholder="Write reason here..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setDeclineArticle(null)}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecline(declineArticle, declineReason)}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
