import React, { useState } from "react";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useCategoriesTree } from "../../../hooks/category_hooks";
import gridIcon from "../../../dist/icons/grid.svg";

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
        <div className="px-2 pt-[3px] flex flex-col h-full align-items-center justify-center">
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
    const categories = useCategoriesTree()
    const [options, setOptions] = useState([]);
    const [active, setActive] = useState(0);
    const [menuButtonHovered, setMenuButtonHovered] = useState(false);
    const [menuHovered, setMenuHovered] = useState(false);
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

    const popoverContent = (children) => (
        <div style={{ width: '250px' }}>
            {children.map((item) => (<><a className="cat-link" style={{ color: "rgb(9, 72, 130)" }} href={`/category/${item.id}`}>{item.name}</a><br /></>))}
        </div>
    );

    const contentMake = (cat) => {
        if (cat.children.length > 0) {
            return (
                <>
                    {cat.children.map((item) =>
                        <div className='px-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                            <img src={item.image} width={35} alt="" />
                            <a href={"/category/" + item.id} className="py-2">{item.name}</a>
                        </div>
                    )
                    }
                </>
            )
        }
    }

    const menuVisible = menuButtonHovered || menuHovered

    return (
        <div className="flex flex-col">
            <div className="flex flex-row align-items-center ">
                <div
                    className="bg-blue-500 flex gap-2 px-4  align-items-center rounded-[10px] cursor-pointer hover:bg-blue-600 active:bg-blue-700"
                    style={{ height: "42px" }}
                    onMouseEnter={() => {
                        console.log("mouse enter button")
                        setMenuButtonHovered(true)
                    }}
                    onMouseLeave={() => {
                        console.log("mouse leave button")
                        setTimeout(() => {
                            setMenuButtonHovered(false)
                        }, 500)
                    }}
                >
                    <img src={gridIcon} alt="" width="40px" height="40px" />
                    <div>
                        <p className="text-white text-lg">Категории</p>
                    </div>
                </div>

                <div
                    className=" bg-neutral-800 rounded-[9.58px] flex align-items-center justify-center ml-3 mr-1 hover:bg-neutral-700 cursor-pointer active:bg-neutral-900"
                    style={{ height: "35px", width: "45px" }}
                    onClick={() => sliderRef.current.slickPrev()}
                >
                    <LeftOutlined className="text-white" />
                </div>

                <Slider className="w-full overflow-x-clip align-items-center" {...sliderSettings} ref={sliderRef}>

                    {categories.map((category) => {
                        return <CategoryItem category={category} />
                    })}

                </Slider>

                <div
                    className="bg-neutral-800 rounded-[9.58px] flex align-items-center justify-center ml-2 hover:bg-neutral-700 cursor-pointer active:bg-neutral-900"
                    style={{ height: "35px", width: "45px" }}
                    onClick={() => sliderRef.current.slickNext()}
                >
                    <RightOutlined className="text-white" />
                </div>

            </div >

            <div className="flex flex-row mt-3 align-items-center justify-center">
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

            <div
                id="mega-menu-full-dropdown"
                class={
                    `mt-1 bg-red border-gray-200  border-y bg-white absolute top-12 z-50
                    rounded-xl w-full shadow-lg py-1 text-sm transition-all duration-300 ease-in-out  transform  ${menuVisible ? 'opacity-100 ' : 'opacity-0'} py-2 overflow-scroll`
                }
                style={{ height: "400px" }}
                onMouseEnter={() => {
                    if (!menuVisible) return
                    console.log("mouse enter menu")
                    setMenuHovered(true)
                }}
                onMouseLeave={() => {
                    console.log("mouse leave menu")
                    setMenuHovered(false)
                }}
            >
                <div className="flex flex-row  gap-3">
                    <div className="flex-none overflow-scroll" style={{ height: "400px" }}>
                        <div className="flex flex-col px-4 overflow-y-scrol w-[230px]">
                            {categories.map((category) => {
                                return (
                                    <div className="flex flex-row justify-between w-full py-2 px-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
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



        </div >
    );

};

export default CategorySlider;
// import { useSelector, useDispatch } from "react-redux";
// import * as api from "../../api";
// import { Link } from "react-router-dom";
// import { setCategories } from "../../redux/actions/category_actions";
// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import { Popover } from 'antd';

// function SampleArrow(props) {
//   const { className, style, onClick } = props;
//   return (
//     <div
//       className={className}
//       style={{ ...style, display: "block" }}
//       onClick={onClick}
//     />
//   );
// }

// const CategorySlider = () => {
//   const dispatch = useDispatch();
//   const { categories } = useSelector((state) => state.category);
//   const [options, setOptions] = useState([]);
//   const fetchCategoriesTree = async () => {
//     const categories = await api.fetchCategoriesTree();
//     if (categories != null) {
//       dispatch(setCategories(categories));
//     }
//   };
//   const sliderSettings = {
//     dots: true,
//     arrows: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 11,
//     slidesToScroll: 1,
//     nextArrow: <SampleArrow />,
//     prevArrow: <SampleArrow />,

//     responsive: [
//       {
//         breakpoint: 1280,
//         settings: {
//           slidesToShow: 8,
//           slidesToScroll: 3,
//           infinite: true,
//           dots: true
//         }
//       },
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 8,
//           slidesToScroll: 3,
//           infinite: true,
//           dots: true
//         }
//       },
//       {
//         breakpoint: 768,
//         settings: {
//           slidesToShow: 6,
//           slidesToScroll: 3,
//           infinite: true,
//           dots: true
//         }
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 4,
//           slidesToScroll: 2,
//           initialSlide: 2,
//           arrows: true,
//           speed: 500,
//         }
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//           arrows: true,
//           speed: 500,
//         }
//       }
//     ]
//   };

//   useEffect(() => {
//     fetchCategoriesTree();
//   }, []);

//   const popoverContent = (children) => (
//     <div style={{ width: '250px' }}>
//       {children.map((item) => (<><a className="cat-link" style={{ color: "rgb(9, 72, 130)" }} href={`/category/${item.id}`}>{item.name}</a><br /></>))}
//     </div>
//   );
//   console.log('categories', categories);
//   const content = (category) => {
//     const image = category.image != null
//       ? category.image
//       : 'https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg';
//     return (
//       <div className="col-12" id={category.id}>
//         <Link className="cat-link btn py-1 btn-warning text-white" to={`category/${category.id}`} style={{ color: "black", fontSize: 13 }}>
//           {/* <div className="col-md-12 px-0 mb-3 d-flex flex-column align-items-center justify-content-center">
//             <img style={{ maxWidth: "none" }} className="mx-3 mb-1 rounded-circle" src={image} width="50px" height="50px" />
//             <p style={{ fontSize: 13, width: 100 }}>{category.name}</p>
//           </div> */}
//           {category.name}
//         </Link>
//       </div>
//     );
//   };
//   const contentMake = (cat) => {
//     if (cat.children.length > 0) {
//       return (
//         <>
//           {cat.children.map((item) =>
//             <div className='px-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
//               <img src={item.image} width={35} alt="" />
//               <a href={"/category/" + item.id} className="py-2">{item.name}</a>
//             </div>
//           )
//           }
//         </>
//       )
//     }
//   }
//   return (
//     <div className="row">
//       <div className="col-2">
//         {options != null ?
//           <div className='d-none d-md-block'>
//             <Popover content={<>
//               <div className='col-12 px-0 rounded-lg'>
//                 {categories.map((category) => {
//                   return (
//                     category.children != null && category.children.length > 0 ?
//                       <Popover
//                         key={category.id}
//                         className=""
//                         content={() => contentMake(category)}
//                         placement="right"
//                       >
//                         <div className='col-12 d-flex px-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
//                           <img src={category.image} width={35} alt="" />
//                           <a href={"/category/" + category.id} className="py-2">{category.name}</a>
//                         </div>
//                       </Popover>
//                       :
//                       <div className='col-12 d-flex px-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
//                         <img src={category.image} width={35} alt="" />
//                         <a href={"/category/" + category.id} className="py-2">{category.name}</a>
//                       </div>
//                   )
//                 })}
//               </div>
//             </>}>
//               <button className='col-12 btn btn-primary rounded-lg px-3 py-1 text-center' type="primary"><i className="fa-solid fa-table-cells-large"></i> Категории</button>
//             </Popover>
//           </div>
//           : <></>
//         }
//       </div>
//       <div className="col-md-10">
//         {/* <Slider className="col-12" {...sliderSettings}> */}
//         {/* <div className='d-flex justify-content-between scroll p-2' style={{ width: '100%', overflowX: 'scroll' }}>
//           {categories.map((category) => {
//             return (
//               category.children != null && category.children.length > 0 ?
//                 <div className="col-3">
//                   <Popover
//                     key={category.id}
//                     content={() => popoverContent(category.children)}
//                     placement="bottom"
//                   >
//                     {content(category)}
//                   </Popover>
//                 </div>
//                 : <div className="col-3" key={category.id}>
//                   {content(category)}
//                 </div>
//             )
//           })}
//         </div> */}
//         <div id="menu1">
//           <ul className="items">
//             <li>item1</li>
//             <li>item2</li>
//             <li>item3</li>
//             <li>item4</li>
//             <li>item5</li>
//             <li>item6</li>
//             <li>item7</li>
//             <li>item7</li>
//           </ul>
//           <div id="nav1">
//             <div id="prev1">Prev</div>
//             <div id="next1">Next</div>
//           </div>
//         </div>
//         {/* </Slider> */}
//       </div>
//     </div>
//   );

// };

// export default CategorySlider;