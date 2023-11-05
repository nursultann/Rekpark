import React from "react";
import moment from 'moment';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notification, message } from "antd";

import { removeFromFavorites } from "../../../api/product";
import { setProductDetails } from "../../../redux/actions/product_actions";
import { AppImage } from "../custom_components";
import '../../../dist/css/custom_card.css';

const key = "updateable";

const ProductItem1 = ({ product }) => {
    const dispatch = useDispatch();
    const history = useNavigate();

    const navigateToProductDetailsPage = (product) => {
        dispatch(setProductDetails(product));
        history(`products/${product.id}`);
    };

    const baseStyle = { height: 'auto' };
    if (typeof product.features === 'object' && !Array.isArray(product.features)) {
        if (product.features.color !== null) {
            baseStyle.background = product.features.color;
        }
    }

    if (product.is_vip) {
        baseStyle.border = "2px solid #ffc107";
    } else if (product.is_urgent) {
        baseStyle.border = "2px solid #dc3545";
    } else {
        baseStyle.border = "1px solid #dee2e6";
    }

    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };

    const removeFav = async () => {
        const addToFav = await removeFromFavorites(product.id);
        message.error({ content: 'Удалено из избранного!', key, duration: 2 });
        window.location.href = "/profile";
    }

    var time = moment(product.created_at, 'YYYYMMDD, H:mm:ss', 'Asia/Bishkek');
    moment.locale('ru');

    var update = time.fromNow();
    const image = product.media.length > 0
        ? product.media[0].original_url
        : '';

    return (
        <div className="col-md-12 px-1 bg-white" style={{ ...baseStyle, borderRadius: "10px" }}>
            <div className="row">
                <div className="col-md-12 px-3 pt-1" style={{ height: 150 }}>
                    <AppImage height={150} width="100%" src={image} classNameName="card-img-top rounded" style={{ objectFit: "cover" }} />
                    {product.is_vip && product.is_urgent ?
                        <>
                            <div style={{ position: "absolute", left: "10px", top: "-2px", }}><span className="badge badge-warning text-white p-1"><i className="fa-solid fa-crown"></i> VIP</span></div>
                            <div style={{ position: "absolute", left: "55px", top: "-2px", }}><span className="badge badge-danger p-1"><i className="fa-solid fa-bolt"></i> Срочно</span></div>
                        </>
                        : <></>}
                    {product.is_urgent && product.is_vip == false ?
                        <div style={{ position: "absolute", left: "10px", top: "-2px", }}><span className="badge badge-danger p-1"><i className="fa-solid fa-bolt"></i> Срочно</span></div>
                        : <></>}
                    {product.is_vip && product.is_urgent == false ?
                        <div style={{ position: "absolute", left: "10px", top: "-2px", }}><span className="badge badge-warning text-white p-1"><i className="fa-solid fa-crown"></i> VIP</span></div>
                        : <></>}
                    <i className="fa-solid fa-star text-warning"
                        style={{ position: "absolute", left: "160px", top: "130px", }}></i>
                </div>
            </div>
            <div className="card-body">
                <div className="row">
                    <p style={{
                        fontSize: 14,
                        display: "-webkit-box",
                        fontSize: 13,
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        color: "rgb(9, 72, 130)"
                    }}
                        className="card-title px-0 py-0 col-md-12">
                        {product.title}
                    </p>
                    <label style={{ fontSize: 15 }} className="card-title px-0 col-md-12 py-0 label">{product.price + " " + product.currency_symbol}</label>
                </div>
                <div className="row">
                    <label className="text-muted label" style={{ fontSize: 11 }}>
                        <i className="far fa-clock"></i> {update}<br />
                        <i className="far fa-eye"></i>  {product.views}
                    </label>
                </div>
            </div>
        </div>
    );
};
export default ProductItem1;