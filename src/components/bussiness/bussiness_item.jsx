import React from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import '../../dist/css/custom_card.css';
import { setProductDetails } from "../../redux/actions/product_actions";

const BussinessItem = ({ product }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const navigateToProductDetailsPage = (product) => {
        dispatch(setProductDetails(product));
        history.push(`/products/${product.id}`);
    };
    var currency = 0;
    if(product.currency_id == 1){
        currency = "$";
    }else if(product.currency_id == 2){
        currency = "руб";
    }else if(product.currency_id == 3){
        currency = "сом";
    }
    var interval = null;
    if(product.interval == "month"){
        interval = "Ежемесячный";
    }
    return (
            <div className="col-6 col-xl-4 mt-3 mt-xl-0">
                <div class="shadow">
                    <div class="card-body">
                        <h5 class="card-title label">{product.name} <small className="text-muted label">{interval}</small></h5>
                        <hr/>
                        <h6 class="card-subtitle mb-2 text-center py-4 label">{product.price} {currency}</h6>
                        <a href="#" class="btn btn-primary rounded-pill col-12 label" onClick={() => navigateToProductDetailsPage(product)}>Купить</a>
                        <hr/>
                        <div className="border p-2 rounded">
                        <span className="label"><strong>Описание</strong></span>
                        <p class="card-text label text-muted">{product.description}</p>
                        <hr/>
                        <p>Максимальное количество подписчиков: {product.active_subscribers_limit}</p>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default BussinessItem;