import { useSelector, useDispatch } from "react-redux";
import * as api from "../../api";
import { Link } from "react-router-dom";
import { setCategories } from "../../redux/actions/category_actions";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Popover } from 'antd';


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

const CategorySlider = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);
  const [options, setOptions] = useState([]);
  const fetchCategoriesTree = async () => {
    const categories = await api.fetchCategoriesTree();
    if (categories != null) {
      dispatch(setCategories(categories));
    }
  };
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 1,
    nextArrow: <SampleArrow />,
    prevArrow: <SampleArrow />,

    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 8,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 2,
          arrows: true,
          speed: 500,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
          speed: 500,
        }
      }
    ]
  };
  const popoverContent = (children) => (
    <div style={{ width: '250px' }}>
      {children.map((item) => (<><a className="cat-link" style={{ color: "rgb(9, 72, 130)" }} href={`/category/${item.id}`}>{item.name}</a><br /></>))}
    </div>
  );
  console.log('categories', categories);
  const content = (category) => {
    const image = category.image != null
      ? category.image
      : 'https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg';
    return (
      <div className="mx-2" id={category.id} style={{maxWidth : 100}}>
        <Link className="cat-link" to={`category/${category.id}`} style={{ color: "black" }}>
          <div className="col-md-12 p-0 mb-3">
            {/* <div className="bg-secondary w-100 p-0">
            <img className="float-left" src={image} width="15px" height="15px" />
            <span className="text-left" style={{ fontSize: 11}}>{category.name}</span>
            </div> */}
            <div className="bg-light d-flex">
              <img style={{ maxWidth: 'none' }} src={image} width={'30px'} />
              <label style={{ fontSize: 11 }}>{category.name}</label>
            </div>
          </div>
        </Link>
      </div>
    );
  };
  const contentMobile = (category) => {
    const image = category.image != null
      ? category.image
      : 'https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg';
    return (
      <div className="mx-1" id={category.id}>
        <Link className="cat-link" to={`category/${category.id}`} style={{ color: "black" }}>
          <div className="col-md-12 bg-light p-0 mb-3 rounded p-0 border">
            <div className="row">
              <div className="col-3">
                <img style={{ maxWidth: 'none' }} src={image} width={'30px'} />
              </div>
              <div className="col-9 pl-0">
              <label style={{ fontSize: 11 }}>{category.name}</label>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  };
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

  useEffect(() => {
    fetchCategoriesTree();
  }, []);
  return (
    <div className="row">
      <div className="col-2 pr-0 pr-lg-1 col-lg-3">
        {options != null ?
          <div className='px-0 py-0 px-lg-3 py-lg-3'>
            <Popover content={<>
              <div className='col-12 px-0 rounded-lg'>
                {categories.map((category) => {
                  return (
                    category.children != null && category.children.length > 0 ?
                      <Popover
                        key={category.id}
                        className=""
                        content={() => contentMake(category)}
                        placement="right"
                        style={{ maxWidth: 'none' }}
                      >
                        <div className='col-12 d-flex hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                          <img src={category.image} width={35} alt="" style={{ maxWidth: 'none' }} />
                          <a href={"/category/" + category.id} className="py-2">{category.name}</a>
                        </div>
                      </Popover>
                      :
                      <div className='col-12 d-flex hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'>
                        <img src={category.image} width={35} alt="" style={{ maxWidth: 'none' }} />
                        <a href={"/category/" + category.id} className="py-2">{category.name}</a>
                      </div>
                  )
                })}
              </div>
            </>}>
              <button className='col-12 d-none d-lg-block btn btn-primary rounded-lg py-1 text-center' type="primary"><i className="fa-solid fa-table-cells-large"></i> Все категории</button>
              <button className='d-block d-lg-none btn btn-primary' style={{borderRadius : 12}}><i className="fa-solid fa-table-cells-large"></i></button>
            </Popover>
          </div>
          : <></>
        }
      </div>
      <div className="col-12 col-lg-9 d-none d-lg-block">
        {/* <a className="btn py-1 btn-warning text-white" href="">Детям</a> */}
        <Slider {...sliderSettings}>
          {categories.map((category) => {
            return (
              category.children != null && category.children.length > 0 ?
                <Popover
                  className=""
                  content={() => popoverContent(category.children)}
                  placement="bottom"
                  style={{ maxWidth: 'none' }}
                >
                  {content(category)}
                </Popover>
                : <div className="" style={{ maxWidth: '100px' }}>
                  {content(category)}
                </div>
            )
          })}
        </Slider>
      </div>
      <div className="col-10 d-block d-lg-none pl-0">
          <div className='d-flex justify-content-between' style={{ width: '100%', overflowX: 'scroll' }}>
          {categories.map((category) => {
            return (
              category.children != null && category.children.length > 0 ?
                <div className="col-5 p-0">
                  <Popover
                    key={category.id}
                    content={() => popoverContent(category.children)}
                    placement="bottom"
                  >
                    {contentMobile(category)}
                  </Popover>
                </div>
                : <div className="col-5 p-0" key={category.id}>
                  {contentMobile(category)}
                </div>
            )
          })}
        </div>
      </div>

    </div>
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