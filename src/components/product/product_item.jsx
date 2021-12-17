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

    const baseStyle = { height: 300 };
    if (typeof product.features === 'object' && !Array.isArray(product.features)) {
        if (product.features.color !== null) {
            baseStyle.background = product.features.color;
        }
    }

    const image = product.has_media 
        ? product.media[0].original_url 
        : '';
    return (
        <a onClick={() => navigateToProductDetailsPage(product)}>
            <div className="shadow-sm rounded" style={{ ...baseStyle }}>
                <div style={{ height: 150 }}>
                    <AppImage height={150} width="100%" src={image} classNameName="card-img-top rounded" style={{objectFit: "cover"}} />
                    {product.is_vip ? 
                        <div style={{ position: "absolute", left: "30px", top: "10px" }}>vip</div> 
                        : <></>}
                </div>
                <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p style={{overflow: "hidden", textOverflow: 'ellipsis', maxHeight: 70}}>
                        {product.description}
                    </p>
                </div>
            </div>
        </a>
    );
};

export default ProductItem;