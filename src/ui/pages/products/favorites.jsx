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
import { unstable_HistoryRouter } from "react-router-dom";

const key = 'updatable';
const { TabPane } = Tabs;

const ProductFavoritesPage = () => {
    const history = unstable_HistoryRouter();
    console.log(localStorage.getItem('token'));
    if (!localStorage.getItem('token')) {
        history.push('/login');
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
        let _products = await api.fetchUserFavorites({ 'sub': true, 'with': 'user;region;city'});
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
        user === null || user === undefined || user === ""
            ? <div className="col-md-12">
                <Skeleton variant="rectangular" width={'100%'} height={200} />
                <div className="row mt-3">
                    <div className="col-md-4">
                        <Skeleton variant="text" />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton variant="rectangular" width={210} height={118} />
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-12 mb-2">
                                <Skeleton variant="rectangular" width={'100%'} height={50} />
                            </div>
                            <div className="col-md-4">
                                <Skeleton variant="rectangular" width={'100%'} height={100} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </div>
                            <div className="col-md-4">
                                <Skeleton variant="rectangular" width={'100%'} height={100} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </div>
                            <div className="col-md-4">
                                <Skeleton variant="rectangular" width={'100%'} height={100} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            :
            <div>
                <div className="col-xl-12 mt-3">
                    <nav className="col-12 text-center pb-3">
                        <a href="/"> Главная страница</a> | <a className="text-primary" href="/favorites">Избранные</a>
                    </nav>
                    <div className="col-12 px-0 px-xl-5">
                        <div className="col-12 px-0 pb-3 px-xl-5">
                            <div className="d-lg-flex justify-content-around text-center nav-pills rounded-lg py-2" id="v-pills-tab" role="tablist">
                                <a className="nav-link text-primary px-4 border mb-2 rounded-lg" id="v-pills-home-tab" href="/profile" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">Профиль</a>
                                <a className="nav-link text-primary px-4 border mb-2 rounded-lg" id="v-pills-profile-tab" href="/myads" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Мои объявления</a>
                                <a className="nav-link active px-4 border mb-2 rounded-lg" id="v-pills-messages-tab" href="/favorites" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">Избранные</a>
                                <a className="nav-link text-primary px-4 border mb-2 rounded-lg" id="v-pills-settings-tab" href="/chats" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">Сообщения</a>
                                <a className="nav-link text-primary px-4 border mb-2 rounded-lg" id="v-pills-settings-tab" href="/wallets" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">Пополнить баланс</a>
                            </div>
                            <div className="tab-content rounded mt-3" id="v-pills-tabContent">
                                <div className="tab-pane fade show active" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">
                                    {
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
                                                </>}
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default ProductFavoritesPage;