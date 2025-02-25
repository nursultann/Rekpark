import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUserStore } from "../../../store/user_store";
import googleIcon from "../../../dist/icons/icon_google.svg";
import appleIcon from "../../../dist/icons/icon_apple.svg";
import icon from "../../../dist/img/icon_tr.png";

export default function SignUpDialog() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: ""
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const auth = useUserStore();
  const loading = auth.signUpInProgress;
  const emailState = auth.emailVerificationState;
  const verificationError = auth.emailVerificationError;
  
  useEffect(() => {
    auth.clearErrors();
    // Prevent body scrolling when dialog is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const validateEmail = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email обязателен";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Неверный формат email";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name) errors.name = "Имя обязательно";
    if (!formData.password) errors.password = "Пароль обязателен";
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Пароли не совпадают";
    }
    if (!formData.verificationCode) errors.verificationCode = "Введите код подтверждения";
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSendCode = async () => {
    if (!validateEmail()) return;
    await auth.sendVerificationCode(formData.email);
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      setErrors({ verificationCode: "Введите код подтверждения" });
      return;
    }
    await auth.verifyCode(formData.verificationCode);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const success = await auth.signUp(formData);
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          auth.hideSignUpDialog();
        }, 1500);
      }
    } catch (err) {
      console.error("Sign up error:", err);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      verificationCode: ""
    });
    setShowSuccess(false);
    auth.hideSignUpDialog();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const renderEmailStep = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`block w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {verificationError && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4">
          <div className="text-sm text-red-500">{verificationError}</div>
        </div>
      )}

      <button
        type="button"
        disabled={emailState === 'sending'}
        onClick={handleSendCode}
        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
      >
        {emailState === 'sending' ? "Отправка..." : "Отправить код"}
      </button>
    </div>
  );

  const renderVerificationStep = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
          Код подтверждения
        </label>
        <input
          id="verificationCode"
          name="verificationCode"
          type="text"
          value={formData.verificationCode}
          onChange={handleChange}
          className={`block w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
            errors.verificationCode ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Введите код"
        />
        {errors.verificationCode && (
          <p className="mt-1 text-sm text-red-500">{errors.verificationCode}</p>
        )}
      </div>

      {verificationError && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4">
          <div className="text-sm text-red-500">{verificationError}</div>
        </div>
      )}

      <div className="flex flex-col space-y-2">
        <button
          type="button"
          disabled={emailState === 'verifying'}
          onClick={handleVerifyCode}
          className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
        >
          {emailState === 'verifying' ? "Проверка..." : "Подтвердить"}
        </button>
        
        <button
          type="button"
          onClick={handleSendCode}
          className="w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20 transition-colors"
        >
          Отправить код повторно
        </button>
      </div>
    </div>
  );

  const renderRegistrationForm = () => (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Имя
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`block w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ваше имя"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={`block w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Подтвердите пароль
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`block w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="••••••••"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {auth.signUpError && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4">
          <div className="text-sm text-red-500">{auth.signUpError}</div>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
      >
        {loading ? "Регистрация..." : "Зарегистрироваться"}
      </button>
    </form>
  );

  const renderContent = () => {
    if (showSuccess) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900">Регистрация успешна!</h3>
          <p className="mt-2 text-sm text-gray-500">Перенаправление...</p>
        </div>
      );
    }

    if (!emailState) {
      return renderEmailStep();
    }

    if (emailState === 'sent') {
      return renderVerificationStep();
    }

    if (emailState === 'verified') {
      return renderRegistrationForm();
    }
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 overflow-y-auto p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-lg my-8">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex justify-center">
            <div className="w-30 rounded-2xl flex items-center justify-center">
              <img src={icon} alt="Logo" className="w-25" />
            </div>
          </div>
          
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Создать аккаунт
          </h2>
          
          <p className="mt-2 text-center text-sm text-gray-600">
            Уже есть аккаунт?{" "}
            <button 
              onClick={() => {
                handleClose();
                auth.showSignInDialog();
              }}
              className="font-medium text-primary hover:text-primary/90 transition-colors"
            >
              Войти
            </button>
          </p>

          <div className="mt-8">
            {renderContent()}
          </div>

          {!showSuccess && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Или зарегистрируйтесь через</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20 transition-colors"
                >
                  <img src={googleIcon} alt="Google" className="h-5 w-5" />
                  <span className="ml-2">Google</span>
                </button>
                <button
                  type="button" 
                  className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-xl shadow-sm bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/20 transition-colors"
                >
                  <img src={appleIcon} alt="Apple" className="h-5 w-5" />
                  <span className="ml-2">Apple</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}