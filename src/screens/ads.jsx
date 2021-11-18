import React, { useEffect } from "react";
import Ad from "./ad";
import Navbar from "../components/navbar";
import SearchBar from "../components/search-bar";
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "../redux/actions/product_actions";
import { Link } from "react-router-dom";
import * as api from "../api";

const Ads = () => {
    const dispatch = useDispatch();
    const {products} = useSelector((state) => state.product);

    const fetchProducts = async () => {
        const products = await api.fetchProducts();
        if (products != null) {
            dispatch(setProducts(products));
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return ( 
        <div>
            <Navbar/>
            <SearchBar/>
            <div className="col-md-12">
                <div className="row">
                    {products.map((product) => {
                        return (
                            <div className="col-md-4 mt-2 mb-2">
                                <div class="card">
                                    <img src={product.media[0].original_url} class="card-img-top" alt="..."/>
                                    <div class="card-body">
                                        <h5 class="card-title">{product.title}</h5>
                                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                        <Link to={`/products/${product.id}`} class="badge badge-primary px-2 py-2">Подробнее</Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>               
        </div>
    );
}

export default Ads;