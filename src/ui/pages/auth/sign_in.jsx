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


    const signIn = async () => {
        if (password != "" || phoneNumber != "") {
            // console.log('phone', countryCode + phoneNumber);
            await login(phoneNumber, password, onLoginSuccess, onLoginError);
        }
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
        message.error({ content: 'Email или пароль указан неверно!', duration: 2 });
    };
    const LoginGoogle = async () => {
        try {
            const result = await auth.signInWithPopup(googleAuthProvider);
            const user = result.user;
            // console.log('User signed in:', user);
            await loginGoogle(user.email, user.displayName, user.uid, onLoginSuccess, onLoginError);
        } catch (error) {
            console.error('Error during Google Sign-In:', error);
            message.error('Не удалось авторизоваться через Google.');
        }
    };

    useEffect(() => {
        document.title = "Вход";
        if (localStorage.getItem('token') != null) {
            window.location.href = '/profile';
        }
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
            <div className="col-xl-12 p-2 d-flex justify-content-center">
                <div className="col-12 col-xl-8 p-3 py-4 m-xl-5 shadow rounded-lg my-3 bg-light text-center">
                    <label className="py-2" style={{ fontSize: 20 }}>Вход в профиль</label>
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
                            label="Email"
                            name="phone"
                            rules={[{ required: true, message: 'Пожалуйста введите email!' }]}
                            wrapperCol={{ offset: 0 }}
                        >
                            <Input
                                onChange={(e) => {
                                    setLogin(e.target.value)
                                }}
                                className="w-full bg-white border border-neutral-200 bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                type="text"
                                placeholder="rekpark@gmail.com"
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
                            <button
                                onClick={LoginGoogle}
                                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                                Войти через Google
                            </button>
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