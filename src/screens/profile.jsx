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
import ProductItem from "../components/product/product_item"
const Profile = () => {
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
                          <Link to="/wallets">Пополнить</Link>:{user.balance}сом
                      </div>
                      <hr/>
                </div>
                <div className="col-md-8 mt-3 mt-md-0">
                        <nav>
                            <div class="nav nav-tabs" id="nav-tab" role="tablist">
                                <a class="nav-link active" id="nav-home-tab" data-toggle="tab" href="#nav-ad" role="tab" aria-controls="nav-home" aria-selected="true">Мои объявления</a>
                                <a class="nav-link" id="nav-profile-tab" data-toggle="tab" href="#nav-active" role="tab" aria-controls="nav-profile" aria-selected="false">Активные</a>
                                <a class="nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-notactive" role="tab" aria-controls="nav-contact" aria-selected="false">Неактивные</a>
                            </div>
                        </nav>
                        <div class="tab-content" id="nav-tabContent">
                            <div class="tab-pane fade show active" id="nav-ad" role="tabpanel" aria-labelledby="nav-home-tab">
                                <div className="row">
                                {products.map((product)=>{
                                    return(
                                        <>
                                        <div className="col-md-4 mt-3">
                                        <ProductItem product={product}/>
                                        </div>
                                        </>
                                    );
                                })}
                                </div>
                            </div>
                            <div class="tab-pane fade" id="nav-active" role="tabpanel" aria-labelledby="nav-profile-tab">
                            <div className="row">
                                {

                                }
                                    <div className="col-md-4 mt-2 mb-2">
                                        <div class="card">
                                        <img src="https://kartinkin.com/uploads/posts/2021-07/thumbs/1626123851_61-kartinkin-com-p-svetlo-serii-fon-krasivo-63.jpg" class="card-img-top" alt="..."/>
                                        <div class="card-body">
                                            <h5 class="card-title">З</h5>
                                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                            <a href="#" class="btn btn-primary">Редактировать</a>
                                            <a href="#" class="btn btn-primary mt-2">Деактивировать</a>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tab-pane fade" id="nav-notactive" role="tabpanel" aria-labelledby="nav-contact-tab">...</div>
                        </div>
                </div>
            </div>
            </div>
            <Footer/>
            </div>
        );
}
export default Profile;