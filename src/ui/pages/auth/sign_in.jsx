import React, { useState } from "react";
import { message } from 'antd';
import { Link, useNavigate } from "react-router-dom";
import GoogleLogin, { useGoogleLogin } from "react-google-login";

import { DefaultPhoneInput, DefaultPasswordInput } from "../../components/default_input_fields";
import { loginGoogle } from "../../../api/user";
import { auth, clientId, googleAuthProvider } from '../../../config/firebase_config';
import classNames from "classnames";

import { GoogleIcon } from "../../components/icons";
import { useUserStore } from "../../../store/user_store";

const key = 'updatable';

const Title = ({ title, isRequired, children }) => (
    <div className="flex flex-row items-center gap-2 mt-3">
        {isRequired ? <span className="text-red-500">*</span> : <></>}
        <span className="text-black text-[15px] font-normal">{title}</span>
    </div>
);

const SignInPage = () => {
    const history = useNavigate();
    const userStore = useUserStore();
    const [phoneNumber, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [countryCode, setCountryCode] = useState('996');

    const responseGoogle = async (response) => {
        const email = response.profileObj.email;
        const name = response.profileObj.name;
        const uid = response.profileObj.googleId;

        const credential = await auth.signInWithCredential(googleAuthProvider.credential(
            response.tokenId,
            response.accessToken,
        ))

        const idToken = await credential.user.getIdToken(true);

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

    const googleLogin = useGoogleLogin({
        clientId,
        onSuccess: responseGoogle,
        onFailure: onFailure,
        accessType: 'offline',
        responseType: 'code',
        prompt: 'consent',
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
    });

    const signIn = async () => {
        if (password === "" || phoneNumber.length < 9) return;
        const phone = countryCode + phoneNumber.replaceAll(' ', '');
        const result = userStore.signIn(phone, password);
        if (result) {
            onLoginSuccess();
        } else {
            onLoginError();
        }
    }

    const onLoginSuccess = () => {
        setTimeout(() => {
            message.success({ content: 'Успешно!', key, duration: 2 });
        }, 1000);
        history("/profile");
    };

    const onLoginError = () => {
        console.log('error');
        message.error({ content: 'Номер или пароль указан неверно!', duration: 2 });
    };

    return (
        <div>
            <div className="flex justify-content-center items-center py-20">
                <div className={classNames(
                    " bg-zinc-100 rounded-2xl lg:shadow lg:border lg:border-neutral-200 py-[40px] lg:px-[200px] max-w-4xl w-full",
                    "lg:bg-zinc-100 md:bg-transparent md:px-0 md:shadow-none md:border-none"
                )}>
                    <div className="text-center text-black text-3xl font-medium font-['SF UI Display'] mb-8">Вход на сайт</div>

                    <Title title="Номер телефона" />
                    <DefaultPhoneInput
                        name="title"
                        placeholder="Введите номер телефона"
                        value={phoneNumber}
                        onCountryCodeChange={(value) => {
                            setCountryCode(value);
                        }}
                        onChange={(e) => {
                            setLogin(e.target.value);
                        }}
                        required={true}
                    />

                    <Title title="Пароль" />
                    <DefaultPasswordInput
                        value={password}
                        placeholder={"Введите пароль"}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        required={true}
                    />

                    <div
                        className={classNames(
                            "w-full h-14 py-4 bg-blue-600 rounded-2xl justify-center items-center gap-2.5 inline-flex cursor-pointer mt-4",
                            "hover:bg-blue-700 transition-colors duration-200",
                        )}
                        onClick={signIn}
                    >
                        <div className="text-center text-white text-xl font-semibold">Войти</div>
                    </div>

                    <div className="text-center text-blue-600 text-sm font-medium mt-4">
                        <Link to="/forgot_password">
                            Забыли пароль?
                        </Link>
                    </div>

                    <div className="flex flex-col justify-content-center items-center mt-4">

                        <div
                            className={classNames(
                                "w-full h-14 py-4 bg-neutral-800 rounded-2xl justify-center items-center gap-2.5 inline-flex",
                                "hover:bg-neutral-900 transition-colors duration-200",
                                "cursor-pointer"
                            )}
                            onClick={() => {
                                googleLogin.signIn();
                            }}
                        >
                            <div className="w-4 h-5 relative">
                                <GoogleIcon />
                            </div>
                            <div className="text-center text-white text-xl font-semibold font-['SF UI Display']">Войти</div>
                        </div>

                        {/*
                        <GoogleLogin
                            clientId={clientId}
                            buttonText="Войти через Google"
                            onSuccess={responseGoogle}
                            onFailure={onFailure}
                            // cookiePolicy={'single_host_origin'}
                            isSignedIn={false}
                            scope='https://www.googleapis.com/auth/userinfo.profile'
                        />
                        */}

                        <div className="mt-4">
                            <label>Нету аккаунта?</label>
                            <Link className="ml-2 text-blue-600" to="/register">Зарегиструйтесь</Link>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;