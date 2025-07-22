import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import useAuth from "../hook/useAuth";
import { getIdToken, updateProfile } from "firebase/auth";
import axios from "axios";
import SocialLogin from "../components/SocialLogin";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Feather Icons as React components
const EyeIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const Register = () => {
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { createUser } = useAuth();

  // Theme-based colors
  const themeColors = {
    light: {
      bg: "from-blue-100 to-indigo-200",
      card: "bg-white",
      text: "text-gray-800",
      input: "bg-gray-50 border-gray-300 focus:ring-indigo-400",
      button:
        "from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700",
      link: "text-indigo-600 hover:text-indigo-500",
      divider: "border-gray-300",
      socialText: "text-gray-600",
      icon: "text-gray-500",
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
      icon: "text-gray-400",
    },
  };

  const currentTheme = themeColors[theme];

  // Password validation pattern
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,}$/;

  const onSubmit = async (data) => {
    try {
      const { user } = await createUser({
        email: data.email,
        password: data.password,
      });

      if (!user) throw new Error("Something went wrong while creating user.");

      await updateProfile(user, {
        displayName: data.name,
        photoURL: data.image || "",
      });

      const userData = {
        name: user.displayName,
        email: user.email,
        image: user.photoURL,
        uid: user.uid,
      };

      try {
        await axios.post(
          "https://chronicle-ink-server.vercel.app/web/api/users/register",
          userData
        );
      } catch (error) {
        toast.error("User saved failed to backend!");
      }

      const firebaseToken = await getIdToken(user);
      if (!firebaseToken) throw new Error("Failed to get Firebase ID token");

      try {
        const jwtRes = await axios.post(
          "https://chronicle-ink-server.vercel.app/web/api/auth",
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

      toast.success("Registration successful!");
      navigate(location?.state ? location.state : "/");
      window.location.reload();
    } catch (err) {
      const msg = err?.message || "Registration failed.";
      if (msg.includes("email-already-in-use")) {
        toast.error("Email already in use.");
      } else if (msg.includes("weak-password")) {
        toast.error("Password should be at least 6 characters.");
      } else {
        toast.error(msg);
      }
    }
  };

  return (
    <div
      className={`min-h-screen py-10 flex items-center justify-center bg-gradient-to-br ${currentTheme.bg} px-4`}
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
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
          </motion.div>
          <h2 className={`text-3xl font-bold ${currentTheme.text} mb-2`}>
            Create Your Account
          </h2>
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Join us today!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Full Name */}
          <div className="mb-6">
            <label
              className={`block text-sm font-medium ${currentTheme.text} mb-1`}
            >
              Full Name
            </label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name", { required: "Full name is required" })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  currentTheme.input
                } focus:outline-none focus:ring-2 transition ${
                  errors.name
                    ? theme === "dark"
                      ? "border-red-500 focus:ring-red-400"
                      : "border-red-400 focus:ring-red-300"
                    : ""
                }`}
              />
            </motion.div>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1 text-sm text-red-500"
              >
                {errors.name.message}
              </motion.p>
            )}
          </div>

          {/* Email */}
          <div className="mb-6">
            <label
              className={`block text-sm font-medium ${currentTheme.text} mb-1`}
            >
              Email
            </label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <input
                type="email"
                placeholder="john@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Enter a valid email address",
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

          {/* Password */}
          <div className="mb-6">
            <label
              className={`block text-sm font-medium ${currentTheme.text} mb-1`}
            >
              Password
            </label>
            <motion.div whileHover={{ scale: 1.01 }} className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: passwordPattern,
                    message: "Must include uppercase, number & special char",
                  },
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
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className={`w-5 h-5 ${currentTheme.icon}`} />
                ) : (
                  <EyeIcon className={`w-5 h-5 ${currentTheme.icon}`} />
                )}
              </button>
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

          {/* Profile Photo URL */}
          <div className="mb-6">
            <label
              className={`block text-sm font-medium ${currentTheme.text} mb-1`}
            >
              Profile Photo URL
            </label>
            <motion.div whileHover={{ scale: 1.01 }}>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                {...register("image")}
                className={`w-full px-4 py-3 rounded-lg border ${currentTheme.input} focus:outline-none focus:ring-2 transition`}
              />
            </motion.div>
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
                Registering...
              </div>
            ) : (
              "Register"
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
              Or sign up with
            </span>
          </div>
        </div>

        <SocialLogin theme={theme} />

        <div className="mt-6 text-center">
          <p className={currentTheme.socialText}>
            Already have an account?{" "}
            <Link to="/login" className={`font-medium ${currentTheme.link}`}>
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
