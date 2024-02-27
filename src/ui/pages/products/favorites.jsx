import React from "react";
import { userDetails } from "../../../api";
import * as api from "../../../api";
import { useState } from "react";
import ProductItem from "../../components/product/product_item";
import { useUserStore } from "../../../store/user_store";
import { useEffectOnce } from "react-use";
import { Helmet } from 'react-helmet';

const ProductFavoritesPage = () => {
    const user = useUserStore().user;

    const [products, setProducts] = useState();
    const limit = 20;
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchUserProducts = async () => {
        if (loading) return;

        setLoading(true);
        let _products = await api.fetchUserFavorites({ 'sub': true });
        if (_products != null) {
            setProducts(_products);
            setOffset(offset + limit);
        }

        setLoading(false);
    };

    useEffectOnce(() => {
        fetchUserProducts();
    });

    return (
        <>
            <Helmet>
                <title>Избранные</title>
            </Helmet>

            {products?.length > 0 ?
                <div className="row px-3">
                    {products.map((product) => {
                        return (
                            <div className="col-xs-12 px-2 col-sm-6 col-xl-3 mt-4 mt-xl-2">
                                <ProductItem product={product} />
                            </div>
                        );
                    })}
                </div>
                :
                <>
                    {products?.length == 0 &&
                        <div className="col-xl-12 text-center py-5 h-[300px] flex flex-col justify-center items-center">
                            <label>Нет объявлений в избранном</label>
                        </div>
                    }
                </>
            }

            {loading && <div className="col-xl-12 text-center py-5">
                <div className="spinner-border text-success" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>}

        </>
    );
}

export default ProductFavoritesPage;