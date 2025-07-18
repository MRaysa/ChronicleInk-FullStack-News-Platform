import { useState } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import useAuth from "../../hook/useAuth";

const AddPublisher = () => {
  const [publisherName, setPublisherName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("image", logoFile);

    const imgbbKey = import.meta.env.VITE_IMGB_API_KEY;
    const uploadRes = await axios.post(
      `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
      formData
    );

    const imageUrl = uploadRes.data.data.display_url;

    const publisherInfo = {
      name: publisherName,
      logo: imageUrl,
      author: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
    };

    await axiosInstance.post("/admin/add-publisher", publisherInfo);

    // 3. Reset form
    setPublisherName("");
    setLogoFile(null);
    setLoading(false);
    toast.success("Publisher Added!");
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded mt-8">
      <h2 className="text-xl font-bold mb-4">Add Publisher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={publisherName}
          onChange={(e) => setPublisherName(e.target.value)}
          placeholder="Publisher Name"
          required
          className="w-full p-2 border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files[0])}
          required
          className="w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {loading ? "Uploading..." : "Add Publisher"}
        </button>
      </form>
    </div>
  );
};

export default AddPublisher;
