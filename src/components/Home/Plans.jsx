import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  FaCheck,
  FaCrown,
  FaUsers,
  FaUserFriends,
  FaHome,
  FaGem,
  FaArrowRight,
} from "react-icons/fa";
import { FiZap } from "react-icons/fi";

const PricingPlans = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [hoveredPlan, setHoveredPlan] = useState(null);

  // 3D tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  // Theme-based colors with gradients
  const cardBg =
    theme === "dark"
      ? "bg-gradient-to-br from-gray-900 to-gray-800"
      : "bg-gradient-to-br from-white to-gray-50";
  const highlightBg =
    theme === "dark"
      ? "bg-gradient-to-r from-blue-600 to-purple-600"
      : "bg-gradient-to-r from-blue-500 to-purple-500";
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-900";
  const secondaryText = theme === "dark" ? "text-gray-400" : "text-gray-600";

  const plans = [
    {
      id: 1,
      title: "Premium Individual",
      price: "FREE",
      period: "FOR 1 MONTH",
      afterPrice: "then $10.99/month",
      icon: <FaCrown className="text-yellow-400" />,
      badge: "Popular",
      features: [
        "1 Premium account",
        "Cancel anytime",
        "15 hours/month audiobooks",
        "Ad-free experience",
        "Offline listening",
      ],
      glow: "from-yellow-400/20 via-pink-500/10 to-transparent",
      button: {
        text: "Try free for 1 month",
        color: "bg-gradient-to-r from-yellow-400 to-pink-500",
      },
    },
    {
      id: 2,
      title: "Premium Duo",
      price: "$14.99",
      period: "PER MONTH",
      icon: <FaUserFriends className="text-blue-400" />,
      features: [
        "2 Premium accounts",
        "Duo Mix playlist",
        "15 hours/month audiobooks",
        "Ad-free for both",
        "Separate accounts",
      ],
      glow: "from-blue-400/20 via-purple-500/10 to-transparent",
      button: {
        text: "Get Premium Duo",
        color: "bg-gradient-to-r from-blue-400 to-purple-500",
      },
    },
    {
      id: 3,
      title: "Premium Family",
      price: "$16.99",
      period: "PER MONTH",
      icon: <FaHome className="text-green-400" />,
      badge: "Best Value",
      features: [
        "Up to 6 accounts",
        "Parental controls",
        "Spotify Kids included",
        "Family Mix playlist",
        "15 hours/month audiobooks",
      ],
      glow: "from-green-400/20 via-teal-500/10 to-transparent",
      button: {
        text: "Get Family Plan",
        color: "bg-gradient-to-r from-green-400 to-teal-500",
      },
    },
  ];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const cardItem = {
    hidden: { y: 50, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
    hover: {
      y: -10,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  const featureItem = {
    hidden: { x: -20, opacity: 0 },
    show: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1 + 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  };

  return (
    <motion.div
      className={`min-h-screen flex items-center justify-center px-4 py-12 ${
        theme === "dark"
          ? "bg-gray-950"
          : "bg-gradient-to-b from-blue-50 to-white"
      }`}
      initial="hidden"
      animate="show"
      variants={container}
      onPointerMove={(e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - bounds.x - bounds.width / 2) / 10);
        y.set((e.clientY - bounds.y - bounds.height / 2) / 10);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div className="max-w-7xl w-full">
        {/* Animated header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 8,
            }}
            className="inline-block mb-4"
          >
            <FiZap
              className={`text-4xl ${
                theme === "dark" ? "text-yellow-400" : "text-blue-500"
              }`}
            />
          </motion.div>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${textColor}`}>
            Elevate Your Experience
          </h1>
          <p className={`max-w-2xl mx-auto text-lg ${secondaryText}`}>
            Choose the perfect plan with exclusive features tailored for you
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Animated background element */}
          <motion.div
            animate={{
              x: ["0%", "20%", "0%"],
              y: ["0%", "-10%", "0%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -z-10 inset-0 opacity-20"
            style={{
              background:
                theme === "dark"
                  ? "radial-gradient(circle at center, #4f46e5 0%, transparent 50%)"
                  : "radial-gradient(circle at center, #3b82f6 0%, transparent 50%)",
            }}
          />

          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              variants={cardItem}
              whileHover="hover"
              onHoverStart={() => setHoveredPlan(plan.id)}
              onHoverEnd={() => setHoveredPlan(null)}
              className={`relative rounded-2xl p-8 ${cardBg} border ${
                theme === "dark" ? "border-gray-800" : "border-gray-200"
              } shadow-xl overflow-hidden`}
              style={{
                transformStyle: "preserve-3d",
                rotateX: hoveredPlan === plan.id ? rotateX : 0,
                rotateY: hoveredPlan === plan.id ? rotateY : 0,
                zIndex: hoveredPlan === plan.id ? 10 : 1,
              }}
            >
              {/* Glow effect */}
              <AnimatePresence>
                {hoveredPlan === plan.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 bg-gradient-to-br ${plan.glow} pointer-events-none`}
                  />
                )}
              </AnimatePresence>

              {/* Badge */}
              {plan.badge && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`absolute top-4 right-4 ${highlightBg} text-white text-xs font-bold px-3 py-1 rounded-full flex items-center`}
                >
                  <FaGem className="mr-1" size={10} />
                  {plan.badge}
                </motion.div>
              )}

              {/* Plan header */}
              <div className="flex items-center mb-6">
                <motion.div
                  animate={{
                    rotate: hoveredPlan === plan.id ? [0, 15, -15, 0] : 0,
                    scale: hoveredPlan === plan.id ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {plan.icon}
                </motion.div>
                <h2 className={`text-2xl font-bold ml-3 ${textColor}`}>
                  {plan.title}
                </h2>
              </div>

              {/* Price */}
              <motion.div
                className="mb-8"
                animate={{
                  scale: hoveredPlan === plan.id ? 1.05 : 1,
                }}
              >
                <p className={`text-4xl font-bold mb-1 ${textColor}`}>
                  {plan.price}
                </p>
                <p className={`text-sm ${secondaryText}`}>{plan.period}</p>
                {plan.afterPrice && (
                  <p className={`text-xs mt-2 ${secondaryText}`}>
                    Then {plan.afterPrice}
                  </p>
                )}
              </motion.div>

              {/* Features list */}
              <ul className="mb-10 space-y-3">
                {plan.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    custom={i}
                    variants={featureItem}
                    className="flex items-start"
                    whileHover={{ x: 5 }}
                  >
                    <FaCheck
                      className={`mt-1 mr-3 ${
                        theme === "dark" ? "text-blue-400" : "text-blue-600"
                      }`}
                    />
                    <span className={`text-sm ${textColor}`}>{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA button */}
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    theme === "dark"
                      ? "0 10px 25px -5px rgba(99, 102, 241, 0.4)"
                      : "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/user/subscription")}
                className={`w-full ${plan.button.color} text-white font-bold py-4 rounded-xl flex items-center justify-center`}
              >
                {plan.button.text}
                <FaArrowRight className="ml-2" />
              </motion.button>

              {/* Floating particles (visible on hover) */}
              <AnimatePresence>
                {hoveredPlan === plan.id && (
                  <>
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                          x: Math.random() * 100 - 50,
                          y: Math.random() * 100 - 50,
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                        className={`absolute w-2 h-2 rounded-full ${
                          theme === "dark" ? "bg-blue-400" : "bg-blue-500"
                        }`}
                        style={{
                          top: `${Math.random() * 80 + 10}%`,
                          left: `${Math.random() * 80 + 10}%`,
                        }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className={`text-center mt-16 text-sm ${secondaryText}`}
        >
          <p>
            All plans come with a 30-day satisfaction guarantee. Cancel anytime.
          </p>
          <p className="mt-2">
            <a href="#" className="underline hover:text-blue-400">
              Terms and conditions
            </a>{" "}
            apply.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PricingPlans;
