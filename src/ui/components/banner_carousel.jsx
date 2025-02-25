import React from 'react';
import Slider from 'react-slick';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

const BannersCarousel = () => {
  // Sample banner data - in a real app, this would come from an API or CMS
  const banners = [
    {
      id: 1,
      title: "Продавайте быстрее с премиум объявлениями",
      description: "Получите в 3 раза больше просмотров и найдите покупателя за 24 часа",
      buttonText: "Узнать больше",
      buttonLink: "/business",
      backgroundColor: "bg-gradient-to-r from-blue-600 to-blue-400",
      textColor: "text-white",
      image: "https://picsum.photos/500/300?random=1"
    },
    {
      id: 2,
      title: "Скачайте мобильное приложение",
      description: "Доступ к объявлениям в любое время и в любом месте",
      buttonText: "Скачать",
      buttonLink: "#",
      backgroundColor: "bg-gradient-to-r from-purple-600 to-indigo-600",
      textColor: "text-white",
      image: "https://picsum.photos/500/300?random=2"
    },
    {
      id: 3,
      title: "Весенняя распродажа!",
      description: "Товары со скидками до 70% только в этом месяце",
      buttonText: "Смотреть предложения",
      buttonLink: "/filter?sale=true",
      backgroundColor: "bg-gradient-to-r from-red-500 to-orange-500",
      textColor: "text-white",
      image: "https://picsum.photos/500/300?random=3"
    },
    {
      id: 4,
      title: "Начните бизнес с RekPark",
      description: "Специальные условия для корпоративных клиентов",
      buttonText: "Для бизнеса",
      buttonLink: "/business",
      backgroundColor: "bg-gradient-to-r from-green-600 to-teal-500",
      textColor: "text-white",
      image: "https://picsum.photos/500/300?random=4"
    },
    {
      id: 5,
      title: "Рассрочка и кредит",
      description: "Покупайте сейчас, платите потом с нашими партнерами",
      buttonText: "Подробнее",
      buttonLink: "#",
      backgroundColor: "bg-gradient-to-r from-yellow-500 to-amber-500",
      textColor: "text-white",
      image: "https://picsum.photos/500/300?random=5"
    }
  ];

  // Settings for react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: '20%',
    autoplay: true,
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

  return (
    <div className="relative overflow-hidden fadeout-overflows">
      <Slider {...settings} className="banner-carousel">
        {banners.map((banner) => (
          <div key={banner.id} className="outline-none px-1">
            <div className="h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden ">
              <div className={`h-full ${banner.backgroundColor} relative`}>
                <div className="absolute inset-0 flex">
                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-center p-6 md:p-10 z-10">
                    <h2 className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-2 ${banner.textColor}`}>
                      {banner.title}
                    </h2>
                    <p className={`text-sm md:text-base mb-4 ${banner.textColor} opacity-90`}>
                      {banner.description}
                    </p>
                    <div>
                      <a
                        href={banner.buttonLink}
                        className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-5 py-2.5 rounded-lg font-medium transition-colors text-sm md:text-base"
                      >
                        {banner.buttonText}
                      </a>
                    </div>
                  </div>
                  
                  {/* Image */}
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

      {/* Custom CSS to override some slick-carousel defaults */}
      <style jsx>{`
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
          opacity: 0.7;
        }
        
        :global(.banner-carousel .slick-center) {
          transform: scale(1.02);
          opacity: 1;
        }

        /* Fade out overflowing content */
        .fadeout-overflows::before,
        .fadeout-overflows::after {
          content: "";
          position: absolute;
          z-index: 10;
          pointer-events: none;
        }

        .fadeout-overflows::before {
          top: 0;
          left: 0;
          bottom: 0;
          width: 5%;
          background: linear-gradient(to right, white, transparent);
        }

        .fadeout-overflows::after {
          bottom: 0;
          top: 0;
          right: 0;
          width: 5%;
          background: linear-gradient(to left, white, transparent);
        }
      `}</style>
    </div>
  );
};

export default BannersCarousel;