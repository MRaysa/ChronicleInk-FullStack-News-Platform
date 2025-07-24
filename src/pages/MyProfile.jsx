import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  FiMail,
  FiCalendar,
  FiEdit2,
  FiClock,
  FiRefreshCw,
  FiUser,
  FiShield,
} from "react-icons/fi";
import { RiVipCrownLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: userDetails, loading } = useQuery({
    queryKey: ["userDetails"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/user-data");
      return data.user;
    },
    onError: () => {
      toast.error("Failed to load profile data");
    },
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleConfig = (role) => {
    const baseConfig = {
      premium: {
        label: "Premium User",
        icon: RiVipCrownLine,
        textColor: "text-yellow-600",
        darkTextColor: "text-yellow-400",
        bgColor: "bg-yellow-50",
        darkBgColor: "bg-yellow-900/20",
        borderColor: "border-yellow-200",
        darkBorderColor: "border-yellow-800/50",
      },
      admin: {
        label: "Administrator",
        icon: FiShield,
        textColor: "text-purple-600",
        darkTextColor: "text-purple-400",
        bgColor: "bg-purple-50",
        darkBgColor: "bg-purple-900/20",
        borderColor: "border-purple-200",
        darkBorderColor: "border-purple-800/50",
      },
      default: {
        label: "Standard User",
        icon: FiUser,
        textColor: "text-blue-600",
        darkTextColor: "text-blue-400",
        bgColor: "bg-blue-50",
        darkBgColor: "bg-blue-900/20",
        borderColor: "border-blue-200",
        darkBorderColor: "border-blue-800/50",
      },
    };

    return {
      ...baseConfig.default,
      ...(role === "premium" && baseConfig.premium),
      ...(role === "admin" && baseConfig.admin),
    };
  };

  const isPremiumActive = () => {
    if (!userDetails?.premiumExpiry || userDetails.role !== "premium")
      return false;
    return new Date(userDetails.premiumExpiry) > new Date();
  };

  if (loading) {
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

  // Theme-based styles
  const themeStyles = {
    light: {
      bg: "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100",
      cardBg: "bg-white",
      text: "text-slate-800",
      secondaryText: "text-slate-600",
      mutedText: "text-slate-500",
      border: "border-slate-200",
      contentBg: "bg-slate-50",
      button: {
        primary:
          "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white",
        secondary:
          "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
      },
    },
    dark: {
      bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      cardBg: "bg-gray-800",
      text: "text-gray-100",
      secondaryText: "text-gray-300",
      mutedText: "text-gray-400",
      border: "border-gray-700",
      contentBg: "bg-gray-700",
      button: {
        primary:
          "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
        secondary:
          "bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600",
      },
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <div className={`min-h-screen ${currentTheme.bg} p-4 sm:p-6 lg:p-8`}>
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1
            className={`text-4xl font-bold bg-gradient-to-r ${
              theme === "dark"
                ? "from-slate-300 to-slate-100"
                : "from-slate-700 to-slate-900"
            } bg-clip-text text-transparent mb-2`}
          >
            My Profile
          </h1>
          <p className={currentTheme.secondaryText}>
            Manage account information and preferences
          </p>
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`${currentTheme.cardBg} rounded-3xl shadow-xl border ${currentTheme.border} overflow-hidden mb-6`}
        >
          {/* Profile Header with Gradient */}
          <div
            className={`bg-gradient-to-r ${
              userDetails?.role === "premium"
                ? "from-yellow-400 to-orange-500"
                : userDetails?.role === "admin"
                ? "from-purple-400 to-pink-500"
                : "from-blue-400 to-cyan-500"
            } p-8 relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="flex relative z-10 flex-col gap-6 items-center sm:flex-row">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="overflow-hidden w-24 h-24 rounded-full border-4 border-white shadow-xl sm:w-32 sm:h-32 dark:border-gray-800">
                  <img
                    src={userDetails?.image}
                    alt={user?.name || "User"}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user?.name || "User"
                      )}&background=6366f1&color=ffffff&size=200`;
                    }}
                  />
                </div>
                {userDetails?.role === "premium" && isPremiumActive() && (
                  <div className="absolute -top-2 -right-2 p-2 bg-yellow-400 rounded-full shadow-lg">
                    <HiSparkles className="w-5 h-5 text-yellow-800" />
                  </div>
                )}
              </motion.div>

              {/* User Info */}
              <div className="text-center text-white sm:text-left">
                <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
                  {userDetails?.name}
                </h2>
                <div className="flex gap-2 justify-center items-center mb-3 sm:justify-start">
                  <RoleIcon className="w-5 h-5" />
                  <span className="font-medium text-white/90">
                    {roleConfig.label}
                  </span>
                </div>
                <p className="text-sm text-white/80 sm:text-base">
                  Member since{" "}
                  {formatDate(userDetails?.createdAt).split(" at")[0]}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3
                  className={`text-xl font-semibold ${currentTheme.text} mb-4 flex items-center gap-2`}
                >
                  <FiUser className="w-5 h-5" />
                  Basic Information
                </h3>

                <div className="space-y-3">
                  <div
                    className={`flex items-center gap-3 p-3 ${
                      theme === "dark" ? "bg-gray-700" : "bg-slate-50"
                    } rounded-xl`}
                  >
                    <FiMail className={`w-5 h-5 ${currentTheme.mutedText}`} />
                    <div>
                      <p className={`text-sm ${currentTheme.mutedText}`}>
                        Email Address
                      </p>
                      <p className={`font-medium ${currentTheme.text}`}>
                        {user?.email || userDetails?.email}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-3 p-3 ${
                      theme === "dark" ? "bg-gray-700" : "bg-slate-50"
                    } rounded-xl`}
                  >
                    <FiUser className={`w-5 h-5 ${currentTheme.mutedText}`} />
                    <div>
                      <p className={`text-sm ${currentTheme.mutedText}`}>
                        Full Name
                      </p>
                      <p className={`font-medium ${currentTheme.text}`}>
                        {userDetails?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Activity */}
              <div className="space-y-4">
                <h3
                  className={`text-xl font-semibold ${currentTheme.text} mb-4 flex items-center gap-2`}
                >
                  <FiClock className="w-5 h-5" />
                  Account Activity
                </h3>

                <div className="space-y-3">
                  <div
                    className={`flex items-center gap-3 p-3 ${
                      theme === "dark" ? "bg-gray-700" : "bg-slate-50"
                    } rounded-xl`}
                  >
                    <FiCalendar
                      className={`w-5 h-5 ${currentTheme.mutedText}`}
                    />
                    <div>
                      <p className={`text-sm ${currentTheme.mutedText}`}>
                        Last Login
                      </p>
                      <p className={`font-medium ${currentTheme.text}`}>
                        {formatDate(userDetails?.lastLogin)}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-3 p-3 ${
                      theme === "dark" ? "bg-gray-700" : "bg-slate-50"
                    } rounded-xl`}
                  >
                    <FiCalendar
                      className={`w-5 h-5 ${currentTheme.mutedText}`}
                    />
                    <div>
                      <p className={`text-sm ${currentTheme.mutedText}`}>
                        Account Created
                      </p>
                      <p className={`font-medium ${currentTheme.text}`}>
                        {formatDate(userDetails?.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Status */}
            {userDetails?.role === "premium" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`mt-8 p-6 rounded-2xl border ${
                  theme === "dark"
                    ? "bg-yellow-900/20 border-yellow-800/50"
                    : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
                }`}
              >
                <div className="flex gap-3 items-center mb-4">
                  <RiVipCrownLine
                    className={`w-6 h-6 ${
                      theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                    }`}
                  />
                  <h3
                    className={`text-xl font-semibold ${
                      theme === "dark" ? "text-yellow-300" : "text-yellow-800"
                    }`}
                  >
                    Premium Membership
                  </h3>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                      }`}
                    >
                      Premium Since
                    </p>
                    <p
                      className={`font-medium ${
                        theme === "dark" ? "text-yellow-300" : "text-yellow-800"
                      }`}
                    >
                      {formatDate(userDetails?.premiumTaken)}
                    </p>
                  </div>

                  {userDetails?.premiumExpiry && (
                    <div>
                      <p
                        className={`text-sm ${
                          theme === "dark"
                            ? "text-yellow-400"
                            : "text-yellow-600"
                        }`}
                      >
                        Expires On
                      </p>
                      <p
                        className={`font-medium ${
                          theme === "dark"
                            ? "text-yellow-300"
                            : "text-yellow-800"
                        }`}
                      >
                        {formatDate(userDetails?.premiumExpiry)}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          isPremiumActive()
                            ? "text-green-800 bg-green-100 dark:bg-green-900/50 dark:text-green-300"
                            : "text-red-800 bg-red-100 dark:bg-red-900/50 dark:text-red-300"
                        }`}
                      >
                        {isPremiumActive() ? "Active" : "Expired"}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-6 mt-8 border-t sm:flex-row border-slate-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/update-profile")}
                className={`flex-1 ${currentTheme.button.primary} px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl`}
              >
                <FiEdit2 className="w-5 h-5" />
                Edit Profile
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${currentTheme.cardBg} p-6 rounded-2xl shadow-lg border ${currentTheme.border}`}
          >
            <div className="flex gap-3 items-center">
              <div
                className={`w-12 h-12 ${
                  theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"
                } rounded-xl flex items-center justify-center`}
              >
                <FiUser
                  className={`w-6 h-6 ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                />
              </div>
              <div>
                <p className={`text-sm ${currentTheme.mutedText}`}>
                  Account Type
                </p>
                <p className={`font-semibold ${currentTheme.text} capitalize`}>
                  {userDetails?.role}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${currentTheme.cardBg} p-6 rounded-2xl shadow-lg border ${currentTheme.border}`}
          >
            <div className="flex gap-3 items-center">
              <div
                className={`w-12 h-12 ${
                  theme === "dark" ? "bg-green-900/30" : "bg-green-100"
                } rounded-xl flex items-center justify-center`}
              >
                <FiClock
                  className={`w-6 h-6 ${
                    theme === "dark" ? "text-green-400" : "text-green-600"
                  }`}
                />
              </div>
              <div>
                <p className={`text-sm ${currentTheme.mutedText}`}>
                  Member For
                </p>
                <p className={`font-semibold ${currentTheme.text}`}>
                  {userDetails?.createdAt
                    ? Math.floor(
                        (new Date() - new Date(userDetails.createdAt)) /
                          (1000 * 60 * 60 * 24)
                      )
                    : 0}{" "}
                  days
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${currentTheme.cardBg} p-6 rounded-2xl shadow-lg border ${currentTheme.border}`}
          >
            <div className="flex gap-3 items-center">
              <div
                className={`w-12 h-12 ${
                  theme === "dark" ? roleConfig.darkBgColor : roleConfig.bgColor
                } rounded-xl flex items-center justify-center`}
              >
                <RoleIcon
                  className={`w-6 h-6 ${
                    theme === "dark"
                      ? roleConfig.darkTextColor
                      : roleConfig.textColor
                  }`}
                />
              </div>
              <div>
                <p className={`text-sm ${currentTheme.mutedText}`}>Status</p>
                <p className={`font-semibold ${currentTheme.text}`}>
                  {userDetails?.role === "premium" && isPremiumActive()
                    ? "Premium Active"
                    : "Standard"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
