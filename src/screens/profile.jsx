import React from "react";
import { Link } from 'react-router-dom';
import Navbar from "../components/navbar";
import { deleteChat, getUserChats, postUserMessage, userDetails, userSettings } from "../api/user";
import { useEffect, useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import { Avatar, notification, Input, Upload, message, Button, Image } from 'antd';
import { setProducts } from "../redux/actions/product_actions";
import * as api from "../api";
import ProductItem from "../components/product/user_product_item";
import { Tabs } from 'antd';
import { subscriptions } from "../api/product";
import { setProductPlans } from "../redux/actions/productPlans_actions";
import { cancelBussinessAccount } from "../api/bussiness";
const { TabPane } = Tabs;
const key = 'updatable';
const Profile = () => {
    if (!localStorage.getItem('token')) {
        window.location.href = '/login';
    }
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const { products } = useSelector((state) => state.product);
    const [active, setActive] = useState([]);
    const [inactive, setInactive] = useState([]);
    const [moderation, setModeration] = useState([]);
    const limit = 20;
    const [offset, setOffset] = useState(0);
    const fetchUserDetails = async () => {
        const user = await userDetails();
        if (user != null) {
            dispatch(setUser(user));
        }
    };
    const fetchPlans = async () => {
        const plans = await subscriptions();
        if (plans != null) {
            dispatch(setProductPlans(plans));
        }
    }
    const UserProducts = async () => {
        let _products = await api.fetchUserProducts({ 'sub': true, 'sort': 'active','with': 'user;region;city' });
        let inactive_products = await api.fetchUserProducts({ 'sub': true, 'sort': 'inactive','with': 'user;region;city' });
        let moderation_products = await api.fetchUserProducts({ 'sub': true, 'sort': 'moderation','with': 'user;region;city' });
        let disabled_products = await api.fetchUserProducts({ 'sub': true,'with': 'user;region;city' });
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
    document.title = "Мои объявления";
    useEffect(() => {
        fetchUserDetails();
        UserProducts();
        fetchPlans();
    }, []);
    return (
        user === null || user === undefined || user === ""
            ? <div className="col-md-12 mt-3">
                
            </div>
            :
            <div>
                <Navbar />
                <div className="col-xl-12 mt-3">
                    <nav className="col-12 text-center pb-3">
                    <a href="/"> Главная страница</a> | <a className="text-primary" href="/myads">Мои объявления</a>
                    </nav>
                    {/* <div className="row px-3 mb-5">
                        <div className="col-xl-4 bg-light rounded py-3">
                            <div className="col-xl-12 text-white alert" style={{ backgroundColor: "rgb(9, 72, 130)" }}>
                                <div className="row">
                                    <div className="col-12">
                                        {user.media?.length ?
                                            <Avatar size={64} icon={<img src={user.media[0].original_url} alt='' />} />
                                            :
                                            <Avatar size={42} icon={<UserOutlined />} />
                                        }
                                        <label className="ml-3">{user.name}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    {user.business_account != null ?
                                        <>
                                            <label className="alert alert-primary col-12">Окончание: {moment(user.business_account.end_at).fromNow()}</label>
                                            <button className="btn btn-primary col-12" style={{ backgroundColor: "rgb(9, 72, 130)" }} onClick={cancelBussiness}><i className="fa-solid fa-ban"></i> Отменить бизнес профиль</button>
                                        </>
                                        :
                                        <>

                                        </>
                                    }
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-xl-12">
                                    <ul className="list-group">
                                        <li className="list-group-item">+{user.phone}</li>
                                        <li className="list-group-item"><Link to="/wallets">Пополнить</Link>: {user.balance} сом</li>
                                        <li className="list-group-item text-white" style={{ backgroundColor: "rgb(9, 72, 130)" }}><Link to="/profile">Мои объявления</Link></li>
                                        <li className="list-group-item"><Link to="/favorites">Избранные</Link></li>
                                        <li className="list-group-item"><Link to="/chats">Сообщения</Link></li>
                                        {user.business_account == null ?
                                            <>
                                                <li className="list-group-item"><Link to="/business">Бизнес профиль</Link></li>
                                                <li className="list-group-item"><Link to="/settings">Настройки пользователя</Link></li>
                                            </>
                                            :
                                            <>
                                                <li className="list-group-item"><Link to="/business-settings">Настройки бизнес профиля</Link></li>
                                                <li className="list-group-item"><Link to="/gallery">Галерея</Link></li>
                                            </>
                                        }
                                    </ul>
                                </div>
                            </div>
                            <hr />
                        </div>
                        <div className="col-xl-8 mt-3 mt-md-0">
                            
                        </div>
                    </div> */}
                    <div className="col-12 px-0 px-xl-5">
                        <div className="col-12 px-0 pb-3 px-xl-5">
                            <div className="d-lg-flex justify-content-around text-center nav-pills rounded-lg py-2" id="v-pills-tab" role="tablist">
                                <a className="nav-link text-primary px-4 border mb-2 rounded-lg" id="v-pills-home-tab" href="/profile" type="button" role="tab" aria-controls="v-pills-home" aria-selected="true">Профиль</a>
                                <a className="nav-link active px-4 border mb-2 rounded-lg" id="v-pills-profile-tab" href="/myads" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Мои объявления</a>
                                <a className="nav-link text-primary px-4 border mb-2 rounded-lg" id="v-pills-messages-tab" href="/favorites" type="button" role="tab" aria-controls="v-pills-messages" aria-selected="false">Избранные</a>
                                <a className="nav-link text-primary px-4 border mb-2 rounded-lg" id="v-pills-settings-tab" href="/chats" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">Сообщения</a>
                                <a className="nav-link text-primary px-4 border mb-2 rounded-lg" id="v-pills-settings-tab" href="/wallets" type="button" role="tab" aria-controls="v-pills-settings" aria-selected="false">Пополнить баланс</a>
                            </div>
                            <h4 className="pt-3">Мои Объявления</h4>
                            <div className="tab-content rounded mt-1" id="v-pills-tabContent">
                                <div className="tab-pane fade show active" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}
export default Profile;