import React from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useBannersQuery from '../../hooks/useBannersQuery';

// Custom arrow components for better styling integration with Tailwind
const PrevArrow = ({ className, onClick }) => (
  <button
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 text-gray-800 focus:outline-none transition-all shadow-md"
    onClick={onClick}
    aria-label="Previous slide"
  >
    <ChevronLeft className="w-5 h-5" />
  </button>
);

const NextArrow = ({ className, onClick }) => (
  <button
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 text-gray-800 focus:outline-none transition-all shadow-md"
    onClick={onClick}
    aria-label="Next slide"
  >
    <ChevronRight className="w-5 h-5" />
  </button>
);

// Fallback banner data when API fails or while loading
const fallbackBanners = [
  {
    id: 1,
    title: "Продавайте быстрее с премиум объявлениями",
    description: "Получите в 3 раза больше просмотров и найдите покупателя за 24 часа",
    buttonText: "Узнать больше",
    buttonLink: "/business",
    backgroundColor: "bg-gradient-to-r from-blue-600 to-blue-400",
    textColor: "text-white",
    image: "https://picsum.photos/500/300?random=1"
  }
];

const BannersCarousel = () => {
  // Use the custom hook to fetch banner data
  const { 
    banners, 
    isLoading, 
    error, 
    isEmpty 
  } = useBannersQuery({
    position: 'main_advertising_slider',
    platform: 'web'
  });

  // Determine which banners to display
  const displayBanners = isEmpty ? fallbackBanners : banners;

  // Settings for react-slick
  const settings = {
    dots: true,
    infinite: displayBanners.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: displayBanners.length > 1,
    centerPadding: '20%',
    autoplay: displayBanners.length > 1,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          centerPadding: '5%'
        }
      },
      {
        breakpoint: 480,
        settings: {
          centerMode: false,
          centerPadding: '0'
        }
      }
    ],
    appendDots: dots => (
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <ul className="flex space-x-2"> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        className="w-2.5 h-2.5 bg-white bg-opacity-70 hover:bg-opacity-100 rounded-full transition-all"
        aria-label={`Go to slide ${i + 1}`}
      />
    )
  };

  // Show loading state
  if (isLoading && isEmpty) {
    return (
      <div className="h-64 md:h-80 lg:h-96 rounded-xl bg-gray-100 animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading banners...</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
  <Slider {...settings} className="banner-carousel">
    {displayBanners.map((banner) => (
      <div key={banner.id} className="outline-none px-1">
        <div className="h-48 sm:h-56 md:h-80 lg:h-96 rounded-xl overflow-hidden">
          <div className={`h-full ${banner.backgroundColor} relative`}>
            <div className="absolute inset-0 flex flex-col md:flex-row">
              {/* Content */}
              <div className="w-full md:flex-1 flex flex-col justify-center p-4 sm:p-6 md:p-10 z-10">
                <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 ${banner.textColor}`}>
                  {banner.title}
                </h2>
                <p className={`text-xs sm:text-sm md:text-base mb-3 ${banner.textColor} opacity-90 line-clamp-2 sm:line-clamp-3`}>
                  {banner.description}
                </p>
                <div>
                  <a
                    href={banner.buttonLink}
                    className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm md:text-base"
                  >
                    {banner.buttonText}
                  </a>
                </div>
              </div>
              
              {/* Background Image for Mobile */}
              <div className="absolute inset-0 opacity-20 md:hidden">
                <img
                  src={banner.image}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
              </div>
              
              {/* Regular Image for Tablet/Desktop */}
              <div className="hidden md:block flex-1">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="h-full w-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </Slider>

  {/* Display error message if there's an error */}
  {error && (
    <div className="text-red-500 text-sm mt-2">
      Error loading banners: {error}
    </div>
  )}

  {/* Custom CSS to override some slick-carousel defaults */}
  <style jsx>{`
    /* Mobile-friendly dots positioning */
    :global(.banner-carousel .slick-dots) {
      bottom: 8px;
    }
    
    @media (min-width: 640px) {
      :global(.banner-carousel .slick-dots) {
        bottom: 12px;
      }
    }
    
    /* Override slick-dots styles for better visibility */
    :global(.banner-carousel .slick-dots li button:before) {
      font-size: 0;
      display: none; /* Remove the default dot style */
    }
    
    :global(.banner-carousel .slick-dots li.slick-active div) {
      background-color: white;
      transform: scale(1.3);
    }
    
    /* Add custom slide transition effect */
    :global(.banner-carousel .slick-slide) {
      transition: transform 0.5s ease;
      opacity: 0.9;
    }
    
    :global(.banner-carousel .slick-center) {
      transform: scale(1.01);
      opacity: 1;
    }

    /* Reduced fade effect for mobile */
    @media (max-width: 640px) {
      :global(.banner-carousel .slick-slide) {
        opacity: 1;
      }
      
      :global(.banner-carousel .slick-center) {
        transform: none;
      }
    }
  `}</style>
</div>
  );
};

export default BannersCarousel;