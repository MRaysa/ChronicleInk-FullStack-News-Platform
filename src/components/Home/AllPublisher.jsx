import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import { useTheme } from "../../context/ThemeContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AllPublishers = () => {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  const {
    data: publishers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/publishers");
      return data || [];
    },
  });

  useGSAP(() => {
    if (!containerRef.current || !titleRef.current) return;

    // Title animation
    gsap.from(titleRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    // Grid items animation
    gsap.from(".publisher-card", {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: "back.out(1.2)",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    // Hover animations
    const cards = document.querySelectorAll(".publisher-card");

    cards.forEach((card) => {
      // Set initial perspective
      gsap.set(card, { transformPerspective: 1000 });

      // Hover in animation
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -8,
          scale: 1.03,
          duration: 0.3,
          ease: "power2.out",
          boxShadow:
            theme === "dark"
              ? "0 10px 25px -5px rgba(59, 130, 246, 0.3)"
              : "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
          zIndex: 10,
        });
      });

      // Hover out animation
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          zIndex: 1,
        });
      });
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mouseenter", () => {});
        card.removeEventListener("mouseleave", () => {});
      });
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [theme, publishers]);

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-40 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 p-6 rounded-lg inline-block">
          <h3 className="text-xl font-medium mb-2">
            Failed to load publishers
          </h3>
          <p>Please try again later</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-md text-red-700 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-900/40 transition"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
    >
      <h2
        ref={titleRef}
        className="text-3xl md:text-4xl font-bold mb-12 text-center"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Our Trusted Publishers
        </span>
        <div className="w-24 h-1 mx-auto mt-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {publishers.map((pub) => (
          <div
            key={pub._id}
            className="publisher-card group flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 relative overflow-hidden"
          >
            <div className="relative w-full aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-2">
              <img
                src={
                  pub.logo || "https://via.placeholder.com/150?text=Publisher"
                }
                alt={pub.name}
                className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/150?text=Publisher";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="text-center w-full">
              <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                {pub.name}
              </p>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{new Date(pub.createdAt).toLocaleDateString()}</span>
                {pub.author && pub.author.name && (
                  <span className="truncate max-w-[80px]">
                    by {pub.author.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {publishers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
            No publishers available
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Check back later for updates
          </p>
        </div>
      )}
    </section>
  );
};

export default AllPublishers;
