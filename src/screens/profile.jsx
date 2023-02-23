import React from "react";
import { Link } from 'react-router-dom';
import Navbar from "../components/navbar";
import { userDetails } from "../api/user";
import { useEffect, useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import { Avatar, notification } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { setProducts } from "../redux/actions/product_actions";
import * as api from "../api";
import ProductItem from "../components/product/user_product_item";
import { Tabs } from 'antd';
import { subscriptions } from "../api/product";
import { setProductPlans } from "../redux/actions/productPlans_actions";
import moment from "moment/moment";
import { cancelBussinessAccount } from "../api/bussiness";
const { TabPane } = Tabs;
const Profile = () => {
    if (!localStorage.getItem('token')) {
        window.location.href = '/';
    }

    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    // const { products } = useSelector((state) => state.product);
    const [products, setProducts] = useState([]);
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

    const userProducts = async () => {
        let data = await api.fetchUserProducts({'with': 'user'});

        if (data != null) {
            setProducts(data);
            // console.log('active', _products)
            setOffset(offset + limit);
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

    document.title = "Личный кабинет";

    useEffect(() => {
        fetchUserDetails();
        userProducts();
        fetchPlans();
    }, []);

    return (
        user === null || user === undefined || user === ""
            ? <div className="col-md-12 mt-3">
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
                <Navbar />
                <div className="col-xl-12 mt-3">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a style={{ color: "rgb(9, 72, 130)" }} href="/"><i className="fa-solid fa-house"></i> Главная страница</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Мои объявления</li>
                        </ol>
                    </nav>
                    <div className="row px-3 mb-5">
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
                            <Tabs className="border rounded px-2 pb-3 py-1" defaultActiveKey="1">
                                <TabPane tab="Активные" key="2">
                                    <div className="row">
                                        {products?.length > 0 ?
                                            <>
                                                {products.map((product) => {
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
                                        {products?.length > 0 ?
                                            <>
                                                {products.map((product) => {
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
                                        {products?.length > 0 ?
                                            <>
                                                {products.map((product) => {
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
    );
}
export default Profile;