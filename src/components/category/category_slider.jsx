import { useSelector, useDispatch } from "react-redux";
import * as api from "../../api";
import { Link } from "react-router-dom";
import { setCategories } from "../../redux/actions/category_actions";
import React, { useEffect } from "react";
import Slider from "react-slick";
import { Cascader, Popover } from 'antd';

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
    const {categories} = useSelector((state) => state.category);

    const fetchCategoriesTree = async () => {
        const categories = await api.fetchCategoriesTree();
        if (categories != null) {
            dispatch(setCategories(categories));
        }
    };

    const sliderSettings = {
        dots: true,
        arrows: false,
        infinite: false,
        speed: 500,
        slidesToShow: 11,
        slidesToScroll: 1,
        nextArrow: <SampleArrow />,
        prevArrow: <SampleArrow />,
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 11,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 6,
                slidesToScroll: 2,
                initialSlide: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1
              }
            }
          ]
    };

    useEffect(() => {
        fetchCategoriesTree();
    }, []);

    const popoverContent = (children) => (
        <div style={{width: '250px'}}>
          {children.map((item) => (<p>{item.name}</p>))}
        </div>
    );

    const content = (category) => {
        const image = category.media.length > 0 
                    ? category.media[0].original_url 
                    : 'https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg';
        return (
            <div id={category.id}>  
                <Link to={`/category/${category.id}`}>
                    <div className="col-md-12 px-2 mb-3 d-flex flex-column align-items-center justify-content-center">                  
                        <img className="mx-3 mb-1 rounded-circle" src={image} width="50px" height="50px" />
                        <p style={{fontSize: 10,width:"100px"}}>{category.name}</p>
                    </div>
                </Link>
            </div>
        );
    };

    return (
        <Slider {...sliderSettings}>
            {categories.map((category) => {
                return (
                    category.children?.length ? 
                        <Popover 
                            className="col-md-4" 
                            content={() => popoverContent(category.children)} 
                            placement="bottom"
                        >
                            {content(category)}
                        </Popover> 
                        : <div className="col-md-4">
                            {content(category)}
                        </div>
                  )  
              })}
        </Slider>
    );

};

export default CategorySlider;