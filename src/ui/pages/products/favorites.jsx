import React from "react";
import Navbar from "../../components/navbar";
import { userDetails } from "../../../api";
import * as api from "../../../api";
import { useEffect, useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/actions/user_actions";
import { setProducts } from "../../../redux/actions/product_actions";
import ProductItem1 from "../../components/product/fav_product_item";
import { Tabs } from 'antd';

const key = 'updatable';
const { TabPane } = Tabs;

const ProductFavoritesPage = () => {
    console.log(localStorage.getItem('token'));
    if (!localStorage.getItem('token')) {
        window.location.href = '/login';
    }

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [products, setProduct] = useState();
    const limit = 20;
    const [offset, setOffset] = useState(0);

    const fetchUserDetails = async () => {
        const user = await userDetails();
        if (user != null) {
            dispatch(setUser(user));
        }
    };
    const UserProducts = async () => {
        let _products = await api.fetchUserFavorites({ 'sub': true });
        if (_products != null) {
            dispatch(setProducts(_products));
            setProduct(_products);
            setOffset(offset + limit);
        }
    };

    document.title = "Избранные";

    useEffect(() => {
        fetchUserDetails();
        UserProducts();
    }, []);

    return (
        <>
            {products?.length > 0 ?
                <div className="row px-3">
                    {products.map((product) => {
                        return (
                            <>
                                <div className="col-xs-12 px-2 col-sm-6 col-xl-3 mt-4 mt-xl-2">
                                    <ProductItem1 product={product} />
                                </div>
                            </>
                        );
                    })}
                </div>
                :
                <>
                    {products?.length > 0 ?
                        <div className="col-xl-12 text-center py-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                        :
                        <div className="col-xl-12 text-center py-5">
                            <label>Нет объявлений в избранном</label>
                        </div>
                    }
                </>
            }
            {products?.length > 0 ?
                <div className="row px-3">
                    {products.map((product) => {
                        return (
                            <>
                                <div className="col-xs-12 px-2 col-sm-6 col-xl-3 mt-4 mt-xl-2">
                                    <ProductItem1 product={product} />
                                </div>
                            </>
                        );
                    })}
                </div>
                :
                <>
                    {products?.length > 0 ?
                        <div className="col-xl-12 text-center py-5">
                            <div className="spinner-border text-success" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                        :
                        <div className="col-xl-12 text-center py-5">
                            <label>Нет объявлений в избранном</label>
                        </div>
                    }
                </>
            }
        </>
    );
}

export default ProductFavoritesPage;