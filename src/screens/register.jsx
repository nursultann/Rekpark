import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import {firebase, auth} from "../config/firebase_config";
import * as firebaseui from "firebaseui";
import ApiClient from "../api/ApiClient";
import { checkPhone, register} from "../api/user";
import Footer from "../components/footer";
import { Steps, Button, message,Form, Input,Select} from 'antd';
import { Alert } from 'antd';

// const countryCodes = [
//     {"value": "+996", "label": "+996"},
//     {"value": "+7", "label": "+7"},
// ];
const key = 'updatable';
const { Option } = Select;
const { Step } = Steps;
const Register = () => {
    // Inputs
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState('');
    const [final, setFinal] = useState(''); 
    const [userName,setUserName] = useState();
    const [timer,setTimer] = useState(59);
    const [userPassword,setPassword] = useState();
    const [passwordCheck,checkPassword] = useState();
    const [uuid,setUuid] = useState();
    const [countrycode,setCountryCode] = useState();
    const [current, setCurrent] = useState(0);
    const signIn = async ()  => {
        const check = await checkPhone(countrycode+phoneNumber);
        if(check==true){
            message.warning('Такой номер уже существует!', 10);
        }
        else if (check==false){       
        if (phoneNumber === "" || phoneNumber.length < 9) return;
        auth.signInWithPhoneNumber(`+${countrycode+phoneNumber}`, window.verify).then((result) => {    
            setFinal(result);
            message.success('Код потверждения отправлен!', 10);
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
                message.info('Время вышло!', 10);
                window.location.reload(); 
             }
            }
            time();
            setTimeout(time,60000);
        }).catch((err) => {
            message.error('Номер указан неверно!', 10);
                window.location.reload()
            });
    }
    };
    const validateOtp = () => {
        if (otp === null || final === null)
            return;
        final.confirm(otp).then((result) => {
            message.success('Код потверждения выслан', 10);
            setUuid(result.user.uuid);
            setCurrent(current+1);
            // result.user.uuid;
            
            console.log('success ', result);
            
        }).catch((err) => {
            message.error('Код потверждения введен неверно!', 10);
        })
    }
    const addUser = async () =>{
        if(userPassword === passwordCheck){
            const params = {
                'name': userName,
                'password': userPassword,
                'phone':countrycode + phoneNumber,
                'uuid': uuid,
            };
            console.log('params', params);
            const result = await register(params, function (data) {
                localStorage.setItem('token', data.api_token);
                message.loading({ content: 'Загрузка...', key });
                setTimeout(() => {
                    message.success({ content: 'Успешно!', key, duration: 2 });
                }, 1000);
                window.location.href = '/profile';
            }, function (data) {
                console.log("Error");
            });
        }else{
            message.error('Неправильный пароль', 10);
        }
    }
    function onChange(value) {
        console.log(`selected ${value}`);
        setCountryCode(value);
      }   
    useEffect(() => {
        window.verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        window.verify.render();
    }, []);
    const step1 = (
        <div className="form-group col-md-6 border py-5 px-5 bg-white shadow text-center">
                        <label style={{fontSize:20}}>Регистрация профиля</label>
                        <div className="row px-3 mt-4">
                            <div className="col-md-4">    
                                    <Select
                                        placeholder="код страны"
                                        showSearch
                                        optionFilterProp="children"
                                        onChange={onChange}
                                        filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        style={{width:"100%"}}
                                        >
                                        <Option value="996">+996</Option>
                                        <Option value="7">+7</Option>
                                    </Select>
                            </div>
                            <div className="col-md-8">            
                                    <Form.Item
                                        name="username"
                                        rules={[{ required: true, message: 'Пожалуйста заполни это поле!' }]}
                                        style={{width:"100%"}}
                                    >
                                        <Input type="number" placeholder="Без кода страны и +код страны" value={phoneNumber} onChange={(e) => { 
                                setPhoneNumber(e.target.value)}} />
                                    </Form.Item>
                            </div>    
                        </div>
                            <div className="row py-2 px-3">
                                <div className="mt-3" id="recaptcha-container"></div>        
                                <button className="col-md-12 btn btn-outline-primary mt-3" onClick={signIn}>Зарегистрироваться</button>  
                            </div>
                        </div>
    );
    const step2=(
                    <div className="form-group col-md-6 py-5 px-5 shadow">
                        
                    <input className="form-control" type="text" placeholder={"Код потверждения"}
                        onChange={(e) => { setOtp(e.target.value) }}></input>
                    <br /><br />
                    <div className="text-secondary">{":"+timer}</div>
                    <button className="form-control" onClick={validateOtp}>Подтвердить</button>
                    </div>);
    const step3 = (
                    <div className="form-group col-md-6 shadow">
                    <input className="form-control mt-3" placeholder="Имя" value={userName} 
                    onChange={(e) =>{setUserName(e.target.value)}} />
                    <input className="form-control mt-3" placeholder="пароль" value={userPassword}
                    onChange={(e) =>{setPassword(e.target.value)}}
                    />
                    
                    <input className="form-control mt-3" placeholder=" повторить пароль" value={passwordCheck}
                    onChange={(e) =>{checkPassword(e.target.value)}}
                    />
                    <button className="btn btn-outline-primary mt-3" onClick={addUser}>Сохранить изменения</button>
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
            <div className="col-md-12 d-flex justify-content-center mt-2 mt-md-3">
                <div className="col-md-6 bg-white md-rounded-pill shadow py-2 py-3">
                <Steps current={current}>
                    {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                </div>
            </div>
            <div className="steps-content col-md-12 d-flex justify-content-center rounded mt-3 mt-md-3" style={{height:"400px"}}>
                {steps[current].content}
            </div>   
            </div>
            <Footer/>
        </div>
    );
}

export default Register;