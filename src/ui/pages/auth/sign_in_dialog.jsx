import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUserStore } from "../../../store/user_store";
import googleIcon from "../../../dist/icons/icon_google.svg";
import appleIcon from "../../../dist/icons/icon_apple.svg"; 
import icon from "../../../dist/img/icon_tr.png";

export default function SignInDialog() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const auth = useUserStore();
  const loading = auth.signInInProgress;
  const error = auth.signInError;

  // Clear errors when dialog opens
  useEffect(() => {
    auth.clearErrors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const success = await auth.signIn(email, password);
      if (success) {
        setShowSuccess(true);
        // Store remember me preference if needed
        if (rememberMe) {
          localStorage.setItem('rememberEmail', email);
        }
        setTimeout(() => {
          auth.hideSignInDialog();
        }, 1500);
      }
    } catch (err) {
      console.error("Sign in error:", err);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setShowSuccess(false);
    auth.hideSignInDialog();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-8 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-900">Успешный вход!</h3>
            <p className="mt-2 text-sm text-gray-500">Перенаправление...</p>
          </div>
        ) : (
          <>
            <div>
              <div className="flex justify-center">
                <div className="w-30 rounded-2xl flex items-center justify-center">
                  <img src={icon} alt="Logo" className="w-25" />
                </div>
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Войти в аккаунт
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Или{" "}
                <a href="/register" className="font-medium text-primary hover:text-primary/90 transition-colors">
                  зарегистрируйтесь
                </a>
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="text"
                    required
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                  <div className="text-sm text-red-500">{error}</div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Запомнить меня
                  </label>
                </div>

                <div className="text-sm">
                  <a href="/forgot_password" className="font-medium text-primary hover:text-primary/90 transition-colors">
                    Забыли пароль?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
              >
                {loading ? "Вход..." : "Войти"}
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Или войдите через</span>
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
            </form>
          </>
        )}
      </div>
    </div>
  );
}