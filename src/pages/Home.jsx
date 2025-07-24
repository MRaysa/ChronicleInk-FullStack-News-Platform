import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AllPublishers from "../components/Home/AllPublisher";
import PricingPlans from "../components/Home/Plans";
import Statistics from "../components/Home/Statistics";
import TrendingSlider from "../components/Home/TrendingSlider";

export default function Home() {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const subscriptionTimer = setTimeout(() => {
      setShowSubscriptionModal(true);
    }, 10000);

    return () => clearTimeout(subscriptionTimer);
  }, []);

  const handleSubscribeClick = () => {
    setShowSubscriptionModal(false);
    navigate("/subscription");
  };

  const handleCloseModal = () => {
    setShowSubscriptionModal(false);
  };

  return (
    <div>
      <TrendingSlider />
      <AllPublishers />
      <Statistics />
      <PricingPlans />

      {/* 5. Subscription Modal */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="relative bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4 text-center">
            {/* Close button (optional) */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
              aria-label="Close modal"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold mb-3 text-gray-800">
              Upgrade Your Experience
            </h2>
            <p className="text-gray-600 mb-6">
              Unlock exclusive content and features with a subscription plan!
            </p>
            <button
              onClick={handleSubscribeClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded-md transition duration-300"
            >
              See Subscription Options
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
