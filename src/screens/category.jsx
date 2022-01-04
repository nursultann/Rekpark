import React from "react";
import {Link} from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import CategorySlider from "../components/category/category_slider";

const Category = ()=> {
        return(
            <div>
            <Navbar />
            <div className="col-md-12 px-2">
            <CategorySlider/>
            </div>
            {/* <div className="col-md-12">
                <hr/>
            </div> */}
            <div className="row mx-0 mt-3">
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
export default Category;