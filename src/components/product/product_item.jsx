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
    
    var nowDay = new Date().getDay();
    var Fulldate = new Date(product.created_at);
    var date = Fulldate.getDate();
    var month = Fulldate.getDate();
    var year = Fulldate.getFullYear();
    var day = Fulldate.getDay();
    var allDate = date+'/'+month+'/'+year;
    if(day < nowDay && day + 1 == nowDay || day == nowDay + 6) {
        allDate = "Вчера";
    } else if (day < nowDay && day + 2 == nowDay || day == nowDay + 5) {
        allDate = "Позавчера";
    }
    var Update = new Date(product.updated_at);
    var updated_day = Update.getDay();
    var updated_date = Update.getDate();
    var updated_month = Update.getMonth();
    var updated_year = Update.getFullYear();
    var update = updated_date + '/' + updated_month + '/' + updated_year;
    if(updated_day == nowDay) {
        update = "Сегодня";
    } else if (updated_day < nowDay && updated_day + 1 == nowDay || updated_day == nowDay + 6) {
        update = "Вчера";
    } else if (updated_day < nowDay && updated_day + 2 == nowDay || updated_day == nowDay + 5) {
        update = "Позавчера";
    }
    const image = product.has_media 
        ? product.media[0].original_url 
        : '';
    return (
        <a onClick={() => navigateToProductDetailsPage(product)}>
            <div className="shadow-sm bg-white rounded ml-3" style={{ ...baseStyle }}>
                <div style={{ height: 250 }}>
                    <AppImage height={250} width="100%" src={image} classNameName="card-img-top rounded" style={{objectFit: "cover"}} />
                    {product.is_vip ? 
                        <div style={{ position: "absolute", left: "30px", top: "10px",  }}><span className="badge badge-danger p-2">VIP</span></div> 
                        : <></>}
                </div>
                <div class="card-body">
                    <h5 class="card-title">{product.title}</h5>
                    <p class="card-text" style={{
                                        lineHeight:"30px",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden"}}
                    >{product.description}</p>
                    <label className="text-muted" style={{fontSize:12}}>
                        Опубликовано: {allDate}
                    </label>
                    <label className="text-muted" style={{fontSize:12}}>
                        Обновлено: {update}
                    </label>
                </div>
            </div>
        </a>
    );
};

export default ProductItem;