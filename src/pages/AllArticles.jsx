import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import useAuth from "../hook/useAuth";
import { getIdToken } from "firebase/auth";
import axios from "axios";
import SocialLogin from "../components/SocialLogin";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const { theme } = useTheme();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { signInUser } = useAuth();

  // Theme-based colors
  const themeColors = {
    light: {
      bg: "from-indigo-100 to-blue-200",
      card: "bg-white",
      text: "text-gray-800",
      input: "bg-gray-50 border-gray-300 focus:ring-indigo-400",
      button:
        "from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
      link: "text-indigo-600 hover:text-indigo-500",
      divider: "border-gray-300",
      socialText: "text-gray-600",
    },
    dark: {
      bg: "from-gray-800 to-gray-900",
      card: "bg-gray-700/90",
      text: "text-gray-100",
      input: "bg-gray-600 border-gray-500 focus:ring-purple-400",
      button:
        "from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800",
      link: "text-purple-400 hover:text-purple-300",
      divider: "border-gray-600",
      socialText: "text-gray-300",
    },
  };

  const currentTheme = themeColors[theme];

  const onSubmit = async (data) => {
    try {
      const { user } = await signInUser({
        email: data.email,
        password: data.password,
      });

      const firebaseToken = await getIdToken(user);

      try {
        const jwtRes = await axiosInstance.post(
          "/auth",
          {},
          {
            headers: {
              Authorization: `Bearer ${firebaseToken}`,
            },
          }
        );
        localStorage.setItem("token", jwtRes.data.token);
      } catch (jwtErr) {
        toast.error("Failed to get JWT token from server.");
      }

      await axiosInstance.patch(`/users/${user.uid}/last-login`);

      toast.success("Login successful!");
      navigate(location?.state ? location.state : "/");
    } catch (error) {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${currentTheme.bg} px-4 py-12`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${
          currentTheme.card
        } p-8 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-sm border ${
          theme === "dark" ? "border-gray-600/30" : "border-gray-200"
        }`}
      >
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-4"
          >
            <div
              className={`w-16 h-16 ${
                theme === "dark" ? "bg-gray-600" : "bg-indigo-100"
              } rounded-full flex items-center justify-center mx-auto`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 ${
                  theme === "dark" ? "text-purple-400" : "text-indigo-600"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </motion.div>
          <h2 className={`text-3xl font-bold ${currentTheme.text} mb-2`}>
            Welcome Back
          </h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Sign in to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-6">
            <label
              className={`block text-sm font-medium ${currentTheme.text} mb-1`}
            >
              Email Address
            </label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email format",
                  },
                })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  currentTheme.input
                } focus:outline-none focus:ring-2 transition ${
                  errors.email
                    ? theme === "dark"
                      ? "border-red-500 focus:ring-red-400"
                      : "border-red-400 focus:ring-red-300"
                    : ""
                }`}
              />
            </motion.div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <label
                className={`block text-sm font-medium ${currentTheme.text}`}
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className={`text-sm ${currentTheme.link}`}
              >
                Forgot password?
              </Link>
            </div>
            <motion.div whileHover={{ scale: 1.01 }}>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  currentTheme.input
                } focus:outline-none focus:ring-2 transition ${
                  errors.password
                    ? theme === "dark"
                      ? "border-red-500 focus:ring-red-400"
                      : "border-red-400 focus:ring-red-300"
                    : ""
                }`}
              />
            </motion.div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.02 }}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white shadow-md transition ${
              isSubmitting
                ? (theme === "dark" ? "bg-indigo-500" : "bg-indigo-400") +
                  " cursor-not-allowed"
                : `bg-gradient-to-r ${currentTheme.button}`
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </motion.button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${currentTheme.divider}`}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span
              className={`px-2 ${
                theme === "dark" ? "bg-gray-700/90" : "bg-white"
              } ${currentTheme.socialText}`}
            >
              Or continue with
            </span>
          </div>
        </div>

        <SocialLogin theme={theme} />

        <div className="mt-6 text-center">
          <p className={currentTheme.socialText}>
            Don't have an account?{" "}
            <Link to="/register" className={`font-medium ${currentTheme.link}`}>
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
