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
    var nowMonth = new Date().getMonth();
    nowMonth+=1;
    var nowYear = new Date().getFullYear();
    var nowDate = new Date().getDate();
    var nowDay = new Date().getDay();
    var Fulldate = new Date(product.created_at);
    var date = Fulldate.getDate();
    var month = Fulldate.getMonth();
    month+=1;
    var year = Fulldate.getFullYear();
    var day = Fulldate.getDay();
    var allDate = date+'/'+month+'/'+year;
    if(day < nowDay && day + 1 == nowDay || day == nowDay + 6) {
        allDate = "Вчера";
    } else if (day < nowDay && day + 2 == nowDay || day == nowDay + 5) {
        allDate = "Позавчера";
    }
    var Update = new Date(product.created_at);
    var updated_day = Update.getDay();
    var updated_date = Update.getDate();
    var updated_month = Update.getMonth();
    updated_month+=1;
    var updated_year = Update.getFullYear();
    var updated_hour = Update.getHours();
    var updated_min = Update.getMinutes();
    if(updated_hour<9){
        updated_hour = '0'+updated_hour;
    }
    if(updated_min<9){
        updated_min = '0'+updated_min;
    }
    var update = updated_date + '/' + updated_month + '/' + updated_year;
    if(updated_day == nowDay && updated_date == nowDate && updated_month == nowMonth && updated_year == nowYear ) {
        update = "Сегодня в "+updated_hour+":"+updated_min;
    } else if (((updated_day < nowDay && updated_day + 1 == nowDay) || updated_day == nowDay + 6) && updated_date < nowDate && updated_month == nowMonth && updated_year == nowYear ) {
        update = "Вчера в "+updated_hour+":"+updated_min;
    } else if (((updated_day < nowDay && updated_day + 2 == nowDay) || updated_day == nowDay + 5) && updated_date < nowDate && updated_month == nowMonth && updated_year == nowYear ) {
        update = "Позавчера в "+updated_hour+":"+updated_min;;
    }
    const image = product.has_media 
        ? product.media[0].original_url 
        : '';
    return (
        <a onClick={() => navigateToProductDetailsPage(product)}>
            <div className="shadow-lg rounded ml-3" style={{ ...baseStyle }}>
                <div style={{ height: 250 }}>
                    <AppImage height={250} width="100%" src={image} classNameName="card-img-top rounded" style={{objectFit: "cover"}} />
                    {product.is_vip ? 
                        <div style={{ position: "absolute", left: "30px", top: "10px",  }}><span className="badge badge-danger p-2">VIP</span></div> 
                        : <></>}
                </div>
                <div class="card-body">
                    <label style={{fontSize:20}} class="card-title">{product.price +" "+ product.currency_symbol}</label>
                    <p class="card-text" style={{
                                        lineHeight:"30px",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden"}}>{product.description}</p>
                    {/* <label className="text-muted" style={{fontSize:15}}>
                        Опубликовано: {allDate}
                    </label> */}
                    <label className="text-muted" style={{fontSize:12}}>
                    <i class="far fa-clock"></i> {update}
                    </label>
                </div>
            </div>
        </a>
    );
};

export default ProductItem;