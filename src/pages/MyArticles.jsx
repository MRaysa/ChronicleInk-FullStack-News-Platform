import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useAuth from "../hook/useAuth";
import axiosInstance from "../utils/axiosInstance";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import EditArticle from "../components/EditArticle";

export default function MyArticles() {
  const { user } = useAuth();
  const [modalReason, setModalReason] = useState(null);
  const navigate = useNavigate();
  const [editArticle, setEditArticle] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    title: "",
    description: "",
  });

  const {
    data: articles = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myArticles", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosInstance.get(`/user/articles?email=${user.email}`);
      return res.data;
    },
  });

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`/article/delete/${id}`);
      Swal.fire("Deleted!", "Your article has been deleted.", "success");
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire("Error", "Failed to delete article.", "error");
    }
  }

  if (isLoading) return <Spinner />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Articles</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">#</th>
            <th className="p-2">Title</th>
            <th className="p-2">Status</th>
            <th className="p-2">Premium</th>
            <th className="p-2">Details</th>
            <th className="p-2">Update</th>
            <th className="p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, index) => {
            let statusColor =
              article.status === "Approved"
                ? "text-green-600 bg-green-100"
                : article.status === "Declined"
                ? "text-red-600 bg-red-100"
                : "text-yellow-600 bg-yellow-100";

            return (
              <tr key={article._id} className="text-left border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{article.title}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${statusColor}`}
                  >
                    {article.status}
                  </span>
                  {article.status === "Declined" && article.declineReason && (
                    <button
                      className="ml-2 text-sm text-red-500 underline"
                      onClick={() => setModalReason(article.declineReason)}
                    >
                      View Reason
                    </button>
                  )}
                </td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      article.isPremium
                        ? "text-indigo-600 bg-indigo-100"
                        : "text-gray-500"
                    }`}
                  >
                    {article.isPremium ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-2">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => navigate(`/article/${article._id}`)}
                  >
                    Details
                  </button>
                </td>
                <td className="p-2">
                  <button
                    className="text-yellow-600 hover:underline"
                    onClick={() => {
                      setEditArticle(article);
                      setUpdatedData({
                        title: article.title,
                        description: article.description,
                        image: article.image,
                      });
                    }}
                  >
                    Update
                  </button>
                </td>
                <td className="p-2">
                  <button
                    className="text-red-600 hover:underline"
                    onClick={() => handleDelete(article._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {modalReason && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Decline Reason</h2>
            <p className="text-gray-700">{modalReason}</p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => setModalReason(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {editArticle && (
        <EditArticle
          updatedData={updatedData}
          setUpdatedData={setUpdatedData}
          editArticle={editArticle}
          setEditArticle={setEditArticle}
          refetch={refetch}
        />
      )}
    </div>
  );
}
