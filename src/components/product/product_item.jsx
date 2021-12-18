import React from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import '../../dist/css/custom_card.css';
import { setProductDetails } from "../../redux/actions/product_actions";
import { AppImage } from "../custom_components";

const ProductItem = ({product}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const navigateToProductDetailsPage = (product) => {
        dispatch(setProductDetails(product));
        history.push(`products/${product.id}`);
    };

    const baseStyle = { height: 'auto' };
    if (typeof product.features === 'object' && !Array.isArray(product.features)) {
        if (product.features.color !== null) {
            baseStyle.background = product.features.color;
        }
    }         
              var nowDate = new Date().getDate();
              var nowMonth = new Date().getMonth();
              var nowYear = new Date().getFullYear(); 
              var nowDay = new Date().getDay();
              var Fulldate = new Date(product.created_at);
              var date = Fulldate.getDate();
              var month = Fulldate.getDate();
              var year = Fulldate.getFullYear();
              var day = Fulldate.getDay();
              var allDate = date+'/'+month+'/'+year;
              if(date==nowDate && month==nowMonth && year ==nowYear && day==nowDay){
                allDate = "Сегодня";
              }
              else if(date==nowDate && month==nowMonth && year ==nowYear && day<nowDay && day+1==nowDay || date==nowDate && month==nowMonth && year ==nowYear && day==nowDay+6){
                allDate = "Вчера";
              }else if(date==nowDate && month==nowMonth && year ==nowYear && day<nowDay && day+2 == nowDay || date==nowDate && month==nowMonth && year ==nowYear && day==nowDay+5){
                allDate = "Позавчера";
              }
              var Update = new Date(product.updated_at);
              var updated_day = Update.getDay();
              var updated_date = Update.getDate();
              var updated_month = Update.getMonth();
              var updated_year = Update.getFullYear();
              var update = updated_date + '/'+updated_month+'/'+updated_year;
              if(updated_date == nowDate && updated_month==nowMonth && updated_year==nowYear && updated_day==nowDay){
                update = "Сегодня";
              }
              else if(updated_date == nowDate && updated_month==nowMonth && updated_year==nowYear && updated_day<nowDay && updated_day+1==nowDay || updated_date == nowDate && updated_month==nowMonth && updated_year==nowYear && updated_day==nowDay+6){
                update = "Вчера";
              }else if(updated_date == nowDate && updated_month==nowMonth && updated_year==nowYear && updated_day<nowDay && updated_day+2 == nowDay || updated_date == nowDate && updated_month==nowMonth && updated_year==nowYear && updated_day==nowDay+5){
                update = "Позавчера";
              }
    const image = product.has_media 
        ? product.media[0].original_url 
        : '';
    return (
        <a onClick={() => navigateToProductDetailsPage(product)}>
            <div className="shadow-sm rounded" style={{ ...baseStyle }}>
                <div style={{ height: 250 }}>
                    <AppImage height={250} width="100%" src={image} classNameName="card-img-top rounded" style={{objectFit: "cover"}} />
                    {product.is_vip ? 
                        <div style={{ position: "absolute", left: "30px", top: "10px",  }}><span className="badge badge-danger p-2">VIP</span></div> 
                        : <></>}
                </div>
                <div class="card-body">
                    <h5 class="card-title">{product.title}</h5>
                    <p class="card-text">{product.description}</p>
                    <label className="text-muted" style={{fontSize:15}}>
                        Опубликовано: {allDate}
                    </label>
                    <label className="text-muted" style={{fontSize:15}}>
                        Обновлено: {update}
                    </label>
                </div>
            </div>
        </a>
    );
};

export default ProductItem;