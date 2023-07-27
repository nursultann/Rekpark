import { useSelector, useDispatch } from "react-redux";
import * as api from "../../api";
import { Link } from "react-router-dom";
import { setCategories } from "../../redux/actions/category_actions";
import React, { useEffect } from "react";
import Slider from "react-slick";
import { Popover } from 'antd';
import buildPhoto from '../../images/free-icon-building-9742682.png';
import transportPhoto from '../../images/free-icon-public-transport-2055374.png';
import bussinessPhoto from '../../images/free-icon-finance-2769560.png';
import thingsPhoto from '../../images/free-icon-belongings-6448253.png';
import jobPhoto from '../../images/free-icon-work-time-3673469.png';
import servicePhoto from '../../images/free-icon-digital-services-3852620.png';
import electronicsPhoto from '../../images/free-icon-electronics-1062302.png';
import animalPhoto from '../../images/free-icon-livestock-3397536.png';
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
    slidesToShow: 11,
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

  useEffect(() => {
    fetchCategoriesTree();
  }, []);
  const categoryAction = (id) => {
    window.location.href = "/category/" + id;
    console.log('1');
  }
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
      <div id={category.id}>
        <Link className="cat-link" to={`category/${category.id}`} style={{ color: "black" }}>
          <div className="col-md-12 px-0 mb-3 d-flex flex-column align-items-center justify-content-center">
            <img className="mx-3 mb-1 rounded-circle" src={image} width="50px" height="50px" />
            <p style={{ fontSize: 13, width: 100 }}>{category.name}</p>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <>
      {/* <div className="row d-none mt-5">
        <div className="col-6 col-lg-3 mb-2">
          <a href="/category/13">
            <div className="col-12 bg-light rounded">
              <div className="row">
                <div className="col-2 col-md-5">
                  Транспорт
                </div>
                <div className="col-10 col-md-7">
                  <img src={transportPhoto}
                    alt="" width={'100%'}
                  />
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="col-6 col-lg-3 mb-2">
          <a href="/category/6">
            <div className="col-12 bg-light rounded">
              <div className="row">
                <div className="col-2 col-md-5">
                  <p>Недвижимость</p>
                </div>
                <div className="col-10 col-md-7">
                  <img src={buildPhoto}
                    alt="" width={'100%'}
                  />
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="col-6 col-lg-3 mb-2">
          <a href="/category/12">
            <div className="col-12 bg-light rounded">
              <div className="row">
                <div className="col-2 col-md-5">
                  <p>Услуги</p>
                </div>
                <div className="col-10 col-md-7">
                  <img src={servicePhoto}
                    alt="" width={'100%'}
                  />
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="col-6 col-lg-3 mb-2">
          <a href="/category/9">
            <div className="col-12 bg-light rounded">
              <div className="row">
                <div className="col-2 col-md-5">
                  <p>Электроника</p>
                </div>
                <div className="col-10 col-md-7">
                  <img src={electronicsPhoto}
                    alt="" width={'100%'}
                  />
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="col-6 col-lg-3 mb-2">
          <a href="/category/7">
            <div className="col-12 bg-light rounded">
              <div className="row">
                <div className="col-2 col-md-5">
                  <p>Работа</p>
                </div>
                <div className="col-10 col-md-7">
                  <img src={jobPhoto}
                    alt="" width={'100%'}
                  />
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="col-6 col-lg-3 mb-2">
          <a href="/category/10">
            <div className="col-12 bg-light rounded">
              <div className="row">
                <div className="col-2 col-md-5">
                  <p>Личные вещи</p>
                </div>
                <div className="col-10 col-md-7">
                  <img src={thingsPhoto}
                    alt="" width={'100%'}
                  />
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="col-6 col-lg-3 mb-2">
          <a href="/category/15">
            <div className="col-12 bg-light rounded">
              <div className="row">
                <div className="col-2 col-md-5">
                  <p>Для бизнеса</p>
                </div>
                <div className="col-10 col-md-7">
                  <img src={bussinessPhoto}
                    alt="" width={'100%'}
                  />
                </div>
              </div>
            </div>
          </a>
        </div>
        <div className="col-6 col-lg-3 mb-2">
          <a href="/category/16">
            <div className="col-12 bg-light rounded">
              <div className="row">
                <div className="col-2 col-md-5">
                  <p>Животные</p>
                </div>
                <div className="col-10 col-md-7">
                  <img src={animalPhoto}
                    alt="" width={'100%'}
                  />
                </div>
              </div>
            </div>
          </a>
        </div>
      </div> */}
      <div className="col-12">
        <Slider {...sliderSettings}>
          {categories.map((category) => {
            return (
              category.children != null && category.children.length > 0 ?
                <Popover
                  key={category.id}
                  className="col-md-4"
                  content={() => popoverContent(category.children)}
                  placement="bottom"
                >
                  {content(category)}
                </Popover>
                : <div className="col-md-4" key={category.id}>
                  {content(category)}
                </div>
            )
          })}
        </Slider>
      </div>

    </>
  );

};

export default CategorySlider;