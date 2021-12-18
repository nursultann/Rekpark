import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import {firebase, auth} from "../config/firebase_config";
import * as firebaseui from "firebaseui";
import ApiClient from "../api/ApiClient";
import { checkPhone, register} from "../api/user";
import Footer from "../components/footer";
import { Steps, Button, message,Form, Input,Select } from 'antd';
import { Alert } from 'antd';

// const countryCodes = [
//     {"value": "+996", "label": "+996"},
//     {"value": "+7", "label": "+7"},
// ];
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
    const [visible, setVisible] = useState(false);
    const [visible1,setVisible1] = useState(false);
    const signIn = async ()  => {
        const check = await checkPhone(countrycode+phoneNumber);
        if(check==true){
            setVisible1(true);
        }
        else if (check==false){       
        if (phoneNumber === "" || phoneNumber.length < 9) return;
        auth.signInWithPhoneNumber(`+${countrycode+phoneNumber}`, window.verify).then((result) => {    
            setFinal(result);
            setVisible(true);
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
    };
    const validateOtp = () => {
        if (otp === null || final === null)
            return;
        final.confirm(otp).then((result) => {
            alert("Код потверждения выслан");
            setUuid(result.user.uuid);
            setCurrent(current+1);
            // result.user.uuid;
            
            console.log('success ', result);
            
        }).catch((err) => {
            alert("Код потверждения введен неверно!");
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
                window.location.href = '/profile';
            }, function (data) {
                console.log("Error");
            });
        }else{
            alert("Неправильный пароль");
        }
    }
    const handleClose=()=>{
        setVisible(false);
    }
    
    const handleClose1=()=>{
        setVisible1(false);
    }    
    useEffect(() => {
        window.verify = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        window.verify.render();
    }, []);
    const step1 = (
        <div className="form-group col-md-6 border py-5 px-5 bg-white shadow-sm">
                        <h4 className="text-center">Регистрация профиля</h4>
                        <div className="row px-3 mt-4">    
                            {/* <select className="form-control col-md-3">
                                <option selected disabled>код страны</option>
                                <option value="996">+996</option>
                                <option value="7">+7</option>
                            </select> */}
                            <Select
                                    showSearch
                                    placeholder="код страны"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={(e)=>{setCountryCode(e.target.value)}}
                                >
                                    <Option value="996">+996</Option>
                                    <Option value="7">+7</Option>
                                </Select>        
                                <Form.Item
                                    name="username"
                                    rules={[{ required: true, message: 'Пожалуйста заполни это поле!' }]}
                                >
                                    <Input type="number" value={phoneNumber} onChange={(e) => { 
                            setPhoneNumber(e.target.value)}} />
                                </Form.Item>
                        </div>
                            <div className="row py-4 px-3">
                                <div className="mt-3" id="recaptcha-container"></div>        
                                <button className="col-md-12 btn btn-outline-primary mt-3" onClick={signIn}>Зарегистрироваться</button>  
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
            {visible1 ? (
                        <Alert className="mt-3" showIcon message="Такой номер уже существует!" type="warning" closable afterClose={handleClose1} />
                                    ) : null}    
            {visible ? (
                        <Alert className="mt-3" showIcon message="Код потверждения отправлен!" type="success" closable afterClose={handleClose} />
                                    ) : null}
            <div className="col-md-12 d-flex justify-content-center mt-2 mt-md-3">
                <div className="col-md-6 bg-white md-rounded-pill shadow-sm py-2 py-3">
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
            <Footer/>
        </div>
    );
}

export default Register;