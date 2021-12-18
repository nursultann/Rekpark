import React from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { Card } from 'antd';
import { userDetails } from "../api/user";
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import Skeleton from '@mui/material/Skeleton';
import { Link } from 'react-router-dom';
const { Meta } = Card;
const Wallets=()=>{
    if (!localStorage.getItem('token')) {
        window.location.href = '/';
    }
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
    const fetchUserDetails = async () => { 
        const user = await userDetails(); 
        if(user != null){
            dispatch(setUser(user));
        }
    };
    useEffect(() => {
        fetchUserDetails();
    }, []);
        return(
            user === null || user === undefined || user === "" 
            ?
            <div className="col-md-12">
                    <Skeleton variant="rectangular" width={'100%'} height={200} />
                    <div className="row mt-3">
                        <div className="col-md-12">
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
        <>
                <Navbar/>
            <div class="col-md-12">  
            
            <div class="col-md-12 shadow-sm bg-white py-3">
            <h3>Пополнение баланса</h3>
                <label>+{user.phone+', '+user.name}</label><br/>
                <label>Баланс:{user.balance} сом</label>
            </div> 
                <div className="row">
                    <div className="col-md-4 my-3">
                    <Link to="/wallet">    
                    <Card
                        hoverable
                        style={{ width: "100%" }}
                        cover={<img alt="example" src="https://abalarmes.com.br/site/wp-content/uploads/2019/01/bandeira-visa-e-master-png-6.png" />}
                    >
                        <Meta title="Пополнение банковской картой" description="VISA, MasterCard, Maestro" />
                    </Card>
                    </Link>
                    </div>
                </div>
            </div>
            <Footer/>
        </>  
        );
}
export default Wallets; 