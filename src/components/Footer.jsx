import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaNewspaper,
  FaPenFancy,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { useTheme } from "../context/ThemeContext";

const Footer = () => {
  const { theme } = useTheme();

  // Theme-based styles
  const bgColor = theme === "dark" ? "bg-gray-900" : "bg-blue-900";
  const textColor = theme === "dark" ? "text-gray-300" : "text-blue-100";
  const hoverText =
    theme === "dark" ? "hover:text-blue-400" : "hover:text-white";
  const borderColor = theme === "dark" ? "border-gray-700" : "border-blue-700";
  const accentColor = theme === "dark" ? "text-blue-400" : "text-blue-300";

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`${bgColor} ${textColor} pt-16 pb-8 transition-colors duration-500`}
    >
      <div className="container mx-auto px-4">
        {/* Newspaper Fold Effect */}
        <motion.div
          className="relative mb-12"
          whileHover={{ scaleY: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-2 ${
              theme === "dark" ? "bg-blue-800" : "bg-blue-700"
            } opacity-60`}
          ></div>
          <div
            className={`absolute top-2 left-0 right-0 h-1 ${
              theme === "dark" ? "bg-blue-700" : "bg-blue-600"
            } opacity-40`}
          ></div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <motion.div className="space-y-4" whileHover={{ x: 5 }}>
            <Link to="/" className="flex items-center group">
              <motion.div
                whileHover={{ rotate: -15 }}
                className="h-10 w-10 bg-white rounded-full flex items-center justify-center mr-3"
              >
                <FaNewspaper className="text-blue-800 text-xl" />
              </motion.div>
              <motion.span
                className="text-2xl font-serif font-bold"
                whileHover={{ scale: 1.05 }}
              >
                ChronicleInk
              </motion.span>
            </Link>
            <p className="italic">"Reporting tomorrow's news, today."</p>
            <div className="flex space-x-4">
              {[FaTwitter, FaLinkedin, FaGithub].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`${textColor} hover:text-white transition`}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <h3
              className={`text-lg font-serif font-bold mb-4 pb-2 ${borderColor} border-b`}
            >
              Sections
            </h3>
            <ul className="space-y-3">
              {["Politics", "Technology", "Business", "Science", "Culture"].map(
                (item, i) => (
                  <motion.li key={i} whileHover={{ x: 5 }}>
                    <Link
                      to={`/category/${item.toLowerCase()}`}
                      className={`${hoverText} transition flex items-center`}
                    >
                      <FaPenFancy className={`mr-2 ${accentColor} text-sm`} />
                      {item}
                    </Link>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div whileHover={{ scale: 1.02 }}>
            <h3
              className={`text-lg font-serif font-bold mb-4 pb-2 ${borderColor} border-b`}
            >
              Resources
            </h3>
            <ul className="space-y-3">
              {["Archives", "Newsletters", "Press", "Careers", "Advertise"].map(
                (item, i) => (
                  <motion.li key={i} whileHover={{ x: 5 }}>
                    <Link
                      to={`/${item.toLowerCase()}`}
                      className={`${hoverText} transition flex items-center`}
                    >
                      <FaPenFancy className={`mr-2 ${accentColor} text-sm`} />
                      {item}
                    </Link>
                  </motion.li>
                )
              )}
            </ul>
          </motion.div>

          {/* Contact */}
          <div>
            <h3
              className={`text-lg font-serif font-bold mb-4 pb-2 ${borderColor} border-b`}
            >
              Contact
            </h3>
            <ul className="space-y-3">
              <motion.li className="flex items-start" whileHover={{ x: 5 }}>
                <MdLocationOn
                  className={`${accentColor} mt-1 mr-2`}
                  size={18}
                />
                <span>123 Press Street, News City</span>
              </motion.li>
              <motion.li className="flex items-center" whileHover={{ x: 5 }}>
                <MdEmail className={`${accentColor} mr-2`} size={18} />
                <a
                  href="mailto:editor@chronicleink.com"
                  className={`${hoverText} transition`}
                >
                  editor@chronicleink.com
                </a>
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <motion.div
          className={`${
            theme === "dark" ? "bg-gray-800" : "bg-blue-800"
          } rounded-lg p-6 mb-12 transition-colors duration-300`}
          whileHover={{ y: -5 }}
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-serif font-bold mb-2">Stay Updated</h3>
            <p>Subscribe to our daily briefing</p>
            <motion.div
              className="flex flex-col sm:flex-row gap-2 mt-4"
              whileHover={{ scale: 1.01 }}
            >
              <input
                type="email"
                placeholder="Your email address"
                className={`flex-grow px-4 py-2 rounded ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded transition`}
              >
                Subscribe
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Copyright */}
        <div
          className={`border-t ${borderColor} pt-6 flex flex-col md:flex-row justify-between items-center`}
        >
          <p className="text-sm mb-3 md:mb-0">
            &copy; {new Date().getFullYear()} ChronicleInk. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm">
            {["Privacy", "Terms", "Ethics"].map((item, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1 }}>
                <Link
                  to={`/${item.toLowerCase()}`}
                  className={`${hoverText} transition`}
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
