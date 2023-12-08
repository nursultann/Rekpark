import React from "react";
import Navbar from "../../components/navbar";
import { userDetails } from "../../../api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../redux/actions/user_actions";
import { notification } from 'antd';
import { setProducts } from "../../../redux/actions/product_actions";
import * as api from "../../../api";
import ProductItem from "../../components/product/user_product_item";
import { Tabs } from 'antd';
import { subscriptions } from "../../../api/product";
import { setProductPlans } from "../../../redux/actions/productPlans_actions";
import { cancelBussinessAccount } from "../../../api/bussiness";
import { useUserStore } from "../../../store/user_store";
import { useEffectOnce } from "react-use";

const { TabPane } = Tabs;
const key = 'updatable';

const ProfilePage = () => {
    if (!localStorage.getItem('token')) {
        window.location.href = '/login';
    }

    const dispatch = useDispatch();
    const auth = useUserStore()

    const user = auth.user;
    const { products } = useSelector((state) => state.product);
    const [active, setActive] = useState([]);
    const [inactive, setInactive] = useState([]);
    const [moderation, setModeration] = useState([]);
    const limit = 20;
    const [offset, setOffset] = useState(0);

    const fetchPlans = async () => {
        const plans = await subscriptions();
        if (plans != null) {
            dispatch(setProductPlans(plans));
        }
    }

    const UserProducts = async () => {
        let _products = await api.fetchUserProducts({ 'sub': true, 'sort': 'active' });
        let inactive_products = await api.fetchUserProducts({ 'sub': true, 'sort': 'inactive' });
        let moderation_products = await api.fetchUserProducts({ 'sub': true, 'sort': 'moderation' });
        let disabled_products = await api.fetchUserProducts({ 'sub': true });
        if (_products != null) {
            setActive(_products);
            console.log('active', _products)
            setOffset(offset + limit);
        }
        if (inactive_products != null) {
            console.log('inactive', inactive_products);
            setInactive(inactive_products);
        }
        if (moderation_products != null) {
            console.log('moderation', moderation_products);
            setModeration(moderation_products);
        }
        if (disabled_products != null) {
            console.log('disabled', disabled_products);
            dispatch(setProducts(disabled_products));
        }
    };

    const cancelBussiness = async () => {
        const cancel = await cancelBussinessAccount();
        console.log(cancel);
        notification['success']({
            message: 'Вы вышли из бизнес профиля!',
        });
        setTimeout(() => {
            window.location.href = `/profile`;
        }, 1200);
    }

    useEffectOnce(() => {
        document.title = "Мои объявления";

        UserProducts();
        fetchPlans();
        auth.fetchUser();
    });

    return (
        <div className="col-12 px-1 py-2">
            <Tabs className="px-2 pb-3 py-1" centered defaultActiveKey="1">
                <TabPane tab="Активные" key="2">
                    <div className="row">
                        {active?.length > 0 ?
                            <>
                                {active.map((product) => {
                                    if (product.status !== 'active') return;
                                    return (
                                        <>
                                            <div className="col-xs-12 col-sm-6 col-xl-6 mt-3">
                                                <ProductItem product={product} />
                                            </div>
                                        </>
                                    );
                                })}
                            </>
                            :
                            <div className="col-xl-12 text-center py-5">
                                <label>Нет объявлений</label>
                            </div>
                        }
                    </div>
                </TabPane>
                <TabPane tab="Неактивные" key="3">
                    <div className="row">
                        {inactive?.length > 0 ?
                            <>
                                {inactive.map((product) => {
                                    if (product.status !== 'inactive') return;
                                    return (
                                        <>
                                            <div className="col-xs-12 col-sm-6 col-xl-6 mt-3">
                                                <ProductItem product={product} />
                                            </div>
                                        </>
                                    );
                                })}
                            </>
                            :
                            <div className="col-xl-12 text-center py-5">
                                <label>Нет объявлений</label>
                            </div>
                        }
                    </div>
                </TabPane>
                <TabPane tab="На модерации" key="4">
                    <div className="row">
                        {moderation?.length > 0 ?
                            <>
                                {moderation.map((product) => {
                                    if (product.status !== 'moderation') return;

                                    return (
                                        <>
                                            <div className="col-xs-12 col-sm-6 col-xl-6 mt-3">
                                                <ProductItem product={product} />
                                            </div>
                                        </>
                                    );
                                })}
                            </>
                            :
                            <div className="col-xl-12 text-center py-5">
                                <label>Нет объявлений</label>
                            </div>
                        }
                    </div>
                </TabPane>
                <TabPane tab="Отключенные" key="5">
                    <div className="row">
                        {products?.length > 0 ?
                            <>
                                {products.map((product) => {
                                    if (product.status !== 'disabled') return;
                                    return (
                                        <>
                                            <div className="col-xs-12 col-sm-6 col-xl-6 mt-3">
                                                <ProductItem product={product} />
                                            </div>
                                        </>
                                    );
                                })}
                            </>
                            :
                            <div className="col-xl-12 text-center py-5">
                                <label>Нет объявлений</label>
                            </div>
                        }
                    </div>
                </TabPane>
            </Tabs>
        </div>
    );
}

export default ProfilePage;