import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import Spinner from "../Spinner";

const TrendingSlider = () => {
  const { data: tendingArticles = [], isLoading } = useQuery({
    queryKey: ["trending articles"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/top-articles");
      if (data) return data;
      return [];
    },
  });
  console.log(tendingArticles);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  if (isLoading) return <Spinner />;

  return (
    <section className="max-w-7xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        🔥 Trending Articles
      </h2>
      <Slider {...settings}>
        {tendingArticles.map((article) => (
          <div key={article.id} className="p-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Publisher: {article.publisher}
                </p>
                <p className="text-sm text-gray-500">Views: {article.views}</p>
                <Link
                  to={`/article/${article._id}`}
                  className="mt-2 inline-block text-blue-500 hover:underline text-sm"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default TrendingSlider;
