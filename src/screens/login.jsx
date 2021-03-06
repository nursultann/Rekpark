import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { login, loginGoogle } from "../api/user";
import { message } from 'antd';
import { Form, Input, Button, Checkbox, Select } from 'antd';
import GoogleLogin from "react-google-login";
import { gapi } from 'gapi-script';
const { Option } = Select;
const key = 'updatable';
const clientId = "363682799555-97hlkli04bo0eevlu0br81jtl3vg677a.apps.googleusercontent.com";
const Sign = () => {
    const [phoneNumber, setLogin] = useState(0);
    const [password, setPassword] = useState();
    const [countrycode, setCountryCode] = useState();
    
    const responseGoogle = (response) => {
        console.log("google response", response);
        const email = response.profileObj.email;
        const name = response.profileObj.name;
        const uid = response.profileObj.googleId;
        console.log(email, name, uid)
        loginGoogle(email, name, uid, (data) => {
            console.log('Success',data);
        }, (data) => {
            console.log('error', data);
        });
    
        const onLoginError = (data) => {
            
            // message.error({content:'Номер или пароль указан неверно!', duration: 2});
        };
    
    }
    const onFailure = (response) =>{
        console.log("Failure!", response);
    }
    const signIn = async () => {
        if (password === "" || phoneNumber.length < 9) return;
        // console.log('phone', countrycode + phoneNumber);
        login(countrycode + phoneNumber, password, onLoginSuccess, onLoginError);
    }

    const onLoginSuccess = (data) => {
        localStorage.setItem('token', data.api_token);
        message.loading({ content: 'Загрузка...', key });
        setTimeout(() => {
            message.success({ content: 'Успешно!', key, duration: 2 });
        }, 1000);
        window.location.href = "/profile";
    };

    const onLoginError = (data) => {
        console.log('error', data);
        message.error({content:'Номер или пароль указан неверно!', duration: 2});
    };

    function onChange(value) {
        // console.log(`selected ${value}`);
        setCountryCode(value);
    }
    document.title="Вход";
    useEffect(()=>{
        function start(){
            gapi.client.init({
                clientId:clientId,
                scope:""
            })
        };
        gapi.load('client:auth2',start);
    });
    return (
        <div>
            <Navbar />
            <div className="col-xl-12 d-flex justify-content-center">
                <div className="col-xl-5 py-4 shadow my-3 bg-white text-center">
                    <label className="py-2" style={{ fontSize: 20 }}>Вход</label>
                    <br />
                    <Form
                        name="basic"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 18 }}
                        initialValues={{ remember: true }}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Телефон"
                            name="phone"
                            rules={[{ required: true, message: 'Пожалуйста введите номер телефона!' }]}
                        >
                            <Input addonBefore={<Select
                                placeholder="код страны"
                                showSearch
                                optionFilterProp="children"
                                onChange={onChange}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                <Option value="996">+996</Option>
                                <Option value="7">+7</Option>
                            </Select>} onChange={(e) => { setLogin(e.target.value) }} type="number" placeholder="Номер телефона" />
                        </Form.Item>
                        <Form.Item
                            label="Пароль"
                            name="password"
                            rules={[{ required: true, message: 'Пожалуйста введите пароль!' }]}
                        >
                            <Input.Password onChange={(e) => { setPassword(e.target.value) }} placeholder="Пароль" />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 0 }}>
                            <button className="col-md-10 ml-0 ml-xl-3 btn btn-primary" style={{ backgroundColor: "#184d9f", color: "#fff" }} htmlType="submit" onClick={signIn}>
                                Войти
                            </button>
                        </Form.Item>
                        <label className="text-muted">Вход с помощью</label>
                        <Form.Item className="d-xl-flex justify-content-center">
                        <GoogleLogin
                            clientId={clientId}
                            buttonText="Войти через Google"
                            onSuccess={responseGoogle}
                            onFailure={onFailure}
                            cookiePolicy={'single_host_origin'}
                            isSignedIn={true}
                        />
                        </Form.Item>
                    </Form>
                    <label>Вы не зарегистрированы?</label>
                    <a style={{ color: "#184d9f" }} className="ml-2" href="/register">Зарегистроваться</a><br />
                    <a style={{ color: "#184d9f" }} className="ml-2" href="/forgot_password">Забыли пароль</a>
                </div>
            </div>
        </div>
    );
}
export default Sign;