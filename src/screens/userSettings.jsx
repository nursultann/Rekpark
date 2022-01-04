import React from 'react';
import {useState} from 'react';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
const Settings = () =>{
    const [userName, setUsername] = useState();
    const [phoneNumber, setPhonenumber] = useState();
    const [password, setPassword] = useState();

    return(
        <div>
            <Navbar/>
            <div className='col-md-12 my-5'>
                <div className='row'>
                    <div className='col-md-4'></div>
                    <div className='col-md-4'>
                    <h4>Настройки пользователя</h4>
                        <label>Имя пользователя</label>
                        <input type="text" className='form-control'  />
                        <label>Номер телефона:</label>
                        <input type="text" className='form-control' />
                    </div>
                    <div className='col-md-4'></div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Settings;
