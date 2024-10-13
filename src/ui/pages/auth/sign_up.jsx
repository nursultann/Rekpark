import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { firebase, auth } from "../../../config/firebase_config";
import { register } from "../../../api/user";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [timer, setTimer] = useState(0);
    const [verificationId, setVerificationId] = useState(null);

    useEffect(() => {
        document.title = "Регистрация";
        const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
        });
        window.recaptchaVerifier = recaptchaVerifier;
    }, []);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const sendVerificationCode = async () => {
        setLoading(true);
        setError('');
        try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
                `+${phoneNumber}`,
                window.recaptchaVerifier
            );
            setVerificationId(verificationId);
            setStep(2);
            setTimer(60);
        } catch (err) {
            setError('Не удалось отправить код. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        setLoading(true);
        setError('');
        try {
            const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                otp
            );
            await auth.signInWithCredential(credential);
            setStep(3);
        } catch (err) {
            setError('Неверный код. Попробуйте еще раз.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await register({
                name,
                phone: phoneNumber,
                password,
            });
            navigate('/login');
        } catch (err) {
            setError('Не удалось зарегистрироваться. Попробуйте позже.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <div className="mb-6">
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Номер телефона
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+7 999 999 99 99"
                                required
                            />
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={sendVerificationCode}
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                {loading ? 'Отправка...' : 'Отправить код'}
                            </button>
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="mb-6">
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                Код подтверждения
                            </label>
                            <input
                                type="text"
                                id="otp"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Введите код"
                                required
                            />
                        </div>
                        <div className="text-sm text-gray-500 text-center mb-6">
                            {timer > 0 ? (
                                <p>Повторная отправка через {timer} сек</p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={sendVerificationCode}
                                    className="text-indigo-600 hover:text-indigo-500"
                                >
                                    Отправить код повторно
                                </button>
                            )}
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={verifyCode}
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                {loading ? 'Проверка...' : 'Подтвердить'}
                            </button>
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Имя
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Введите имя"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Пароль
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Подтвердите пароль
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Повторите пароль"
                                required
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            >
                                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                            </button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Регистрация
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {renderStep()}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center mt-2">{error}</div>
                    )}

                    <div>
                        <div className="text-sm text-center">
                            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Уже есть аккаунт? Войти
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
            <div id="recaptcha-container"></div>
        </div>
    );
};

export default SignUpPage;