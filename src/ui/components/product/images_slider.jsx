import React from 'react';
import Slider from 'react-slick';

const ProductImagesSlider = ({ images, className }) => {
    const slider = React.useRef();
    const [currentSlide, setCurrentSlide] = React.useState(0);

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        autoPlay: false,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: function (index) {
            setCurrentSlide(index);
        }
    };

    return (
        <div
            onMouseEnter={() => {
                setTimeout(() => {
                    slider.current.slickGoTo(currentSlide + 1);
                }, 1000);
                slider.current.slickPlay();
            }}
            onMouseLeave={() => {
                slider.current.slickPause();
            }}
        >
            <Slider ref={slider} {...settings}>
                {images.map((image, index) => (
                    <div key={index}>
                        <img
                            src={image} alt={`Product Image ${index + 1}`}
                            className={className}
                        />
                    </div>
                ))}
            </Slider>
            <div
                className="flex justify-center items-center gap-0 mt-2 relative  "
                style={{
                    top: "-18px",
                    padding: "0 2px"
                }}
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`w-full h-[3px] cursor-pointer ${currentSlide === index ? 'bg-gray-300' : 'bg-blue-500'} transition-all duration-300`}
                        onClick={() => {
                            slider.current.slickGoTo(index);
                        }}
                    ></div>
                ))}

            </div>
        </div>
    );
};

export default ProductImagesSlider;
