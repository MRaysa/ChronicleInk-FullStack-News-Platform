import { useQuery } from "@tanstack/react-query";
import { Chart } from "react-google-charts";
import axiosInstance from "../../utils/axiosInstance";
import Spinner from "../Spinner";

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


  if(isLoading) return <Spinner/>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>

      {/* Pie Chart */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">
          Article Distribution by Publisher
        </h2>
        <Chart
          chartType="PieChart"
          width="100%"
          height="400px"
          data={pieData}
          options={{ is3D: true }}
        />
      </div>

      {/* Static Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Chart
          chartType="BarChart"
          width="100%"
          height="300px"
          data={[
            ["Month", "Visitors"],
            ["Jan", 1000],
            ["Feb", 1170],
            ["Mar", 660],
            ["Apr", 1030],
          ]}
          options={{
            title: "Monthly Visitors",
            chartArea: { width: "50%" },
            hAxis: { title: "Total Visitors", minValue: 0 },
            vAxis: { title: "Month" },
          }}
        />

        <Chart
          chartType="AreaChart"
          width="100%"
          height="300px"
          data={[
            ["Year", "Sales", "Expenses"],
            ["2019", 1000, 400],
            ["2020", 1170, 460],
            ["2021", 660, 1120],
            ["2022", 1030, 540],
          ]}
          options={{
            title: "Company Performance",
            hAxis: { title: "Year", titleTextStyle: { color: "#333" } },
            vAxis: { minValue: 0 },
          }}
        />
      </div>
    </div>
  );
}
