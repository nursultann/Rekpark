import React from "react";
import {Link} from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

class Category extends React.Component{
    render(){
    // const settings = {
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: 6,
    //     slidesToScroll: 1,
    //     arrows:true
    //   };
        return(
            <div>
            <Navbar />
            <div className="col-md-12">
            <hr/>
            <div class="nav-scroller py-1 mb-2">
                <nav class="nav d-flex justify-content-between">
                <a class="p-2 text-muted" href="/category">Недвижимость</a>
                <a class="p-2 text-muted" href="/category">Авто</a>
                <a class="p-2 text-muted" href="/category">Разное</a>
                <a class="p-2 text-muted" href="/category">Услуги</a>
                <a class="p-2 text-muted" href="/category">Электроника</a>
                <a class="p-2 text-muted" href="/category">Отдам даром</a>
                <a class="p-2 text-muted" href="/category">Работа</a>
                </nav>
            </div>
            <hr/>
            </div>
            <div className="row mx-0">
                <div className="col-md-12">
                <h3>По категории</h3>
                </div>
                    <div className="col-md-4">
                        <div className="card">
                            <img src="https://cdn.pixabay.com/photo/2021/08/25/20/42/field-6574455__340.jpg" className="card-img-top" width="100%"/>
                            <div className="card-body">
                                <label className="card-title">
                                    Заголовок
                                </label>
                                <p className="card-text"></p>
                            </div>
                        </div>
                    </div>
            </div>   
            <Footer/>
           </div>
        );
        }
}
export default Category;