import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

const AllPublishers = () => {
  const { data: publishers = [], isLoading } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/publishers");
      if (data) return data;
      return [];
    },
  });

  return (
    <section className="max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">
        📰 All Publishers
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {publishers.map((pub) => (
          <div
            key={pub.id}
            className="flex flex-col items-center bg-white p-4 rounded shadow hover:shadow-lg transition"
          >
            <img
              src={pub.logo}
              alt={pub.name}
              className="h-16 object-contain mb-3"
            />
            <p className="text-center font-medium">{pub.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllPublishers;
