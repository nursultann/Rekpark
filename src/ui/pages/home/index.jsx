import React from 'react';
import ProductItem, { ProductItemSkeleton } from "../../components/product/product_item";
import { useProductsPaginatedQuery } from "../../../hooks/product";
import NewsGrid from "../../components/news";
import BannersCarousel from '../../components/banner_carousel';
import { Link } from 'react-router-dom';

import { ChevronRight } from 'lucide-react';

const categories = [
  {
    label: "Авто",
    image: "http://127.0.0.1:8000/storage/temp/car1.png",
  },
  {
    label: "Услуги",
    image: "http://127.0.0.1:8000/storage/temp/image_4.png",
  },
  {
    label: "Электроника",
    image: "http://127.0.0.1:8000/storage/temp/iphone1.png",
  },
  {
    label: "Животные",
    image: "http://127.0.0.1:8000/storage/temp/cat1.png",
  },
  {
    label: "Для дома и дачи",
    image: "http://127.0.0.1:8000/storage/temp/image_2.png",
  },
  {
    label: "Запчасти",
    image: "http://127.0.0.1:8000/storage/temp/wheel1.png",
  },
  {
    label: "Недвижимость",
    image: "http://127.0.0.1:8000/storage/temp/home1.png",
  },
  {
    label: "Работа",
    image: "http://127.0.0.1:8000/storage/temp/work2.png",
  },
  {
    label: "Одежда,обувь,аксессуары",
    image: "http://127.0.0.1:8000/storage/temp/hoodie2.png",
  },
  {
    label: "Красота и здоровье",
    image: "http://127.0.0.1:8000/storage/temp/cosmetic1.png",
  },
];

function CategoryTiles() {
  return (
    <div className="w-full flex flex-wrap">
      {categories.map((cat) => (
        <div
          key={cat.label}
          className="
            flex-none
            bg-gray-100
            rounded-xl
            shadow-sm
            m-2
            relative
            overflow-hidden
            h-[110px]
            w-[180px]
          "
        >
          <div className="
            absolute 
            top-2 
            left-2 
            z-10
            font-medium 
            text-black
            rounded-lg
          ">
            {cat.label}
          </div>
          <img
              src={cat.image}
              alt={cat.label}
              className="block w-auto mx-auto h-full object-cover mix-blend-multiply absolute bottom-0 right-0"
          />
        </div>
      ))}
    </div>
  );
}


const HomePage = () => {
  const { products, reachEnd, isLoading, fetchProducts } = useProductsPaginatedQuery();
  const isRefreshing = isLoading && (!products || products.length === 0);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
      <div className="mt-8">
          <BannersCarousel />
        </div>
        
        {/* Categories Section */}
        <div className="mb-8 mt-8">
          <CategoryTiles />
        </div>

        {/* News Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            Новости и статьи
            <Link to="/articles" className="text-blue-500 hover:underline text-sm flex items-center">
              Все новости <ChevronRight className="w-5 h-5" />
            </Link>
          </h2>
          <NewsGrid />
        </div>

        {/* Latest Products */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Новые объявления</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isRefreshing ? 
              Array(4).fill(null).map((_, index) => (
                <ProductItemSkeleton key={index} />
              )) :
              products?.map((item, index) => (
                <ProductItem
                  key={index}
                  product={item}
                  onClick={() => {}}
                />
              ))
            }
          </div>

          {!reachEnd && (
            <div className="text-center mt-8">
              <button
                onClick={fetchProducts}
                disabled={isLoading}
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Загрузка..." : "Показать больше"}
                {isLoading && (
                  <span className="ml-2">
                    <span className="animate-spin inline-block h-4 w-4 border-2 border-white rounded-full border-t-transparent"/>
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default HomePage;