import React from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import '../../dist/css/custom_card.css';
import { setProductDetails } from "../../redux/actions/product_actions";
import { AppImage } from "../custom_components";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import calendar from '../../img/calendar.png';
import views from '../../img/views.png';

const ProductItem = ({ product }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const navigateToProductDetailsPage = (product) => {
        dispatch(setProductDetails(product));
        history.push(`/products/${product.id}`);
        // window.location.href = `/products/${product.id}`;
    };
    const baseStyle = { height: 'auto' };
    if (typeof product.features === 'object' && !Array.isArray(product.features)) {
        if (product.features.color !== null) {
            baseStyle.background = product.features.color;
        }
    }
    var time = moment(product.created_at, 'YYYYMMDD, H:mm:ss').tz('Asia/Bishkek');
    moment.locale('ru');
    // console.log(moment("2022-05-15T12:54:46.000000Z").tz('Asia/Bishkek'));
    var update = time.calendar();
    const image = product.has_media
        ? product.media[0].original_url
        : '';
    console.log(product.is_vip);
    return (
        <a onClick={() => navigateToProductDetailsPage(product)}>
            <div className="col-md-12 shadow-sm" style={{ ...baseStyle }}>
                <div className="row">
                    <div className="col-md-12 px-0" style={{ height: 150 }}>
                        <AppImage height={150} width="100%" src={image} classNameName="card-img-top rounded" style={{ objectFit: "cover" }} />
                        {product.is_vip ?
                            <div style={{ position: "absolute", left: "10px", top: "10px", }}><span className="badge badge-danger p-2">VIP</span></div>
                            : <></>}
                        {product.is_urgent ?
                            <div style={{ position: "absolute", left: "45px", top: "10px", }}><span className="badge badge-warning p-2">Срочно</span></div>
                            : <></>}
                    </div>
                </div>
                <div class="card-body px-2 px-md-3">
                    <div className="row">
                        <label style={{ fontSize: 17 }} class="card-title px-0 col-md-12 py-0 label">{product.price + " " + product.currency_symbol}</label>
                        <label style={{
                            fontSize: 14, fontFamily: "sans-serif", whiteSpace: "nowrap", overflow: "hidden",
                            columnWidth: "10px"
                        }} class="card-title label1 text-secondary px-0 py-0 col-md-12">{product.title}</label>
                        {/* <p class="card-text" style={{
                                        display: "-webkit-box",
                                        webkitLineClamp: "1",
                                        webkitBoxOrient: "vertical",
                                        overflow: "hidden"}}>{product.description}</p> */}
                        {/* <label className="text-muted" style={{fontSize:15}}>
                        Опубликовано: {allDate}
                    </label> */}
                    </div>
                    <div className="row">
                        <div className="col-3 mt-5 px-0">
                            {product.user?.media?.length ?
                                <>
                                    {product.user.business_account != null ?
                                        <>
                                            <div className='rounded-circle p-0'
                                                style={{
                                                    backgroundImage: 'url(' + product.user.business_account.logoImage + ')',
                                                    width: "30px",
                                                    height: "30px",
                                                    backgroundSize: "cover"
                                                }}>
                                                <span className='badge badge-danger mt-4 ml-3' style={{fontSize:10}}>pro</span>
                                            </div>
                                        </>
                                        :
                                        <img className="mb-3" src={product.user.media[0].original_url} style={{ borderRadius: "50%", width: "30px", height: "30px" }} />
                                    }
                                </>
                                :
                                <Avatar size={42} icon={<UserOutlined />} />
                            }
                        </div>
                        <div className="col-9 mt-5 px-0 text-right" style={{fontSize:11}}>
                            <i class="fa-solid fa-calendar-days text-info"></i> {update}<br />
                            {/* <img src={views} width="18" height="18" /> {product.views}<br/> */}
                            <label className="text-dark label" style={{ fontSize: 11 }}>
                                {/* <i class="far fa-clock text-info"></i> {update}<br /> */}
                                <i class="far fa-eye text-info"></i>  {product.views}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
};
export default ProductItem;