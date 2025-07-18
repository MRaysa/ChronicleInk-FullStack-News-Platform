import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../Spinner";

const ManageUsers = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all-articles", page],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/all-users?page=${page}&limit=${limit}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  const handleMakeAdmin = async (id) => {
    try {
      await axiosInstance.patch(`/users/admin/${id}`);
      toast.success("User promoted to admin");
      refetch();
    } catch (err) {
      toast.error("Failed to make admin");
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">All Users</h2>
      </CardHeader>
      <CardContent>
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Photo</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={user._id} className="text-sm">
                <td className="p-2 border">{i + 1}</td>
                <td className="p-2 border">
                  <img
                    src={user.image || "/placeholder.jpg"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td className="p-2 border">{user.name}</td>
                <td className="p-2 border">{user.email}</td>
                <td className="p-2 border">
                  {user.role === "admin" ? (
                    <span className="text-green-600 font-semibold">Admin</span>
                  ) : (
                    <Button onClick={() => handleMakeAdmin(user._id)} size="sm">
                      Make Admin
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
      </CardContent>
    </Card>
  );
};

export default ManageUsers;
