import React from "react";
import CategorySlider from "./category/category_slider";
import {Button} from 'antd';
const SearchBar = () => {
  
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
          <select class="custom-select ml-1">
            <option selected>Город</option>
            <option value="1">Ош</option>
            <option value="2">Баткен</option>
            <option value="3">Джалалабад</option>
          </select>
        </div>
        <div class="col-md-4 mt-2 mt-md-0 d-flex justify-content-center d-md-flex justify-content-end  mb-2">
            <Button type="primary" className="rounded-pill" style={{backgroundColor:"#4dab04"}}>
              Поиск
            </Button>
        </div>
    </div>
    <div className="col-md-12 py-3">
      <hr/>
      <center><CategorySlider /></center>
    </div>
    
  </div>
  <hr/>
  </div>
        );
    }
export default SearchBar;