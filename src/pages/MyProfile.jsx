import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";
import { FaUserEdit, FaUserCircle, FaSpinner } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import {
  FiMail,
  FiCalendar,
  FiClock,
  FiRefreshCw,
  FiUser,
  FiShield,
} from "react-icons/fi";
import { RiVipCrownLine } from "react-icons/ri";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";

const ProfileHeader = ({ user, onEdit, onRefresh, theme }) => {
  const themeStyles = {
    light: {
      bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
      text: "text-white",
    },
    dark: {
      bg: "bg-gradient-to-r from-gray-800 to-gray-900",
      text: "text-gray-100",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <div className={`relative h-40 ${currentTheme.bg}`}>
      <div className="absolute -bottom-16 left-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
            {user?.image ? (
              <img
                src={user.image}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.name || "User"
                  )}&background=6366f1&color=ffffff&size=200`;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center">
                <FaUserCircle className="w-16 h-16 text-slate-400 dark:text-gray-500" />
              </div>
            )}
          </div>
          <div className="absolute bottom-0 right-0 flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onEdit}
              className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
            >
              <FaUserEdit className="text-purple-600 dark:text-purple-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              className="p-3 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
            >
              <FiRefreshCw className="text-purple-600 dark:text-purple-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileStats = ({ user, theme }) => {
  const themeStyles = {
    light: {
      bg: "bg-white",
      text: "text-gray-800",
      border: "border-gray-200",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    dark: {
      bg: "bg-gray-800",
      text: "text-gray-100",
      border: "border-gray-700",
      iconBg: "bg-indigo-900/30",
      iconColor: "text-indigo-400",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  const formatDate = (dateString) => {
    if (!dateString) return "Never logged in";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleConfig = (role) => {
    switch (role) {
      case "premium":
        return {
          label: "Premium Member",
          icon: RiVipCrownLine,
          color: "text-yellow-500",
          bg: "bg-yellow-100 dark:bg-yellow-900/30",
        };
      case "admin":
        return {
          label: "Administrator",
          icon: FiShield,
          color: "text-purple-500",
          bg: "bg-purple-100 dark:bg-purple-900/30",
        };
      default:
        return {
          label: "Standard User",
          icon: FiUser,
          color: "text-blue-500",
          bg: "bg-blue-100 dark:bg-blue-900/30",
        };
    }
  };

  const roleConfig = getRoleConfig(user?.role);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Last Active */}
      <div
        className={`p-4 rounded-xl border ${currentTheme.border} ${currentTheme.bg} shadow-sm`}
      >
        <div className="flex items-center">
          <div className={`p-2 ${currentTheme.iconBg} rounded-lg mr-3`}>
            <FiClock className={`${currentTheme.iconColor}`} />
          </div>
          <div>
            <p className={`text-sm ${currentTheme.text} opacity-80`}>
              Last Active
            </p>
            <p className={`font-medium ${currentTheme.text}`}>
              {formatDate(user?.lastLogin)}
            </p>
          </div>
        </div>
      </div>

      {/* Member Since */}
      <div
        className={`p-4 rounded-xl border ${currentTheme.border} ${currentTheme.bg} shadow-sm`}
      >
        <div className="flex items-center">
          <div className={`p-2 ${currentTheme.iconBg} rounded-lg mr-3`}>
            <FiCalendar className={`${currentTheme.iconColor}`} />
          </div>
          <div>
            <p className={`text-sm ${currentTheme.text} opacity-80`}>
              Member Since
            </p>
            <p className={`font-medium ${currentTheme.text}`}>
              {formatDate(user?.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div
        className={`p-4 rounded-xl border ${currentTheme.border} ${currentTheme.bg} shadow-sm`}
      >
        <div className="flex items-center">
          <div className={`p-2 ${roleConfig.bg} rounded-lg mr-3`}>
            <roleConfig.icon className={`${roleConfig.color}`} />
          </div>
          <div>
            <p className={`text-sm ${currentTheme.text} opacity-80`}>Status</p>
            <div className="flex items-center gap-2">
              <p className={`font-medium ${currentTheme.text}`}>
                {roleConfig.label}
              </p>
              {user?.role === "premium" && (
                <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-full">
                  PRO
                </span>
              )}
            </div>
            {user?.premiumExpiry && (
              <p className={`text-xs mt-1 ${currentTheme.text} opacity-80`}>
                Expires: {formatDate(user.premiumExpiry)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MyProfile = () => {
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/users/user-data");
      setUserDetails(data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const updateLastLogin = async () => {
    try {
      if (user?.uid) {
        await axiosInstance.patch(`/users/${user.uid}/last-login`);
      }
    } catch (err) {
      console.error("Failed to update last login:", err);
    }
  };

  useEffect(() => {
    if (user?.uid) {
      updateLastLogin();
    }
  }, [user?.uid]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="p-8 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl max-w-md w-full text-center">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
            Please Sign In
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            You need to be logged in to view this page
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const themeStyles = {
    light: {
      bg: "bg-gradient-to-br from-indigo-50 to-purple-50",
      cardBg: "bg-white/90",
      cardText: "text-gray-800",
      border: "border-gray-200/50",
    },
    dark: {
      bg: "bg-gradient-to-br from-gray-900 to-gray-800",
      cardBg: "bg-gray-800/90",
      cardText: "text-gray-100",
      border: "border-gray-700/50",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.light;

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} py-10 px-4 sm:px-6 lg:px-8`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div
          className={`${currentTheme.cardBg} backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl border ${currentTheme.border}`}
        >
          <ProfileHeader
            user={userDetails || user}
            onEdit={() => navigate("/update-profile")}
            onRefresh={fetchUserDetails}
            theme={theme}
          />

          {/* Profile Content */}
          <div className="pt-20 px-6 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className={`text-3xl font-bold ${currentTheme.cardText}`}>
                  {userDetails?.name || user?.name || "Anonymous User"}
                </h1>
                <div
                  className={`flex items-center mt-2 ${currentTheme.cardText} opacity-80`}
                >
                  <FiMail className="mr-2" />
                  <span>{userDetails?.email || user?.email}</span>
                </div>
              </div>
            </div>

            <ProfileStats user={userDetails || user} theme={theme} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile;
