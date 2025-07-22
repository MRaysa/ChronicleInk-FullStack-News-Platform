import { useTheme } from "../context/ThemeContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import { toast } from "react-toastify";
import auth from "../config/firebase";
import axiosInstance from "../utils/axiosInstance";
import { motion } from "framer-motion";

export default function SocialLogin() {
  const { theme } = useTheme();

  // Theme-based styles
  const buttonStyles = {
    light: {
      background: "bg-white hover:bg-gray-50",
      border: "border-gray-300",
      text: "text-gray-700",
    },
    dark: {
      background: "bg-gray-700 hover:bg-gray-600",
      border: "border-gray-600",
      text: "text-gray-200",
    },
  };

  const currentTheme = buttonStyles[theme];

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await user.getIdToken();

      const res = await axios.get(
        `https://chronicle-ink-server.vercel.app/web/api/users/${user.uid}/check-exist`
      );

      const userExists = res.data.exists;

      if (!userExists) {
        const userInfo = {
          name: user.displayName || "Anonymous",
          email: user.email,
          uid: user.uid,
          image: user.photoURL,
        };

        await axios.post(
          "https://chronicle-ink-server.vercel.app/web/api/users/register",
          userInfo
        );
      } else {
        await axiosInstance.patch(`/users/${user.uid}/last-login`);
      }

      const { data } = await axios.post(
        "https://chronicle-ink-server.vercel.app/web/api/auth",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.setItem("token", data.token);

      toast.success("Successfully logged in");
      window.location.reload();
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <div className="text-center w-full mt-5">
      <motion.button
        onClick={handleGoogleLogin}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg ${currentTheme.background} ${currentTheme.border} ${currentTheme.text} font-medium transition-colors shadow-sm`}
      >
        <img
          src="http://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
          className="w-5 h-5"
        />
        <span>Continue with Google</span>
      </motion.button>
    </div>
  );
}
