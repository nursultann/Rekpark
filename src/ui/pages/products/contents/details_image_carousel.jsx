import { ArrowLeftOutlined, CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import React from 'react';
import Slider from 'react-slick';
import useOutsideAlerter from '../../../../hooks/useOutsideAlerter';

const DetailsImageCarousel = ({ images, className }) => {
    const slider = React.useRef();
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const settings = {
        dots: false,
        arrows: false,
        infinite: true,
        autoPlay: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: function (index) {
            setCurrentSlide(index);
        },
        className: 'hover:scale-105 transition-all duration-300 cursor-pointer active:scale-100'
    };

    return (
        <div>
            <Slider ref={slider} {...settings}>
                {images.map((image, index) => (
                    <div key={index}>
                        <img
                            src={image}
                            alt={`Product Image ${index + 1}`}
                            className={className}
                            onClick={() => {
                                setIsFullscreen(true);
                            }}
                        />
                    </div>
                ))}
            </Slider>
            <div
                className="flex flex-row justify-center items-center gap-2 mt-[20px]  text-blue-600"
                style={{
                    padding: "0 2px"
                }}
            >
                <LeftOutlined className='cursor-pointer' onClick={() => slider.current.slickPrev()} />
                <div className='text-xl font-medium'>{currentSlide + 1} из {images.length}</div>
                <RightOutlined className='cursor-pointer' onClick={() => slider.current.slickNext()} />
            </div>

            <FullScreenModal
                visible={isFullscreen}
                setVisible={setIsFullscreen}
                images={images}
                currentSlide={currentSlide}
                setCurrentSlide={setCurrentSlide}
            />
        </div>
    );
};

function FullScreenModal({ visible, setVisible, images, currentSlide, setCurrentSlide, className }) {
    const sliderRef = React.useRef();

    useOutsideAlerter(sliderRef, () => {
        setVisible(false);
    })

    return (
        <div className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 flex justify-center items-center ${visible ? 'block' : 'hidden'}`}>
            <div className='flex w-[80%] h-[80%] items-center justify-center'>
                <Slider
                    ref={sliderRef}
                    dots={false}
                    arrows={false}
                    infinite={true}
                    autoPlay={false}
                    speed={500}
                    slidesToShow={1}
                    slidesToScroll={1}
                    afterChange={function (index) {
                        setCurrentSlide(index);
                    }}
                    initialSlide={currentSlide}
                >
                    {images.map((image, index) => (
                        <div key={index} className='flex flex-row justify-content-center items-center' onClick={() => setVisible(false)}>
                            <center>
                                <img
                                    src={image}
                                    alt={`Product Image ${index + 1}`}
                                    className={'h-screen object-cover py-12'}
                                />
                            </center>
                        </div>
                    ))}
                </Slider>



                <div className='absolute top-2  right-5 p-2'>
                    <CloseOutlined
                        className='text-2xl cursor-pointer text-white'
                        onClick={() => setVisible(false)}
                    />
                </div>

                <div className='absolute top-1/2 left-5 p-2'>
                    <ArrowLeftOutlined
                        className='text-2xl cursor-pointer text-white'
                        onClick={() => sliderRef.current.slickPrev()}
                    />
                </div>
                <div className='absolute top-1/2 right-5 p-2'>
                    <ArrowLeftOutlined
                        className='text-2xl cursor-pointer text-white transform rotate-180'
                        onClick={() => sliderRef.current.slickNext()}
                    />
                </div>
            </div>
        </div>

    )
}

export default DetailsImageCarousel;
