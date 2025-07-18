import { useState } from "react";
import Checkout from "../components/Checkout";

const plans = [
  { value: "plan1", duration: 1, unit: "minute", price: 1, label: "1 Minute" },
  { value: "plan2", duration: 5, unit: "day", price: 5, label: "5 Days" },
  { value: "plan3", duration: 10, unit: "day", price: 10, label: "10 Days" },
];

const Subscription = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [plan, setPlan] = useState(null);
  const [price, setPrice] = useState(0);

  return (
    <div className="min-h-screen relative bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg overflow-hidden shadow-lg mb-10">
        <div className="px-6 py-20 text-center text-white">
          <h2 className="text-4xl font-extrabold mb-4">Go Premium</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Subscribe now and unlock exclusive premium content. Choose your plan
            and get started instantly!
          </p>
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Choose Your Subscription Plan
        </h3>

        <div className="mb-6">
          <select
            id="plan"
            onChange={(e) => {
              const selectedPlan = plans.find(
                (p) => p.value === e.target.value
              );
              if (selectedPlan) {
                setPlan(selectedPlan);
                setPrice(selectedPlan.price);
              }
            }}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">choose a plan</option>

            {plans.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} — ${option.price}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            if (plan) {
              setIsOpen(true);
            }
          }}
          className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition"
        >
          Subscribe Now
        </button>

        <p className="text-xs text-center text-gray-400 mt-4">
          After your subscription ends, you'll be downgraded to a normal user.
        </p>
      </div>

      {isOpen && (
        <Checkout
          setIsOpen={setIsOpen}
          amount={price}
          duration={plan.duration}
          unit={plan.unit}
        />
      )}
    </div>
  );
};

export default Subscription;
