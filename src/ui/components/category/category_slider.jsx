import React, { useState } from "react";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useCategoriesTree } from "../../../hooks/category";
import gridIcon from "../../../dist/icons/grid.svg";
import ModalBox from "../modal_box";

function SampleArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block" }}
            onClick={onClick}
        />
    );
}
function CategoryItem({ category, ...props }) {
    const image = category.image != null
        ? category.image
        : 'https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg';
    return (
        <div className="px-2 pt-[3px] flex flex-col h-full align-items-center justify-center" onClick={() => { window.location.href = '/category/' + category.id }}>
            <div className="bg-zinc-100 rounded-xlg border border-neutral-200 justify-center items-center gap-[10px] inline-flex min-w-[100px] px-4 py-1.5 rounded-xl cursor-pointer hover:bg-zinc-200 active:bg-zinc-300">
                <img className="rounded-full" src={image} width="30px" height="30px" />
                <p className="text-sm" style={{ maxLines: 1 }} >
                    {category.name}
                </p>
            </div>
        </div>
    )
}
const CategorySlider = () => {
    const categories = useCategoriesTree();
    const [options, setOptions] = useState([]);
    const [active, setActive] = useState(0);
    const sliderRef = React.useRef();

    const sliderSettings = {
        dots: false,
        arrows: false,
        infinite: true,
        focusOnSelect: true,
        speed: 500,
        slidesToScroll: 1,
        slidesPerRow: 1,
        startSlide: 0,
        nextArrow: <SampleArrow />,
        prevArrow: <SampleArrow />,
        variableWidth: true,
        centerMode: false,
        customPaging: function (i) {
            return (
                <div className={`w-2 h-2 rounded-full inline-block mx-2 ${i === active ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            );
        },
        afterChange: function (index) {
            setActive(index)
        },
        style: {
            height: "50px",
        },

    };


    return (
        <div className="flex flex-col">
            <div className="flex flex-row align-items-center">
                <ModalBox
                    modal={<CategoriesTreeModal categories={categories} />}
                >
                    <div
                        className="bg-blue-500 flex gap-2 lg:px-4 md:px-2.5 sm:px-3 xs:px-3  align-items-center rounded-[10px] cursor-pointer hover:bg-blue-600 active:bg-blue-700 md:mr-2 sm:mr-2"
                        style={{ height: "42px" }}
                    >
                        <img src={gridIcon} alt="" width="20px" height="20px" />
                        <div className="mr-3 d-md-none d-lg-flex d-sm-none d-xs-none">
                            <p className="text-white text-lg">Категории</p>
                        </div>
                    </div>
                </ModalBox>
                <div className="col-12">
                    <div className="row">
                    <div
                        className=" bg-neutral-800 rounded-[9.58px] flex align-items-center justify-center mt-2 ml-3 hover:bg-neutral-700 cursor-pointer active:bg-neutral-900 d-md-none d-lg-flex d-sm-none d-xs-none"
                        style={{ height: "35px", width: "45px" }}
                        onClick={() => sliderRef.current.slickPrev()}
                    >
                        <LeftOutlined className="text-white" />
                    </div>
                    <div className="col-lg-9">
                    <Slider className="" {...sliderSettings} ref={sliderRef}>
                        {categories.map((category) => {
                            return <CategoryItem
                                key={category.id}
                                category={category}
                            />
                        })}
                    </Slider>
                    </div>
                    <div
                        className="bg-neutral-800 rounded-[9.58px] flex align-items-center justify-center mt-2 ml-2 hover:bg-neutral-700 cursor-pointer active:bg-neutral-900 d-md-none d-lg-flex d-sm-none d-xs-none"
                        style={{ height: "35px", width: "45px" }}
                        onClick={() => sliderRef.current.slickNext()}
                    >
                        <RightOutlined className="text-white" />
                    </div>
                    </div>
                </div>


            </div >

            <div className="flex flex-row mt-3 align-items-center justify-center d-md-none d-lg-flex d-sm-none d-xs-none">
                <div className="flex flex-row justify-center items-center gap-2">
                    {Array.from({ length: categories.length }).map((_, index) => {
                        return (
                            <div
                                key={index}
                                className={`w-2 h-2  rounded-full inline-block mx-2 cursor-pointer hover:bg-blue-500  ${index === active ? 'bg-blue-500' : 'bg-gray-300'} `}
                                onClick={() => sliderRef.current.slickGoTo(index)}
                            >
                            </div>
                        )
                    })}
                </div>
            </div>
        </div >
    );

};

function CategoriesTreeModal({ categories }) {
    return (
        <div
            id="mega-menu-full-dropdown"
            className={
                `mt-1 bg-red border-gray-200  border-y bg-white z-50 rounded-xl w-full shadow-lg py-1 text-sm transition-all duration-300 ease-in-out  transform  opacity-100 overflow-scroll`
            }
            style={{ height: "400px" }}
        >
            <div className="flex flex-row  gap-3">
                <div className="flex-none overflow-scroll" style={{ height: "400px" }}>
                    <div className="flex flex-col px-4 overflow-y-scrol w-[230px]">
                        {categories.map((category) => {
                            return (
                                <div
                                    key={category.id}
                                    onClick={() => { window.location.href = '/category/' + category.id }}
                                    className="flex flex-row justify-between w-full py-2 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    <div className="flex flex-row items-center gap-2 ">
                                        <img src={category.image} width="30px" height="30px" />
                                        <p className="text-sm" style={{ maxLines: 1 }} >
                                            {category.name}
                                        </p>
                                    </div>
                                    <div>
                                        <RightOutlined className="text-gray-400 flex-1" />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div style={{ height: "400px" }} className="overflow-y-scroll flex-1">
                </div>
            </div>
        </div>
    )
}

export default CategorySlider;
