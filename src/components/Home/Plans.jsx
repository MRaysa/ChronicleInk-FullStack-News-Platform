import React from "react";
import { useNavigate } from "react-router-dom";

const PricingPlans = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-white min-h-screen flex items-center justify-center px-4 py-12">
      <div className="grid md:grid-cols-3 gap-6 max-w-7xl w-full">
        <div className="border border-gray-600 rounded-lg p-6 bg-[#121212] relative">
          <div className="absolute top-4 left-4 bg-pink-500 text-black text-xs font-bold px-2 py-1 rounded">
            Free For 1 Month
          </div>
          <h2 className="text-xl font-bold mb-2 mt-10">Premium Individual</h2>
          <p className="text-sm mb-1">FREE</p>
          <p className="text-xs mb-4">FOR 1 MONTH</p>
          <ul className="text-sm space-y-2 mb-6">
            <li>• 1 Premium account</li>
            <li>• Cancel anytime</li>
            <li>
              • 15 hours/month of listening time from our audiobooks subscriber
              catalog
            </li>
          </ul>
          <button onClick={() => navigate('/user/subscription')} className="w-full bg-pink-200 text-black font-semibold py-2 rounded-full hover:bg-pink-300 transition">
            Try free for 1 month
          </button>
          <p className="text-xs mt-4 text-gray-400">
            Free for 1 month, then $10.99 per month after. Offer only available
            if you haven’t tried Premium before.{" "}
            <a href="#" className="underline">
              Terms apply
            </a>
            .
          </p>
        </div>

        <div className="border border-gray-600 rounded-lg p-6 bg-[#1A1A1A]">
          <h2 className="text-xl font-bold mb-2">Premium Duo</h2>
          <p className="text-sm mb-1">$14.99</p>
          <p className="text-xs mb-4">PER MONTH</p>
          <ul className="text-sm space-y-2 mb-6">
            <li>• 2 Premium accounts</li>
            <li>• Cancel anytime</li>
            <li>
              • 15 hours/month of listening time from our audiobooks subscriber
              catalog (plan manager only)
            </li>
          </ul>
          <button onClick={() => navigate('/user/subscription')} className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-full hover:bg-yellow-300 transition">
            Get Premium Duo
          </button>
          <p className="text-xs mt-4 text-gray-400">
            For couples who reside at the same address.{" "}
            <a href="#" className="underline">
              Terms apply
            </a>
            .
          </p>
        </div>

        <div className="border border-gray-600 rounded-lg p-6 bg-[#1A1A1A]">
          <h2 className="text-xl font-bold mb-2">Premium Family</h2>
          <p className="text-sm mb-1">$16.99</p>
          <p className="text-xs mb-4">PER MONTH</p>
          <ul className="text-sm space-y-2 mb-6">
            <li>• Up to 6 Premium or Kids accounts</li>
            <li>• Block explicit music</li>
            <li>• Access to Spotify Kids</li>
            <li>• Cancel anytime</li>
            <li>
              • 15 hours/month of listening time from our audiobooks subscriber
              catalog (plan manager only)
            </li>
          </ul>
          <button onClick={() => navigate('/user/subscription')} className="w-full bg-blue-300 text-black font-semibold py-2 rounded-full hover:bg-blue-200 transition">
            Get Premium Family
          </button>
          <p className="text-xs mt-4 text-gray-400">
            For up to 6 family members residing at the same address.{" "}
            <a href="#" className="underline">
              Terms apply
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
