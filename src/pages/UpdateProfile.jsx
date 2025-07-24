import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import {
  FaUserEdit,
  FaCheck,
  FaTimes,
  FaUserCircle,
  FaCamera,
  FaSpinner,
  FaArrowLeft,
  FaImage,
  FaTrash,
  FaShieldAlt,
  FaUsersCog,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { FiUser, FiMail, FiImage, FiShield } from "react-icons/fi";

const UpdateProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [adminFeatures, setAdminFeatures] = useState({
    viewAdminPanel: false,
    manageUsers: false,
    systemSettings: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm();

  const watchedName = watch("name");
  const watchedImage = watch("image");

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (userDetails) {
      reset({
        name: userDetails.name || "",
        image: userDetails.image || "",
      });
      setPreviewImage(userDetails.image);

      // Initialize admin features if user is admin
      if (userDetails?.role === "admin") {
        setAdminFeatures({
          viewAdminPanel: userDetails.adminFeatures?.viewAdminPanel || false,
          manageUsers: userDetails.adminFeatures?.manageUsers || false,
          systemSettings: userDetails.adminFeatures?.systemSettings || false,
        });
      }
    }
  }, [userDetails, reset]);

  useEffect(() => {
    if (userDetails) {
      const nameChanged = watchedName !== userDetails.name;
      const imageChanged = watchedImage !== userDetails.image;
      const adminFeaturesChanged =
        userDetails?.role === "admin" &&
        (adminFeatures.viewAdminPanel !==
          userDetails.adminFeatures?.viewAdminPanel ||
          adminFeatures.manageUsers !==
            userDetails.adminFeatures?.manageUsers ||
          adminFeatures.systemSettings !==
            userDetails.adminFeatures?.systemSettings);
      setHasChanges(nameChanged || imageChanged || adminFeaturesChanged);
    }
  }, [watchedName, watchedImage, userDetails, adminFeatures]);

  const fetchUserDetails = async () => {
    try {
      const { data } = await axiosInstance.get("/users/user-data");
      setUserDetails(data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load profile data");
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setImageUploading(true);
      const response = await axios.post(
        `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_IMGB_API_KEY
        }`,
        formData
      );

      if (response.data.success) {
        const imageUrl = response.data.data.url;
        setValue("image", imageUrl);
        setPreviewImage(imageUrl);
        toast.success("Image uploaded successfully!");
        return imageUrl;
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image. Please try again.");
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setValue("image", "");
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const queryClient = useQueryClient();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const updateData = {
        name: data.name,
        image: data.image || "",
      };

      // Include admin features if user is admin
      if (userDetails?.role === "admin") {
        updateData.adminFeatures = adminFeatures;
      }

      const response = await axiosInstance.patch("/users/update", updateData);

      if (response.data) {
        await updateUserProfile(data.name, data.image || "");
        await fetchUserDetails();

        queryClient.invalidateQueries({ queryKey: ["userDetails"] });

        toast.success("Profile updated successfully!");
        setHasChanges(false);

        setTimeout(() => {
          navigate("/my-profile");
        }, 1500);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    if (userDetails) {
      reset({
        name: userDetails.name || "",
        image: userDetails.image || "",
      });
      setPreviewImage(userDetails.image);
      if (userDetails?.role === "admin") {
        setAdminFeatures({
          viewAdminPanel: userDetails.adminFeatures?.viewAdminPanel || false,
          manageUsers: userDetails.adminFeatures?.manageUsers || false,
          systemSettings: userDetails.adminFeatures?.systemSettings || false,
        });
      }
      setHasChanges(false);
    }
  };

  const getRoleConfig = (role) => {
    switch (role) {
      case "premium":
        return {
          label: "Premium User",
          bgGradient: "from-yellow-400 to-orange-500",
          textColor: "text-yellow-600",
          darkTextColor: "text-yellow-400",
          icon: HiSparkles,
        };
      case "admin":
        return {
          label: "Administrator",
          bgGradient: "from-purple-400 to-pink-500",
          textColor: "text-purple-600",
          darkTextColor: "text-purple-400",
          icon: FaShieldAlt,
        };
      default:
        return {
          label: "Standard User",
          bgGradient: "from-blue-400 to-cyan-500",
          textColor: "text-blue-600",
          darkTextColor: "text-blue-400",
          icon: FiUser,
        };
    }
  };

  if (!userDetails) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark"
            ? "bg-gradient-to-br from-gray-900 to-gray-800"
            : "bg-gradient-to-br from-slate-50 to-slate-100"
        }`}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full border-blue-500 border-3 border-t-transparent"
        />
      </div>
    );
  }

  const roleConfig = getRoleConfig(userDetails?.role);
  const RoleIcon = roleConfig.icon;

  const themeStyles = {
    light: {
      bg: "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
      cardBg: "bg-white",
      text: "text-gray-800",
      border: "border-slate-200",
      inputBg: "bg-slate-50",
      button: {
        primary:
          "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white",
        secondary:
          "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
        danger: "bg-red-500 hover:bg-red-600 text-white",
      },
      adminPanel: "bg-purple-50 border-purple-200",
      checkbox: "text-purple-600 border-gray-300 focus:ring-purple-500",
    },
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      cardBg: "bg-gray-800",
      text: "text-gray-100",
      border: "border-gray-700",
      inputBg: "bg-gray-700",
      button: {
        primary:
          "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
        secondary:
          "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600",
        danger: "bg-red-600 hover:bg-red-700 text-white",
      },
      adminPanel: "bg-purple-900/20 border-purple-800/50",
      checkbox: "text-purple-400 border-gray-600 focus:ring-purple-500",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <div className={`min-h-screen ${currentTheme.bg} p-4 sm:p-6 lg:p-8`}>
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 items-center mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/my-profile")}
            className={`p-3 ${currentTheme.cardBg} rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border ${currentTheme.border}`}
          >
            <FaArrowLeft className={`w-5 h-5 ${currentTheme.text}`} />
          </motion.button>

          <div>
            <h1
              className={`text-3xl font-bold bg-gradient-to-r ${
                theme === "dark"
                  ? "from-slate-300 to-slate-100"
                  : "from-slate-700 to-slate-900"
              } bg-clip-text text-transparent`}
            >
              Update Profile
            </h1>
            <p className={`${currentTheme.text} opacity-80 mt-1`}>
              Modify your account information
            </p>
          </div>
        </motion.div>

        {/* Main Update Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`${currentTheme.cardBg} rounded-3xl shadow-xl border ${currentTheme.border} overflow-hidden`}
        >
          {/* Header with Role Badge */}
          <div
            className={`bg-gradient-to-r ${roleConfig.bgGradient} p-6 relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center text-white">
              <RoleIcon className="mx-auto mb-2 w-8 h-8" />
              <h2 className="text-xl font-semibold">{roleConfig.label}</h2>
              <p className="text-sm text-white/80">
                Update your profile information
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Profile Image Section */}
            <div className="text-center">
              <div className="inline-block relative group">
                <div className="overflow-hidden relative mx-auto w-32 h-32 rounded-full border-4 shadow-lg border-slate-200 dark:border-gray-700">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Profile preview"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          watchedName || user?.name || "User"
                        )}&background=6366f1&color=ffffff&size=200`;
                      }}
                    />
                  ) : (
                    <div className="flex justify-center items-center w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-gray-600 dark:to-gray-700">
                      <FaUserCircle className="w-16 h-16 text-slate-400 dark:text-gray-500" />
                    </div>
                  )}

                  {imageUploading && (
                    <div className="flex absolute inset-0 justify-center items-center bg-black/50">
                      <FaSpinner className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>

                {/* Image Upload Buttons */}
                <div className="flex gap-2 justify-center mt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imageUploading}
                    className={`px-4 py-2 ${currentTheme.button.primary} rounded-xl transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <FaCamera className="w-4 h-4" />
                    {imageUploading ? "Uploading..." : "Change Photo"}
                  </motion.button>

                  {previewImage && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={removeImage}
                      className={`px-4 py-2 ${currentTheme.button.danger} rounded-xl transition-colors duration-200 flex items-center gap-2`}
                    >
                      <FaTrash className="w-4 h-4" />
                      Remove
                    </motion.button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  className={`block text-sm font-medium ${currentTheme.text} mb-2 flex items-center gap-2`}
                >
                  <FiUser className="w-4 h-4" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Name must not exceed 50 characters",
                      },
                    })}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                      errors.name
                        ? "border-red-300 focus:border-red-500"
                        : `${currentTheme.border} focus:border-blue-500 ${currentTheme.inputBg}`
                    } ${currentTheme.text}`}
                    placeholder="Enter your full name"
                  />
                  {watchedName && watchedName !== userDetails?.name && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-1 items-center mt-2 text-sm text-red-500"
                  >
                    <FaTimes className="w-3 h-3" />
                    {errors.name.message}
                  </motion.p>
                )}
              </div>

              {/* Email Field (Read-only) */}
              <div>
                <label
                  className={`block text-sm font-medium ${currentTheme.text} mb-2 flex items-center gap-2`}
                >
                  <FiMail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={userDetails?.email || ""}
                  disabled
                  className={`w-full px-4 py-3 border-2 ${currentTheme.border} rounded-xl ${currentTheme.inputBg} ${currentTheme.text} opacity-80 cursor-not-allowed`}
                  placeholder="Email cannot be changed"
                />
                <p className={`text-xs ${currentTheme.text} opacity-60 mt-2`}>
                  Email address cannot be modified for security reasons
                </p>
              </div>

              {/* Admin Features Section */}
              {userDetails?.role === "admin" && (
                <div
                  className={`p-6 rounded-xl border ${currentTheme.border} ${currentTheme.adminPanel}`}
                >
                  <div className="flex gap-3 items-center mb-4">
                    <FaUsersCog className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h3
                      className={`text-lg font-semibold ${currentTheme.text}`}
                    >
                      Administrator Privileges
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="viewAdminPanel"
                        checked={adminFeatures.viewAdminPanel}
                        onChange={(e) =>
                          setAdminFeatures({
                            ...adminFeatures,
                            viewAdminPanel: e.target.checked,
                          })
                        }
                        className={`h-4 w-4 rounded ${currentTheme.checkbox} focus:ring-2`}
                      />
                      <label
                        htmlFor="viewAdminPanel"
                        className={`ml-3 block text-sm ${currentTheme.text}`}
                      >
                        Access Admin Dashboard
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="manageUsers"
                        checked={adminFeatures.manageUsers}
                        onChange={(e) =>
                          setAdminFeatures({
                            ...adminFeatures,
                            manageUsers: e.target.checked,
                          })
                        }
                        className={`h-4 w-4 rounded ${currentTheme.checkbox} focus:ring-2`}
                      />
                      <label
                        htmlFor="manageUsers"
                        className={`ml-3 block text-sm ${currentTheme.text}`}
                      >
                        Manage Users
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="systemSettings"
                        checked={adminFeatures.systemSettings}
                        onChange={(e) =>
                          setAdminFeatures({
                            ...adminFeatures,
                            systemSettings: e.target.checked,
                          })
                        }
                        className={`h-4 w-4 rounded ${currentTheme.checkbox} focus:ring-2`}
                      />
                      <label
                        htmlFor="systemSettings"
                        className={`ml-3 block text-sm ${currentTheme.text}`}
                      >
                        Configure System Settings
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Hidden Image Field */}
              <input type="hidden" {...register("image")} />
            </div>

            {/* Changes Indicator */}
            <AnimatePresence>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-blue-50 rounded-xl border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                >
                  <div className="flex gap-2 items-center text-blue-700 dark:text-blue-300">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">
                      You have unsaved changes
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-6 border-t sm:flex-row border-slate-200 dark:border-gray-700">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || imageUploading || !hasChanges}
                className={`flex-1 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl ${
                  isLoading || imageUploading || !hasChanges
                    ? "bg-slate-300 dark:bg-gray-700 text-slate-500 dark:text-gray-400 cursor-not-allowed"
                    : `${currentTheme.button.primary}`
                }`}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FaCheck className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetForm}
                disabled={isLoading || imageUploading || !hasChanges}
                className={`flex-1 px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 border ${
                  isLoading || imageUploading || !hasChanges
                    ? "bg-slate-100 dark:bg-gray-700 text-slate-400 dark:text-gray-500 border-slate-200 dark:border-gray-600 cursor-not-allowed"
                    : `${currentTheme.button.secondary}`
                }`}
              >
                <FaTimes className="w-5 h-5" />
                Reset
              </motion.button>
            </div>

            {/* Cancel Button */}
            <div className="pt-4 text-center">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/my-profile")}
                disabled={isLoading || imageUploading}
                className={`${currentTheme.text} opacity-80 hover:opacity-100 transition-colors duration-200 text-sm font-medium underline underline-offset-2`}
              >
                Cancel and go back to profile
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Additional Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`mt-6 ${currentTheme.cardBg} rounded-2xl shadow-lg border ${currentTheme.border} p-6`}
        >
          <div className="flex gap-4 items-start">
            <div className="flex flex-shrink-0 justify-center items-center w-10 h-10 bg-blue-100 rounded-xl dark:bg-blue-900/20">
              <FiImage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className={`font-semibold ${currentTheme.text} mb-2`}>
                Profile Image Guidelines
              </h3>
              <ul
                className={`text-sm ${currentTheme.text} opacity-80 space-y-1`}
              >
                <li>• Supported formats: JPG, PNG, GIF, WebP</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Recommended dimensions: 400x400 pixels</li>
                <li>• Square images work best for profile pictures</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Role-specific Features */}
        {userDetails?.role === "premium" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 shadow-lg dark:from-yellow-900/20 dark:to-orange-900/20 dark:border-yellow-800"
          >
            <div className="flex gap-3 items-center mb-4">
              <HiSparkles className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Premium Features
              </h3>
            </div>
            <div className="grid gap-3 text-sm text-yellow-700 sm:grid-cols-2 dark:text-yellow-300">
              <div className="flex gap-2 items-center">
                <FaCheck className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                Higher quality image uploads
              </div>
              <div className="flex gap-2 items-center">
                <FaCheck className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                Unlimited profile updates
              </div>
              <div className="flex gap-2 items-center">
                <FaCheck className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                Priority support
              </div>
              <div className="flex gap-2 items-center">
                <FaCheck className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                Advanced customization
              </div>
            </div>
          </motion.div>
        )}

        {userDetails?.role === "admin" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 shadow-lg dark:from-purple-900/20 dark:to-pink-900/20 dark:border-purple-800"
          >
            <div className="flex gap-3 items-center mb-4">
              <FiShield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-purple-800 dark:text-purple-200">
                Administrator Privileges
              </h3>
            </div>
            <div className="grid gap-3 text-sm text-purple-700 sm:grid-cols-2 dark:text-purple-300">
              <div className="flex gap-2 items-center">
                <FaCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Full system access
              </div>
              <div className="flex gap-2 items-center">
                <FaCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                User management
              </div>
              <div className="flex gap-2 items-center">
                <FaCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Content moderation
              </div>
              <div className="flex gap-2 items-center">
                <FaCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                System configuration
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UpdateProfile;
