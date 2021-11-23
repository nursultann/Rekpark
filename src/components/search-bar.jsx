import { useSelector, useDispatch } from "react-redux";
import * as api from "../api";
import { Link } from "react-router-dom";
import { setCategories } from "../redux/actions/category_actions";
import React, { useEffect } from "react";
import Slider from "react-slick";

const SearchBar = () => {
  const dispatch = useDispatch();
  const {categories} = useSelector((state) => state.category);

  const fetchCategoriesTree = async () => {
      const categories = await api.fetchCategoriesTree();
      if (categories != null) {
          dispatch(setCategories(categories));
      }
  };
  
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
  };

  useEffect(() => {
      fetchCategoriesTree();
  }, []);
        return(
            <div>
            <div class="col-md-12">
    <div class="row mt-4">
        <div class="col-md-4">
          <div class="input-group input-group-sm mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="inputGroup-sizing-sm">Поиск</span>
            </div>
            <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" placeholder="по ключевому слову"/>
          </div>
        </div>
        <div class="col-md-4 d-flex justify-content-start">
          <select class="custom-select">
            <option selected>Категории</option>
            <option value="1">Недвижимость</option>
            <option value="2">Авто</option>
            <option value="3">Работа</option>
          </select>
          <select class="custom-select">
            <option selected>Город</option>
            <option value="1">Ош</option>
            <option value="2">Баткен</option>
            <option value="3">Джалалабад</option>
          </select>
        </div>
        <div class="col-md-4 d-flex justify-content-end mb-2">
            <button class="btn btn-outline-primary">
              Поиск
            </button>
        </div>
    </div>
    <div className="col-md-12">
      <hr/>         
              {/* <div className="row"> */}
              <Slider {...settings}>
              {categories.map((category) => {
                 return (
                  <div class="col-md-4">    
                 <div class="text-center" id={category.id}>     
                    <a href={`/category/${category.id}`}>                    
                      <p class="slide__title">{category.name}</p>
                      <img src={category.media.length > 0 ? category.media[0].original_url : 'https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg'} width="100%" />
                    </a>
                  </div>
                  </div> 
                  )  
              })}
              </Slider>
              {/* </div> */}
              
      
    </div>
    
  </div>
  <hr/>
  </div>
        );
    }
export default SearchBar;