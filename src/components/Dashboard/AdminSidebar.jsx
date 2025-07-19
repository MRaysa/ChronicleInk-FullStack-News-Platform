import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Chart } from "react-google-charts";
import axiosInstance from "../../utils/axiosInstance";
import Spinner from "../Spinner";

const AdminSidebar = () => {
  return (
    <div className="p-6 h-full bg-gradient-to-b from-indigo-900 to-indigo-800 text-white flex flex-col">
      <div className="mb-10">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Admin Panel
        </h2>
      </div>

      <nav className="flex-1 space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all ${
              isActive ? "bg-indigo-600 shadow-md" : "hover:bg-indigo-700/50"
            }`
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/manage-articles"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all ${
              isActive ? "bg-indigo-600 shadow-md" : "hover:bg-indigo-700/50"
            }`
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          Manage Articles
        </NavLink>
        <NavLink
          to="/admin/manage-users"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all ${
              isActive ? "bg-indigo-600 shadow-md" : "hover:bg-indigo-700/50"
            }`
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          Manage Users
        </NavLink>
        <NavLink
          to="/admin/publisher"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg transition-all ${
              isActive ? "bg-indigo-600 shadow-md" : "hover:bg-indigo-700/50"
            }`
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          Add Publisher
        </NavLink>
      </nav>

      <div className="mt-auto pt-4 border-t border-indigo-700">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-700/50 cursor-pointer transition-all">
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
            AU
          </div>
          <div className="flex-1">
            <p className="font-medium">Admin User</p>
            <p className="text-xs text-indigo-200">Super Admin</p>
          </div>
          <button className="p-1 rounded-full hover:bg-indigo-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DashboardOverview() {
  const { data: pieData, isLoading } = useQuery({
    queryKey: ["pieData"],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        "/calculate/article/distribution"
      );
      return data;
    },
  });

  if (isLoading) return <Spinner />;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 hidden md:block">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard Overview
            </h1>
            <div className="flex items-center space-x-4">
              <button className="md:hidden p-2 text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Articles",
                value: "1,245",
                change: "+12%",
                icon: "📰",
                color: "bg-blue-100 text-blue-600",
              },
              {
                title: "Active Users",
                value: "563",
                change: "+5%",
                icon: "👥",
                color: "bg-green-100 text-green-600",
              },
              {
                title: "Publishers",
                value: "42",
                change: "+3",
                icon: "🏢",
                color: "bg-purple-100 text-purple-600",
              },
              {
                title: "Engagement",
                value: "4.7",
                change: "+0.2",
                icon: "💬",
                color: "bg-amber-100 text-amber-600",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <span
                    className={`h-10 w-10 rounded-full ${stat.color} flex items-center justify-center text-xl`}
                  >
                    {stat.icon}
                  </span>
                </div>
                <p
                  className={`text-xs mt-3 ${stat.color
                    .replace("bg-", "text-")
                    .replace("100", "600")}`}
                >
                  <span className="font-medium">{stat.change}</span> from last
                  month
                </p>
              </div>
            ))}
          </div>

          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Article Distribution
                </h2>
                <p className="text-sm text-gray-500">By publisher sources</p>
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                View Details
              </button>
            </div>
            <div className="h-[400px]">
              <Chart
                chartType="PieChart"
                width="100%"
                height="100%"
                data={pieData}
                options={{
                  is3D: true,
                  pieHole: 0.4,
                  colors: [
                    "#4F46E5",
                    "#10B981",
                    "#F59E0B",
                    "#EF4444",
                    "#8B5CF6",
                  ],
                  chartArea: { width: "90%", height: "90%" },
                  legend: {
                    position: "right",
                    textStyle: { color: "#6B7280", fontSize: 12 },
                  },
                  pieSliceText: "value",
                  tooltip: { showColorCode: true },
                  backgroundColor: "transparent",
                }}
              />
            </div>
          </div>

          {/* Bar and Area Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Monthly Visitors
                  </h2>
                  <p className="text-sm text-gray-500">Last 4 months trend</p>
                </div>
                <select className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                  <option>Last 4 Months</option>
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
              </div>
              <div className="h-[300px]">
                <Chart
                  chartType="BarChart"
                  width="100%"
                  height="100%"
                  data={[
                    ["Month", "Visitors"],
                    ["Jan", 1000],
                    ["Feb", 1170],
                    ["Mar", 660],
                    ["Apr", 1030],
                  ]}
                  options={{
                    title: "",
                    chartArea: { width: "70%", height: "80%" },
                    colors: ["#4F46E5"],
                    hAxis: {
                      title: "Visitors",
                      minValue: 0,
                      titleTextStyle: { color: "#6B7280", fontSize: 12 },
                      textStyle: { color: "#6B7280", fontSize: 11 },
                    },
                    vAxis: {
                      title: "Month",
                      titleTextStyle: { color: "#6B7280", fontSize: 12 },
                      textStyle: { color: "#6B7280", fontSize: 11 },
                    },
                    legend: { position: "none" },
                    backgroundColor: "transparent",
                  }}
                />
              </div>
            </div>

            {/* Area Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Performance
                  </h2>
                  <p className="text-sm text-gray-500">Sales vs Expenses</p>
                </div>
                <select className="text-sm border border-gray-200 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                  <option>2019-2022</option>
                  <option>2020-2023</option>
                </select>
              </div>
              <div className="h-[300px]">
                <Chart
                  chartType="AreaChart"
                  width="100%"
                  height="100%"
                  data={[
                    ["Year", "Sales", "Expenses"],
                    ["2019", 1000, 400],
                    ["2020", 1170, 460],
                    ["2021", 660, 1120],
                    ["2022", 1030, 540],
                  ]}
                  options={{
                    title: "",
                    colors: ["#10B981", "#EF4444"],
                    hAxis: {
                      title: "Year",
                      titleTextStyle: { color: "#6B7280", fontSize: 12 },
                      textStyle: { color: "#6B7280", fontSize: 11 },
                    },
                    vAxis: {
                      minValue: 0,
                      titleTextStyle: { color: "#6B7280", fontSize: 12 },
                      textStyle: { color: "#6B7280", fontSize: 11 },
                    },
                    legend: {
                      position: "top",
                      alignment: "center",
                      textStyle: { color: "#6B7280", fontSize: 12 },
                    },
                    backgroundColor: "transparent",
                    areaOpacity: 0.1,
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
