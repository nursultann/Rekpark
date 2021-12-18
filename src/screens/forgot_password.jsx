import React from 'react';
import {useState,useEffect} from 'react';
import { checkPhone, register} from "../api/user";
import {firebase, auth} from "../config/firebase_config";
import * as firebaseui from "firebaseui";
import ApiClient from "../api/ApiClient";
import { Steps, Button, message } from 'antd';
import Navbar from '../components/navbar';
const { Step } = Steps;

const ForgotPassword = ()=>{
const [phoneNumber,setPhoneNumber] = useState();
const [countryСode,setCountryCode] = useState();
const [current, setCurrent] = useState(0);
const [final, setFinal] = useState('');
const [otp, setOtp] = useState('');
const [timer,setTimer] = useState(59);
const [password,setPassword] = useState();
const [passwordCheck,checkPassword] = useState();
const getAccessCode = async ()=>{
    const check = await checkPhone(countryСode+phoneNumber);
        if(check==false){
            alert("Такого пользователя не удалось найти");
        }else if(check==true){
            if (phoneNumber === "" || phoneNumber.length < 9) return;
            auth.signInWithPhoneNumber(`+${countryСode+phoneNumber}`, window.verify).then((result) => {
                setFinal(result);
                alert("Код потверждения отправлен");
                setCurrent(current+1);
                var t = 59;
                function i(){
                    t-=1;
                    setTimer(t);
                }
                function time(){
                    if(t>0){
                   var time = setInterval(i,1000);
                    }else if(t<=0){
                       clearInterval(time);
                       alert("Время вышло!");
                       window.location.reload(); 
                    }
                   }
                   time();
                   setTimeout(time,60000);

        }).catch((err) => {
            alert(err);
            window.location.reload()
        });
    }
}
const validateOtp = () => {
    if (otp === null || final === null)
        return;
    final.confirm(otp).then((result) => {
        alert("Код потверждения выслан");
        // setUuid(result.user.uuid);
        setCurrent(current+1);
        // result.user.uuid;
        
        console.log('success ', result);
        
    }).catch((err) => {
        alert("Код потверждения введен неверно!");
    })
}
const saveChanges = ()=>{
    if(password == passwordCheck){
        const params = {
            'password': password,
            
        };
    }
}
const step1 = (
    <div className="form-group col-md-6 border py-5 px-5 bg-white shadow-sm">
                    <h4 className="text-center">Потверждение номера</h4>
                    <div className="row px-3 mt-4">    
                        <select className="form-control col-md-3" onChange={(e)=>{setCountryCode(e.target.value)}}>
                            <option selected disabled>код страны</option>
                            <option value="996">+996</option>
                            <option value="7">+7</option>
                        </select>        
                        <input type="number" className="form-control col-12 col-md-8 mt-3 mt-md-0 ml-md-3" placeholder="без код страны и 0, без +код страны" value={phoneNumber} onChange={(e) => { 
                        setPhoneNumber(e.target.value) }}
                            placeholder="Телефон" />
                    </div>
                        <div className="row py-4 px-3">        
                            <button className="col-md-12 btn btn-outline-primary mt-3" onClick={getAccessCode}>Потдвердить номер</button>  
                        </div>
                    </div>
);
const step2=(
                <div className="form-group col-md-6">
                <input className="form-control" type="text" placeholder={"Код потверждения"}
                    onChange={(e) => { setOtp(e.target.value) }}></input>
                <br /><br />
                <div className="text-secondary">{":"+timer}</div>
                <button className="form-control" onClick={validateOtp}>Подтвердить</button>
                </div>);
const step3 = (
                <div className="form-group col-md-6">
                <input className="form-control mt-3" placeholder="пароль" value={password}
                onChange={(e) =>{setPassword(e.target.value)}}
                />
                
                <input className="form-control mt-3" placeholder=" повторить пароль" value={passwordCheck}
                onChange={(e) =>{checkPassword(e.target.value)}}
                />
                <button className="btn btn-outline-primary mt-3" onClick={saveChanges}>Сохранить новый пароль</button>
            </div>
);                
const steps = [
    {
      title: 'Шаг 1',
      content: step1,
    },
    {
      title: 'Шаг 2',
      content: step2,
    },
    {
      title: 'Шаг 3',
      content: step3,
    },
  ];

    return(
        <div>
            <Navbar/>
            <div className="col-md-12" style={{height:"auto"}}>
            <div className="col-md-12 d-flex justify-content-center mt-0 mt-md-3">
                <div className="col-md-6 bg-white md-rounded-pill py-2 py-3">
                <Steps current={current}>
                    {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                </div>
            </div>
            <div className="steps-content col-md-12 d-flex justify-content-center rounded mt-3 mt-md-3">
                {steps[current].content}
            </div>   
            </div>
        </div>
    );
}
export default ForgotPassword;