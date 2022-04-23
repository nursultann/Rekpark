import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import '../../dist/css/custom_card.css';
import { setProductDetails } from "../../redux/actions/product_actions";
import { AppImage } from "../custom_components";
import {Button,notification,Avatar} from "antd";
import { deleteAd } from "../../api/user";
import moment from 'moment';
import { UserOutlined } from '@ant-design/icons';
import { activate, deactivate} from "../../api/product";
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
            baseStyle.backgroundColor = product.features.color;
        }
    }
    const openNotification = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
        });
    };
    const removeAd = async () => {
        deleteAd(product.id);
        openNotification('success', 'Успешно удалено!', null);
        function reload(){
            window.location.href = "/profile";
        }
        setTimeout(reload,1000);
    }
    const deactivateAd = async () =>{
        deactivate(product.id);
        openNotification('success', 'Успешно деактивировано!', null);
        function reload(){
            window.location.href = "/profile";
        }
        setTimeout(reload,1000);
    }
    const activateAd = async () =>{
        activate(product.id);
        openNotification('success', 'Успешно активировано!', null);
        function reload(){
            window.location.href = "/profile";
        }
        setTimeout(reload,1000);
    }
    var time = moment(product.created_at, 'YYYYMMDD, h:mm:ss a');
    moment.locale('ru');
    var update = time.calendar();
    const image = product.has_media
        ? product.media[0].original_url
        : '';
    return (
        <>
            <div className="col-xl-12 border rounded shadow-sm" style={{ ...baseStyle }}>
                <div className="row">
                    <div className="col-xl-6">
                        <div className="row">    
                        <div className="col-md-12 px-1 py-1" style={{ height: 150 }}>
                            <AppImage height={150} width="100%" src={image} classNameName="card-img-top rounded" style={{objectFit: "cover"}} />
                            {product.is_vip ? 
                                <div style={{ position: "absolute", left: "30px", top: "10px",  }}><span className="badge badge-danger p-2">VIP</span></div> 
                                : <></>}
                        </div>
                        </div>
                        <div class="card-body">
                            <div className="row px-1">    
                            <label style={{fontSize:17}} class="card-title px-0 col-md-12 py-0 label">{product.price +" "+ product.currency_symbol}</label>
                            <span style={{fontSize:13,fontFamily:"sans-serif",whiteSpace:"nowrap",overflow: "hidden", 
                            columnWidth: "200px"}} class="card-title label px-0 text-primary py-0">{product.title}</span>
                            {/* <p class="card-text" style={{
                                                display: "-webkit-box",
                                                webkitLineClamp: "1",
                                                webkitBoxOrient: "vertical",
                                                overflow: "hidden"}}>{product.description}</p> */}
                            {/* <label className="text-muted" style={{fontSize:15}}>
                                Опубликовано: {allDate}
                            </label> */}
                            </div>
                            <div className="row px-0 d-flex justify-content-between">
                            <Avatar size="small" icon={<UserOutlined />} />
                            <label className="text-muted label" style={{fontSize:11}}>
                            <i class="far fa-clock"></i> {update}<br/>
                            <i class="far fa-eye"></i>  {product.views}
                            </label>
                            </div>
                        </div>
                    </div>
                    <div className="col-xl-6 py-2 bg-light">
                        <a style={{fontSize:14}} className="ml-1 mt-4" href={"/products/"+product.id+"/edit"}><i class="far fa-edit text-muted"></i> Редактировать</a><br/>
                        <a style={{fontSize:14}} className="ml-1 mt-4" onClick={removeAd}><i class="fas fa-trash-alt text-muted"></i> Удалить</a><br/>
                        {product.status == "active" ?
                        <>
                        <a style={{fontSize:14}} className="ml-1 mt-4" onClick={deactivateAd}><i class="fas fa-ban text-muted"></i> Деактивировать</a><br/>
                        </>
                        :<></>
                        }
                        {product.status == "inactive" ?
                        <>
                        <a style={{fontSize:14}} className="ml-1 mt-4" onClick={activateAd}><i class="fas fa-plus-circle text-muted"></i> Активировать</a>
                        </>
                        :<></>
                        }
                    </div>
                </div>
            </div>
        </>        
    );
};

export default ProductItem;