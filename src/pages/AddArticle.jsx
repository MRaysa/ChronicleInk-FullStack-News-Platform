import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useAuth from "../hook/useAuth";
import axiosInstance from "../utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

const tagOptions = [
  { value: "tech", label: "Tech" },
  { value: "health", label: "Health" },
  { value: "politics", label: "Politics" },
  { value: "sports", label: "Sports" },
  { value: "Technology", label: "Technology" },
  { value: "Ai", label: "AI" },
  { value: "Future", label: "Future" },
];

export default function AddArticleForm() {
  const { data: publishers = [], isLoading } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/publishers");
      if (data) return data;
      return [];
    },
  });


  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const imageFile = data.image[0];
      const formData = new FormData();
      formData.append("image", imageFile);

      const imgbKey = import.meta.env.VITE_IMGB_API_KEY;
      const imgUploadRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbKey}`,
        formData
      );
      const imageUrl = imgUploadRes.data.data.url;

      const article = {
        title: data.title,
        image: imageUrl,
        publisher: data.publisher,
        tags: data.tags.map((tag) => tag.value),
        description: data.description,
        authorName: user.name,
        authorImage: user.image,
        authorEmail: user.email,
        status: "Pending",
        isPremium: false,
        views: 0,
      };

      await axiosInstance.post("/articles", article);
      toast.success("Article submitted for review");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl my-10 mx-auto bg-gray-50 border border-gray-200 rounded-lg p-10 shadow-md">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-8">
        📰 Submit Your Article
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Title
          </label>
          <input
            {...register("title", { required: true })}
            type="text"
            placeholder="Enter article title"
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Image
          </label>
          <input
            {...register("image", { required: true })}
            type="file"
            accept="image/*"
            className="w-full border rounded-md px-4 py-2 bg-white focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Publisher
          </label>
          <select
            {...register("publisher", { required: true })}
            className="w-full border rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Publisher</option>
            {publishers.map((p) => (
              <option key={p._id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tags
          </label>
          <Controller
            name="tags"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                options={tagOptions}
                isMulti
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register("description", { required: true })}
            rows="5"
            placeholder="Write your article..."
            className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200"
          >
            {loading ? "Submitting..." : "Submit Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
