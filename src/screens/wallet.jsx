import React from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/actions/user_actions";
import { userDetails } from "../api/user";
const Wallet=()=>{
    return(
        <div>
            <Navbar/>
            <div className='col-md-12'>
                <div className="row">
                    <div className='col-md-12 d-flex justify-content-center'>

                    </div>
                </div>
            </div>
        </div>    
    );




}
export default Wallet; 