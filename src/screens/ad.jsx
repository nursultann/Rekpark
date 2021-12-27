import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../api";
import { setProductDetails } from "../redux/actions/product_actions";
import Carousel from 'react-gallery-carousel';
import { FacebookShareButton, WhatsappShareButton,TelegramShareButton } from "react-share";
import { FacebookIcon,WhatsappIcon, TelegramIcon } from "react-share";
import {Button} from 'antd';
const Ad = ({match}) => {
    const dispatch = useDispatch();
    const {productDetails} = useSelector((state) => state.product);
    // const {shareUrl,setUrl} = useState();
    // setUrl();
    const fetchProductDetails = async () => {
        const productDetails = await fetchProduct(match.params.id, {
            'with': 'category;customAttributeValues.customAttribute;region;city'
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
                {productDetails != null ? <>          
                <div className="col-md-12 mt-2">
                        <div className="row">
                            <div className="col-md-2">
                            <img src="https://www.bazar.kg/build/images/no-avatar.451f5561.svg" style={{borderRadius:"50%",width:"50px", height:"50px"}}/>
                            <label className="ml-2">{productDetails.name}</label>
                            </div>
                            <div className="col-md-3 mt-2">
                            <hr className="d-block d-md-none" />    
                            <label className="text-muted">Поделиться</label><br/>    
                            <FacebookShareButton
                                url={window.location.href}
                                quote={"フェイスブックはタイトルが付けれるようです"}
                                hashtag={"#hashtag"}
                                description={"aiueo"}
                                className="Demo__some-network__share-button mr-1"
                            >
                            <FacebookIcon size={30} round />
                            </FacebookShareButton>
                            <WhatsappShareButton 
                            url={window.location.href}
                            quote={"フェイスブックはタイトルが付けれるようです"}
                            hashtag={"#hashtag"}
                            description={"aiueo"}
                            className="Demo__some-network__share-button mr-1"
                            >
                                <WhatsappIcon size={30} round />
                            </WhatsappShareButton>
                            <TelegramShareButton 
                            url={window.location.href}
                            quote={"フェイスブックはタイトルが付けれるようです"}
                            hashtag={"#hashtag"}
                            description={"aiueo"}
                            className="Demo__some-network__share-button"
                            >
                                <TelegramIcon size={30} round />
                            </TelegramShareButton>
                            </div>
                            <div className="col-md-3 mt-2">
                            <label class="ml-3 text-muted">Просмотры: {productDetails.views}<br/>
                             Регион,город: {productDetails.region != null ? productDetails.region.name+","+productDetails.city.name : ""}</label>
                            </div>
                            <div className="col-md-3 mt-2">
                            <hr className="d-block d-md-none" /> 
                            <Button class="btn btn-outline-primary" data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1">Показать номер</Button>
                                <div class="collapse multi-collapse" id="multiCollapseExample1">
                                    <div class="card card-body">
                                    <a href={"tel:"+productDetails.phones}>{productDetails.phones}</a>
                                    </div>
                                </div>    
                            </div>
                        </div>
                    <hr/>
                </div>
                
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-9">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="row">
                                        <div className="col-md-8" style={{fontSize:"13px",whiteSpace:"normal"}}>
                                            <h5>{productDetails.title}</h5>
                                            <h5>{productDetails.price+" " + productDetails.currency_symbol}</h5>
                                            {productDetails.custom_attribute_values != null ? 
                                                productDetails.custom_attribute_values.map((item) => {
                                                    return (
                                                        <>
                                                        <label>{item.custom_attribute.title}: {item.value}</label>
                                                        </>
                                                        )
                                                })
                                                : <></>}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <Carousel 
                                        images={productDetails.media.map((item) => ({
                                            src: `${item.original_url}`
                                        }))} 
                                        style={{ height:"350px", width: "100%" }} />
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
                </div></> : <div>loading</div>}
                <Footer/>  
        </div>
    );
}

export default Ad;