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
import ProductItem from "../components/product/fav_product_item";
import { Tabs } from 'antd';
const key = 'updatable';
const { TabPane } = Tabs;
const Favorites = () => {
    console.log(localStorage.getItem('token'));
    if (!localStorage.getItem('token')) {
        window.location.href = '/';
    }
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const [products,setProduct] = useState();
    const limit = 20;
    const [offset, setOffset] = useState(0);
    const fetchUserDetails = async () => { 
        const user = await userDetails(); 
        if(user != null){
            dispatch(setUser(user));
        }
    };
    const UserProducts = async () =>{
        let _products = await api.fetchUserFavorites({'sub': true});
        if(_products!=null){
            dispatch(setProducts(_products));
            setProduct(_products);
            setOffset(offset + limit);
        }
    };
    document.title="Избранные";
    useEffect(() => {
        fetchUserDetails();
        UserProducts();
    }, []);
    return(
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
            <Navbar/>
            <div className="col-xl-12 mt-3">
            <div className="row px-3 mb-5">
                <div className="col-xl-4 bg-light rounded py-3">
                      <div className="col-xl-12 alert alert-success">
                            <div className="row">
                                <div className="col-12">
                                {user.media?.length ?
                                        <Avatar size={64} icon={<img src={user.media[0].original_url} />} />
                                        :
                                        <Avatar size={42} icon={<UserOutlined />} />
                                    }
                                    <label className="ml-3">{user.name}</label>
                                </div>
                            </div> 
                      </div>
                      <hr/>
                      <div class="row">
                      <div className="col-xl-12">
                            <ul class="list-group">
                                <li class="list-group-item">+{user.phone}</li>
                                <li class="list-group-item"><Link to="/wallets">Пополнить</Link>: {user.balance} сом</li>
                                <li class="list-group-item"><Link to="/profile">Мои объявления</Link></li>
                                <li class="list-group-item"><Link to="/favorites">Избранные</Link></li>
                                <li class="list-group-item"><Link to="/settings">Настройки</Link></li>
                            </ul>
                      </div>
                      </div>
                </div>
                <div className="col-xl-8 pb-4">
                        <Tabs className="border rounded px-2 pb-3 py-1" defaultActiveKey="1">
                            <TabPane tab="Избранное" key="1">
                            <div className="row px-1">
                                {
                                <>
                                {products?.length>0 ?
                                <>
                                {products.map((product)=>{
                                    return(
                                        <>
                                        <div className="col-xs-12 col-sm-6 col-xl-6 mt-4 mt-xl-2">
                                        <ProductItem product={product}/>
                                        </div>
                                        </>
                                    );
                                })}
                                </>
                                :<>
                                {products?.length>0 ?
                                <div className="col-xl-12 text-center py-5">
                                    <div class="spinner-border text-success" role="status">
                                        <span class="sr-only">Loading...</span>
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
                            </TabPane>
                        </Tabs>
                </div>
            </div>
            </div>
            </div>
        );
}
export default Favorites;