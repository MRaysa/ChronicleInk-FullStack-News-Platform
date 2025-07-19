import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../hook/useAuth";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { FaUserEdit, FaCheck, FaTimes } from "react-icons/fa";

const UpdateProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      website: user?.website || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        website: user.website || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateUserProfile({
        name: data.name,
        website: data.website,
      });
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const bgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const inputBg = theme === "dark" ? "bg-gray-700" : "bg-gray-50";
  const borderColor = theme === "dark" ? "border-gray-600" : "border-gray-300";
  const buttonBg =
    theme === "dark"
      ? "bg-blue-600 hover:bg-blue-700"
      : "bg-blue-500 hover:bg-blue-600";

  return (
    <motion.div
      variants={fadeIn("up", "spring", 0.2, 1)}
      initial="hidden"
      animate="show"
      className={`rounded-lg shadow-lg p-6 ${bgColor} ${textColor}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Profile</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${buttonBg} text-white`}
          >
            <FaUserEdit /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Status Display */}
        <div className="flex items-center gap-4">
          <span className="font-semibold">Status:</span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              user?.isPremiumTaken
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            {user?.isPremiumTaken ? "Premium Member" : "Free Member"}
          </span>
        </div>

        {/* Last Active */}
        <div className="flex items-center gap-4">
          <span className="font-semibold">Last Active:</span>
          <span>
            {new Date(user?.lastActive || new Date()).toLocaleString()}
          </span>
        </div>

        {/* Member Since */}
        <div className="flex items-center gap-4">
          <span className="font-semibold">Member Since:</span>
          <span>
            {new Date(user?.createdAt || new Date()).toLocaleString()}
          </span>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block mb-2 font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Name is required" })}
                className={`w-full p-3 rounded-md border ${borderColor} ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field (disabled) */}
            <div>
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                disabled
                {...register("email")}
                className={`w-full p-3 rounded-md border ${borderColor} ${inputBg} bg-gray-300 dark:bg-gray-600 cursor-not-allowed`}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Email cannot be changed
              </p>
            </div>

            {/* Website Field */}
            <div>
              <label htmlFor="website" className="block mb-2 font-medium">
                Website
              </label>
              <input
                id="website"
                type="url"
                {...register("website")}
                className={`w-full p-3 rounded-md border ${borderColor} ${inputBg} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="https://example.com"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-3 rounded-md ${buttonBg} text-white font-medium disabled:opacity-70`}
              >
                {loading ? (
                  "Updating..."
                ) : (
                  <>
                    <FaCheck /> Save Changes
                  </>
                )}
              </button>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="p-3 rounded-md bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-md bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100">
                {success}
              </div>
            )}
          </form>
        ) : (
          <div className="space-y-4">
            {/* Display View */}
            <div>
              <h3 className="font-semibold">Name</h3>
              <p className="mt-1 p-3 rounded-md bg-gray-100 dark:bg-gray-700">
                {user?.name || "Not provided"}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="mt-1 p-3 rounded-md bg-gray-100 dark:bg-gray-700">
                {user?.email}
              </p>
            </div>

            <div>
              <h3 className="font-semibold">Website</h3>
              <p className="mt-1 p-3 rounded-md bg-gray-100 dark:bg-gray-700">
                {user?.website || "Not provided"}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UpdateProfile;
