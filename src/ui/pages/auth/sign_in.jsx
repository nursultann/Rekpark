import React, { useEffect, useState } from "react";
import { message } from 'antd';
import { Form, Input, Select } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { login, loginGoogle } from "../../../api/user";
import Navbar from "../../components/navbar";
import { auth, clientId, googleAuthProvider, signInWithGoogleRedirect } from '../../../config/firebase_config';
const { Option } = Select;
const key = 'updatable';

const SignInPage = () => {
    const history = useNavigate();
    const [phoneNumber, setLogin] = useState(0);
    const [password, setPassword] = useState();
    const [countryCode, setCountryCode] = useState();

    const responseGoogle = async (response) => {
        console.log("google response", response);
        const email = response.profileObj.email;
        const name = response.profileObj.name;
        const uid = response.profileObj.googleId;

        // const credential = await auth.signInWithEmailAndPassword(email, uid);

        console.log(clientId, email, name)

        const credential = await auth.signInWithCredential(googleAuthProvider.credential(
            response.tokenId,
            response.accessToken,
        ))

        console.log('credential', credential)

        const idToken = await credential.user.getIdToken(true);
        // credential.user.displayName;
        // credential.user.email;


        console.log('datas', email, name, idToken)
        await loginGoogle(
            email, name, idToken,
            (data) => {
                console.log('Success', data);
            },
            (data) => {
                console.log('error', data);
            },
        );

        const onLoginError = (data) => {
            // message.error({content:'Номер или пароль указан неверно!', duration: 2});
        };

    }

    const onFailure = (response) => {
        console.log("Failure!", response);
    }

    const signIn = async () => {
        if (password === "" || phoneNumber.length < 9) return;
        // console.log('phone', countryCode + phoneNumber);
        await login((countryCode + phoneNumber), password, onLoginSuccess, onLoginError);
    }
    const onLoginSuccess = (data) => {
        localStorage.setItem('token', data.api_token);
        message.loading({ content: 'Загрузка...', key });
        setTimeout(() => {
            message.success({ content: 'Успешно!', key, duration: 2 });
        }, 1000);
        history("/profile");
    };

    const onLoginError = (data) => {
        console.log('error', data);
        message.error({ content: 'Номер или пароль указан неверно!', duration: 2 });
    };

    function onChange(value) {
        // console.log(`selected ${value}`);
        setCountryCode(value);
    }
    const LoginGoogle = ()=>{
        signInWithGoogleRedirect();

    }
    useEffect(() => {
        document.title = "Вход";
        // function start() {
        //     gapi.client.init({
        //         clientId: clientId,
        //         scope: ""
        //     })
        // }
        // gapi.load('client:auth2', start);
        auth.getRedirectResult()
            .then((result) => {
                if (result) {
                    // Successfully signed in
                    console.log('Success:', result);
                    // You can also access the user: result.user
                }
            })
            .catch((error) => {
                // Handle Errors here.
                console.error('Error during sign-in:', error);
                // Access error code: error.code
                // Access error message: error.message
            });
    });

    return (
        <div>
            <div className="col-xl-12 d-flex justify-content-center">
                <div className="col-xl-8 py-4 m-xl-5 shadow rounded-lg my-3 bg-light text-center">
                    <label className="py-2" style={{ fontSize: 20 }}>Вход на сайт</label>
                    <br />
                    <Form
                        name="basic"
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 19 }}
                        layout="vertical"
                        initialValues={{ remember: true }}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Телефон"
                            name="phone"
                            rules={[{ required: true, message: 'Пожалуйста введите номер телефона!' }]}
                            wrapperCol={{ offset: 0 }}
                        >
                            <Input
                                addonBefore={
                                    <Select
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
                                    </Select>
                                }
                                onChange={(e) => {
                                    setLogin(e.target.value)
                                }}
                                className="w-full border border-neutral-200 bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                type="number"
                                placeholder="Номер телефона"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Пароль"
                            name="password"
                            rules={[{ required: true, message: 'Пожалуйста введите пароль!' }]}
                            wrapperCol={{ offset: 0 }}
                        >
                            <Input.Password
                                className="bg-white rounded border-0"
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }} placeholder="Пароль" />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 0 }}>
                            <button
                                className="col-md-12 ml-0 rounded btn btn-primary"
                                htmltype="submit"
                                onClick={signIn}
                            >
                                Войти
                            </button>
                        </Form.Item>
                        <Link className="mt-3" to="/forgot_password">Забыли пароль?</Link><br />
                        <label className="text-muted">Вход с помощью</label>
                        <Form.Item wrapperCol={{ offset: 0 }} className="d-xl-flex justify-content-center">
                            {/* <GoogleLogin
                                clientId={clientId}
                                buttonText="Войти через Google"
                                onSuccess={responseGoogle}
                                onFailure={onFailure}
                                // cookiePolicy={'single_host_origin'}
                                isSignedIn={false}
                                scope='https://www.googleapis.com/auth/userinfo.profile'
                            /> */}
                            <div className="btn btn-primary" onClick={LoginGoogle}>
                                Google
                            </div>
                        </Form.Item>
                    </Form>
                    <label>Нету аккаунта?</label>
                    <Link className="ml-2" to="/register">Зарегиструйтесь</Link><br />
                </div>
            </div>
        </div>
    );
}

export default SignInPage;