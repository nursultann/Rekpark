import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../api";
import { setProductDetails } from "../redux/actions/product_actions";

const Ad = ({match}) => {
    const dispatch = useDispatch();
    const {productDetails} = useSelector((state) => state.product);

    const fetchProductDetails = async () => {
        const productDetails = await fetchProduct(match.params.id, {
            'with': 'category;customAttributeValues.customAttribute'
        });
        if (productDetails != null) {
            dispatch(setProductDetails(productDetails));
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, []);

    return(
        <div>
            <Navbar />
            
                <div className="col-md-12">
                        <div className="row">
                            <div className="col-md-3">
                            <img src="https://www.bazar.kg/build/images/no-avatar.451f5561.svg" style={{borderRadius:"50%",width:"50px", height:"50px"}}/>
                            <label className="ml-2">Пользователь</label>
                            </div>
                            <div className="col-md-4 mt-2">
                            <hr className="d-block d-md-none" />    
                            <label>Поделиться</label>    
                            <div class="ya-share2" data-curtain data-shape="round" data-services="vkontakte,facebook,odnoklassniki,telegram,whatsapp"></div>
                            </div>
                            <div className="col-md-6 mt-2">
                            <hr className="d-block d-md-none" /> 
                            <a class="btn btn-primary" data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1">Телефон</a>
                                <div class="collapse multi-collapse" id="multiCollapseExample1">
                                    <div class="card card-body">
                                    <a href="tel:+78142332211">+7(814)-233-22-11</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <hr/>
                </div>
                {productDetails != null ?
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="row">
                                        <div className="col-md-8" style={{fontSize:"13px",whiteSpace:"normal"}}>
                                            <h5>Объявление {productDetails.title}</h5>
                                            <label>Тип предложения</label><br/>
                                            {productDetails.custom_attribute_values != null ? 
                                                productDetails.custom_attribute_values.map((item) => {
                                                    return (
                                                        <label>{item.custom_attribute.title} == {item.value}</label>
                                                    )
                                                })
                                                : <div></div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <div class="fotorama"  class="fotorama" data-nav="thumbs" data-maxwith="100%" data-maxheight="100%" data-transitions="crossfade" data-allowfullscreen="native">
                                        {productDetails.media.map((item) => {
                                            return (
                                                <img src={item.original_url}/>
                                            )
                                        })}    
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className="col-md-12">
                            <h5>Описание</h5>
                            <p>{productDetails.description}</p>
                            </div>
                        </div>
                        <div className="col-md-3">

                        </div>
                    </div>
                </div> : <div></div>}
                <Footer/>  
        </div>
    );
}

export default Ad;