import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "react-google-login";

import { login, loginGoogle } from "../../../api/user";
import { clientId } from '../../../config/firebase_config';

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
        await login(countryCode + phoneNumber, password, onLoginSuccess, onLoginError);
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

    useEffect(() => {
        document.title = "Вход";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login(phone, password, onLoginSuccess, onLoginError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Вход в аккаунт
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="phone-number" className="sr-only">Номер телефона</label>
                            <input
                                id="phone-number"
                                name="phone"
                                type="tel"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Номер телефона"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Пароль</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Пароль"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Запомнить меня
                            </label>
                        </div>

                        <div className="text-sm">
                            <Link to="/forgot_password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Забыли пароль?
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        >
                            {loading ? 'Загрузка...' : 'Войти'}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">
                                Или продолжить с
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <GoogleLogin
                            clientId={clientId}
                            render={renderProps => (
                                <button
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled || loading}
                                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8" />
                                        <path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z" fill="#34A853" />
                                        <path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04" />
                                        <path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335" />
                                    </svg>
                                    Войти через Google
                                </button>
                            )}
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    </div>
                </div>

                <div className="text-center mt-4">
                    <span className="text-gray-600">Нет аккаунта? </span>
                    <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Зарегистрируйтесь
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;