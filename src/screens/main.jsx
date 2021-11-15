import React from "react";
import {Link} from "react-router-dom";
import Navbar from "../components/navbar";
import SearchBar from "../components/search-bar";

const Main = () => {  
  return (
    <div>
      <Navbar />
      <SearchBar />
      <main role="main" class="container-fluid">
        <div class="row">
          <div class="col-md-8">
            <h5 class="text-muted">Новые Объявления</h5>
            <div class="row mt-4 mb-4">
              <div class="col-md-12 pb-5 pt-1 owl-carousel owl-theme" id="slider2">
                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="/ad" class="slide__link">Кнопка</a>
                </div>
                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>
                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>
                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>

                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>

                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>

                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>
              </div>
            </div>
            <hr />
            <h5 class="text-muted">Популярные Объявления</h5>
            <div class="row mt-4 mb-4">
              <div class="col-md-12 pb-5 pt-1 owl-carousel owl-theme" id="slider1">
                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>

                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>
                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>
                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>

                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>

                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>

                <div class="slide">
                  <img
                    src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                    width="100%"
                  />
                  <h5 class="slide__title">Заголовок слайда</h5>
                  <a href="#" class="slide__link">Кнопка</a>
                </div>
              </div>
            </div>
            <hr />
            <h5 class="text-muted">Бизнес профили</h5>
            <div class="col-md-12 pb-5 pt-1 owl-carousel owl-theme" id="slider">
              <div class="slide">
                <img
                  src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                  width="100%"
                />
                <h5 class="slide__title">Заголовок слайда</h5>
                <a href="#" class="slide__link">Кнопка</a>
              </div>

              <div class="slide">
                <img
                  src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                  width="100%"
                />
                <h5 class="slide__title">Заголовок слайда</h5>
                <a href="#" class="slide__link">Кнопка</a>
              </div>
              <div class="slide">
                <img
                  src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                  width="100%"
                />
                <h5 class="slide__title">Заголовок слайда</h5>
                <a href="#" class="slide__link">Кнопка</a>
              </div>
              <div class="slide">
                <img
                  src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                  width="100%"
                />
                <h5 class="slide__title">Заголовок слайда</h5>
                <a href="#" class="slide__link">Кнопка</a>
              </div>

              <div class="slide">
                <img
                  src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                  width="100%"
                />
                <h5 class="slide__title">Заголовок слайда</h5>
                <a href="#" class="slide__link">Кнопка</a>
              </div>

              <div class="slide">
                <img
                  src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                  width="100%"
                />
                <h5 class="slide__title">Заголовок слайда</h5>
                <a href="#" class="slide__link">Кнопка</a>
              </div>

              <div class="slide">
                <img
                  src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg"
                  width="100%"
                />
                <h5 class="slide__title">Заголовок слайда</h5>
                <a href="#" class="slide__link">Кнопка</a>
              </div>
            </div>
          </div>
          <div class="col-md-4"></div>
        </div>
      </main>
    </div>    
  );
}

export default Main;