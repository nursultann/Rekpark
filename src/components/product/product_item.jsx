import React from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import '../../dist/css/custom_card.css';
import { setProductDetails } from "../../redux/actions/product_actions";
import { AppImage } from "../custom_components";
import moment from 'moment';
const ProductItem = ({product}) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const navigateToProductDetailsPage = (product) => {
        dispatch(setProductDetails(product));
        history.push(`/products/${product.id}`);
    };

    const baseStyle = { height: 'auto' };
    if (typeof product.features === 'object' && !Array.isArray(product.features)) {
        if (product.features.color !== null) {
            baseStyle.background = product.features.color;
        }
    }
    var time = moment(product.created_at, 'YYYYMMDD, h:mm:ss a,');
    moment.locale('ru');
    var update = time.calendar();
    const image = product.has_media 
        ? product.media[0].original_url 
        : '';
    return (
        <a onClick={() => navigateToProductDetailsPage(product)}>
            <div className="col-md-12 shadow rounded" style={{ ...baseStyle }}>
                <div className="row">    
                <div className="col-md-12 px-0" style={{ height: 150 }}>
                    <AppImage height={135} width="100%" src={image} classNameName="card-img-top rounded" style={{objectFit: "cover"}} />
                    {product.is_vip ? 
                        <div style={{ position: "absolute", left: "30px", top: "10px",  }}><span className="badge badge-danger p-2">VIP</span></div> 
                        : <></>}
                </div>
                </div>
                <div class="card-body">
                    <label style={{fontSize:13}} class="card-title">{product.title}</label><br/>
                    <label style={{fontSize:13}} class="card-title">{product.price +" "+ product.currency_symbol}</label>
                    <p class="card-text" style={{
                                        display: "-webkit-box",
                                        webkitLineClamp: "1",
                                        webkitBoxOrient: "vertical",
                                        overflow: "hidden"}}>{product.description}</p>
                    {/* <label className="text-muted" style={{fontSize:15}}>
                        Опубликовано: {allDate}
                    </label> */}
                    <label className="text-muted" style={{fontSize:11}}>
                    <i class="far fa-clock"></i> {update}
                    </label>
                </div>
            </div>
        </a>
    );
};

export default ProductItem;