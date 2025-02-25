import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import { useCategoriesTree } from '../../../hooks/category';

const CategorySlider = () => {
  const categories = useCategoriesTree();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const sliderRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? scrollPosition - scrollAmount 
        : scrollPosition + scrollAmount;
      
      sliderRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="relative w-full">
      {/* Categories Button with Mega Menu */}
      <div className="relative">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          onMouseEnter={() => setIsMenuOpen(true)}
        >
          <Grid className="w-5 h-5" />
          <span className="hidden sm:inline">Категории</span>
        </button>

        {/* Mega Menu */}
        {isMenuOpen && (
          <div 
            className="absolute top-full left-0 mt-2 w-full max-w-5xl bg-white rounded-lg shadow-xl z-50 border border-gray-200"
            onMouseLeave={() => setIsMenuOpen(false)}
          >
            <div className="flex">
              {/* Main Categories */}
              <div className="w-64 border-r border-gray-200">
                <div className="py-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                        hoveredCategory?.id === category.id ? 'bg-gray-50 text-primary' : 'text-gray-700'
                      }`}
                      onMouseEnter={() => setHoveredCategory(category)}
                    >
                      <div className="flex items-center gap-3">
                        {category.image && (
                          <img 
                            src={category.image} 
                            alt={category.name} 
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        )}
                        <span className="truncate">{category.name}</span>
                      </div>
                      {category.children?.length > 0 && (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {hoveredCategory && hoveredCategory.children?.length > 0 && (
                <div className="flex-1 p-4">
                  <h3 className="font-medium text-lg mb-4">{hoveredCategory.name}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {hoveredCategory.children.map((subcat) => (
                      <a
                        key={subcat.id}
                        href={`/category/${subcat.id}`}
                        className="text-gray-600 hover:text-primary transition-colors"
                      >
                        {subcat.name}
                        {subcat.children?.length > 0 && (
                          <span className="text-gray-400 text-sm ml-2">
                            ({subcat.children.length})
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Slider */}
      <div className="relative mt-4">
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div 
          ref={sliderRef}
          className="overflow-x-auto scrollbar-hide whitespace-nowrap px-8"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="inline-flex gap-2">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                {category.image && (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span>{category.name}</span>
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-primary transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CategorySlider;