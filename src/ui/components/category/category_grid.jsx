import React from 'react';
import { useCategoriesTree } from '../../../hooks/category';

const CategoryGrid = () => {
  const categories = useCategoriesTree();

  const CategoryCard = ({ category, className = "" }) => (
    <a 
      href={`/category/${category.id}`}
      className={`block relative bg-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${className}`}
    >
      <div className="w-full h-full">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <h3 className="text-xl text-gray-900 font-normal">
            {category.name}
          </h3>
        </div>
      </div>
    </a>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* First row */}
      <CategoryCard 
        category={{
          id: 1,
          name: "Авто",
          image: "https://example.com/auto.jpg" // Replace with actual image
        }}
        className="md:col-span-1"
      />
      <CategoryCard 
        category={{
          id: 2,
          name: "Услуги",
          image: "https://example.com/services.jpg" // Replace with actual image
        }}
        className="md:col-span-1"
      />
      <CategoryCard 
        category={{
          id: 3,
          name: "Электроника",
          image: "https://example.com/electronics.jpg" // Replace with actual image
        }}
        className="md:col-span-1"
      />
      <CategoryCard 
        category={{
          id: 4,
          name: "Животные",
          image: "https://example.com/pets.jpg" // Replace with actual image
        }}
        className="md:col-span-1"
      />
      <CategoryCard 
        category={{
          id: 5,
          name: "Для дома и дачи",
          image: "https://example.com/home.jpg" // Replace with actual image
        }}
        className="md:col-span-1"
      />

      {/* Second row */}
      <CategoryCard 
        category={{
          id: 6,
          name: "Запчасти",
          image: "https://example.com/parts.jpg" // Replace with actual image
        }}
        className="md:col-span-1"
      />
      <CategoryCard 
        category={{
          id: 7,
          name: "Недвижимость",
          image: "https://example.com/realestate.jpg" // Replace with actual image
        }}
        className="md:col-span-1"
      />
      <CategoryCard 
        category={{
          id: 8,
          name: "Работа",
          image: "https://example.com/jobs.jpg" // Replace with actual image
        }}
        className="md:col-span-1"
      />
      <CategoryCard 
        category={{
          id: 9,
          name: "Одежда, обувь, аксессуары",
          image: "https://example.com/clothing.jpg" // Replace with actual image
        }}
        className="md:col-span-1"
      />
      <CategoryCard 
        category={{
          id: 10,
          name: "Красота и здоровье",
          image: "https://example.com/beauty.jpg" // Replace with actual image
        }}
        className="md:col-span-1"
      />
    </div>
  );
};

export default CategoryGrid;