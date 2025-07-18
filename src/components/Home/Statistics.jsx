import CountUp from "react-countup";

const Statistics = () => {
  const statsData = {
    totalUsers: 1200,
    normalUsers: 950,
    premiumUsers: 250,
  };

  return (
    <section className="max-w-7xl mx-auto py-8 px-4 bg-blue-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">📊 User Statistics</h2>
      <div className="flex justify-around text-center space-x-6">
        <div className="bg-white p-6 rounded shadow w-1/3">
          <p className="text-4xl font-extrabold text-blue-600">
            <CountUp end={statsData.totalUsers} duration={2} />
          </p>
          <p className="mt-2 font-semibold">Total Users</p>
        </div>
        <div className="bg-white p-6 rounded shadow w-1/3">
          <p className="text-4xl font-extrabold text-green-600">
            <CountUp end={statsData.normalUsers} duration={2} />
          </p>
          <p className="mt-2 font-semibold">Normal Users</p>
        </div>
        <div className="bg-white p-6 rounded shadow w-1/3">
          <p className="text-4xl font-extrabold text-purple-600">
            <CountUp end={statsData.premiumUsers} duration={2} />
          </p>
          <p className="mt-2 font-semibold">Premium Users</p>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
