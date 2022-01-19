import React from "react";
import {Link} from 'react-router-dom';
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { userDetails } from "../api/user";
import { useEffect,useState } from "react";
import Skeleton from '@mui/material/Skeleton';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Button } from "@mui/material";
import { setProducts } from "../redux/actions/product_actions";
import * as api from "../api";
import ProductItem from "../components/product/user_product_item";
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const Profile = () => {
    console.log(localStorage.getItem('token'));
    if (!localStorage.getItem('token')) {
        window.location.href = '/';
    }
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const {products} = useSelector((state) => state.product);
    const limit = 20;
    const [offset, setOffset] = useState(0);
    const fetchUserDetails = async () => { 
        const user = await userDetails(); 
        if(user != null){
            dispatch(setUser(user));
        }
    };
    const UserProducts = async () =>{
        let _products = await api.fetchUserProducts({'sub': true});
        if(_products!=null){
            dispatch(setProducts(_products));
            setOffset(offset + limit);
        }
    };
    useEffect(() => {
        fetchUserDetails();
        UserProducts();
    }, []);
    return(
        user === null || user === undefined || user === "" 
            ? <div className="col-md-12">
                    <Skeleton variant=".rectangular" width={'100%'} height={200} />
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
            <Navbar/>
            <div className="col-md-12">
            <div className="row px-3 mb-5">
                <div className="col-md-4 bg-white rounded">
                      <div className="col-md-12 py-2">
                            <div className="row">
                                <div className="col-12">
                                <Avatar size={64} icon={<UserOutlined />}/>
                                    <label className="ml-3">{user.name}</label>
                                </div>
                            </div> 
                      </div>
                      <hr/>
                      <div className="col-md-12">
                          <label>+{user.phone}</label>
                          <br/>
                          <Link to="/wallets">Пополнить</Link>: {user.balance} сом
                          <br/>
                          <Link to="/profile">Мои объявления</Link>
                          <br/>
                          <Link to="/settings">Настройки</Link>
                      </div>
                      <hr/>
                </div>
                <div className="col-md-8 mt-3 mt-md-0">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Все объявления" key="1">
                            <div className="row">
                                {products.map((product)=>{
                                    return(
                                        <>
                                        <div className="col-xs-12 col-sm-6 col-xl-4 mt-3">
                                        <ProductItem product={product}/>
                                        </div>
                                        </>
                                    );
                                })}
                                </div>
                            </TabPane>
                            <TabPane tab="Активные" key="2">
                            <div className="row">
                            {products.map((product)=>{
                                    return(
                                        <>
                                        <div className="col-xs-12 col-sm-6 col-xl-4 mt-3">
                                        <ProductItem product={product}/>
                                        </div>
                                        </>
                                    );
                                })}
                                </div>
                            </TabPane>
                            <TabPane tab="Неактивные" key="3">
                            Content of Tab Pane 3
                            </TabPane>
                        </Tabs>

                </div>
            </div>
            </div>
            <Footer/>
            </div>
        );
}
export default Profile;