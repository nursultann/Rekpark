import React from "react";

class SearchBar extends React.Component{
  // constructor(props){
  //   super(props);
  //   this.state = {
  //     categories : [],
  //     error
  //   };
  // }  
  
  render(){
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
              <div class="col-md-12 owl-carousel owl-theme" id="category">
                  
                  
                  
                  {/* <div class="slide text-center">
                    <a href="/category" class="slide__link">
                    <i class="fas fa-home fa-2x text-secondary"></i>
                      <p class="slide__title">Недвижимость</p>
                    </a>
                  </div>
                  <div class="slide text-center">
                    <a href="/category" class="slide__link">
                    <i class="fas fa-car fa-2x text-secondary"></i>
                      <p class="slide__title">Транспорт</p>
                    </a>
                  </div>
                  <div class="slide text-center">
                    <a href="/category" class="slide__link">
                    <i class="fas fa-tools fa-2x text-secondary"></i>
                      <p class="slide__title">Услуги</p>
                    </a>
                  </div>
                  <div class="slide text-center">
                    <a href="/category" class="slide__link">
                    <i class="fas fa-people-carry fa-2x text-secondary"></i>
                      <p class="slide__title">Работа</p>
                    </a>
                  </div>
                  <div class="slide text-center">
                    <a href="/category" class="slide__link">
                    <i class="fas fa-tshirt fa-2x text-secondary"></i>
                      <p class="slide__title">Личные вещи</p>
                    </a>
                  </div>
                  <div class="slide text-center">
                    <a href="/category" class="slide__link">
                    <i class="fas fa-hand-holding text-secondary fa-2x"></i>
                      <p class="slide__title">Отдам даром</p>
                    </a>
                  </div>
                  <div class="slide text-center">
                    <a href="/category" class="slide__link">
                    <i class="far fa-star fa-2x text-secondary"></i>
                      <p class="slide__title">Разное</p>
                    </a>
                  </div> */}
                  
                      
              </div>
      
    </div>
    
  </div>
  <hr/>
  </div>
        );
    }
}
export default SearchBar;