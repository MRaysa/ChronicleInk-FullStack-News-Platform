import { Link, NavLink } from "react-router-dom";
import useAuth from "../hook/useAuth";
import { motion } from "framer-motion"; // Import motion from framer-motion
import {
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/user/add-article", label: "Add Articles" },
    { path: "/all-articles", label: "All Articles" },
    { path: "/user/subscription", label: "Subscription" },
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/user/my-articles", label: "My Articles" },
    { path: "/user/premium-articles", label: "Premium Articles" },
    { path: "/profile", label: "My Profile" },
  ];

  const { user, userSignOut } = useAuth();

  // Animation variant for the toggle button
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  // SVG Icons
  const SunIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );

  const MoonIcon = () => (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  );

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          NewsWave
        </Link>
        <ul className="flex items-center gap-6 text-gray-700 font-medium">
          {navLinks.map(({ path, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "hover:text-blue-500"
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <motion.button
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              focus:outline-none focus:ring-2 focus:ring-offset-2
              ${
                isDark
                  ? "bg-gray-800 text-yellow-400 focus:ring-yellow-500"
                  : "bg-gray-100 text-gray-700 focus:ring-blue-500"
              }
              transition-all
            `}
            onClick={toggleTheme}
            variants={item}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </motion.button>

          {user ? (
            <div>
              <Dropdown
                label=""
                dismissOnClick={false}
                renderTrigger={() => (
                  <img
                    src={user.image}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full cursor-pointer object-cover border-[3px] border-blue-600"
                  />
                )}
              >
                <DropdownHeader>
                  <span className="block text-sm">{user.name}</span>
                  <span className="block truncate text-sm font-medium">
                    {user.email}
                  </span>
                </DropdownHeader>
                <DropdownDivider />
                <DropdownItem onClick={userSignOut}>Sign out</DropdownItem>
              </Dropdown>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1 border border-blue-500 rounded text-blue-500 hover:bg-blue-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
