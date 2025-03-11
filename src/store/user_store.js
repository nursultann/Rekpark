import { create } from "zustand";
import { userDetails, loginGoogle, login } from "../api";
import ApiClient from "../api/ApiClient";

export const useUserStore = create((set, get) => ({
    isAuthenticated: Boolean(localStorage.getItem('token')),
    user: null,
    showSignIn: false,
    showSignUp: false,
    signInInProgress: false,
    signUpInProgress: false,
    signInError: null,
    signUpError: null,
    emailVerificationState: null, // null | 'sending' | 'sent' | 'verifying' | 'verified'
    emailVerificationError: null,
    verificationEmail: null,
    _resolveSignIn: null,
    _resolveSignUp: null,

    async checkAuth() {
        const token = localStorage.getItem('token')
        if (token) {
            set(() => ({ isAuthenticated: true }))
            await this.fetchUser()
        }
    },

    async signIn(email, password) {
        set(() => ({ 
            signInInProgress: true,
            signInError: null 
        }))

        try {
            const response = await ApiClient.post('/login', {
                login: email,
                password: password
            });
            
            if (response.status === 200) {
                const result = response.data.data;
                localStorage.setItem('token', result.api_token);
                
                set(() => ({
                    isAuthenticated: true,
                    user: result,
                    signInInProgress: false,
                    signInError: null
                }));
                
                return true;
            } else {
                set(() => ({
                    signInInProgress: false,
                    signInError: "Неверный email или пароль"
                }));
                return false;
            }
        } catch (error) {
            set(() => ({
                signInInProgress: false,
                signInError: error.response?.data?.message || "Произошла ошибка при входе"
            }));
            return false;
        }
    },

    async sendVerificationCode(email) {
        set(() => ({
            emailVerificationState: 'sending',
            emailVerificationError: null,
            verificationEmail: email
        }));

        try {
            const response = await ApiClient.post('/user/send-code', { email });
            
            if (response.status === 200) {
                set(() => ({ emailVerificationState: 'sent' }));
                return true;
            } else {
                set(() => ({
                    emailVerificationState: null,
                    emailVerificationError: "Не удалось отправить код"
                }));
                return false;
            }
        } catch (error) {
            set(() => ({
                emailVerificationState: null,
                emailVerificationError: error.response?.data?.message || "Ошибка отправки кода"
            }));
            return false;
        }
    },

    async verifyCode(code) {
        const { verificationEmail } = get();
        
        if (!verificationEmail) {
            set(() => ({
                emailVerificationError: "Email не найден"
            }));
            return false;
        }

        set(() => ({
            emailVerificationState: 'verifying',
            emailVerificationError: null
        }));

        try {
            const response = await ApiClient.post('/user/verify-code', {
                email: verificationEmail,
                code: code
            });
            
            if (response.status === 200) {
                set(() => ({ emailVerificationState: 'verified' }));
                return true;
            } else {
                set(() => ({
                    emailVerificationState: 'sent',
                    emailVerificationError: "Неверный код"
                }));
                return false;
            }
        } catch (error) {
            set(() => ({
                emailVerificationState: 'sent',
                emailVerificationError: error.response?.data?.message || "Ошибка проверки кода"
            }));
            return false;
        }
    },

    async signUp(formData) {
        const { verificationEmail, emailVerificationState } = get();

        if (!verificationEmail || emailVerificationState !== 'verified') {
            set(() => ({
                signUpError: "Требуется подтверждение email"
            }));
            return false;
        }

        set(() => ({
            signUpInProgress: true,
            signUpError: null
        }));

        try {
            const response = await ApiClient.post('/register', {
                name: formData.name,
                email: verificationEmail,
                password: formData.password,
                code: formData.verificationCode
            });

            if (response.status === 200) {
                const result = response.data.data;
                localStorage.setItem('token', result.api_token);
                
                set(() => ({
                    isAuthenticated: true,
                    user: result,
                    signUpInProgress: false,
                    signUpError: null,
                    showSignUp: false,
                    emailVerificationState: null,
                    verificationEmail: null
                }));
                
                return true;
            } else {
                set(() => ({
                    signUpInProgress: false,
                    signUpError: "Ошибка при регистрации"
                }));
                return false;
            }
        } catch (error) {
            set(() => ({
                signUpInProgress: false,
                signUpError: error.response?.data?.message || "Произошла ошибка при регистрации"
            }));
            return false;
        }
    },

    async googleSignIn(token, email, name) {
        set(() => ({
            signInInProgress: true,
            signInError: null
        }));

        try {
            const response = await ApiClient.post('/google-auth', {
                email,
                name,
                uid: token
            });

            if (response.status === 200) {
                const result = response.data.data;
                localStorage.setItem('token', result.api_token);
                
                set(() => ({
                    isAuthenticated: true,
                    user: result,
                    signInInProgress: false,
                    signInError: null
                }));
                
                return true;
            }
            
            set(() => ({
                signInInProgress: false,
                signInError: "Ошибка входа через Google"
            }));
            return false;
        } catch (error) {
            set(() => ({
                signInInProgress: false,  
                signInError: error.response?.data?.message || "Ошибка входа через Google"
            }));
            return false;
        }
    },

    async appleSignIn(uid) {
        set(() => ({
            signInInProgress: true,
            signInError: null
        }));

        try {
            const response = await ApiClient.post('/apple-auth', { uid });

            if (response.status === 200) {
                const result = response.data.data;
                localStorage.setItem('token', result.token);
                
                set(() => ({
                    isAuthenticated: true,
                    user: result,
                    signInInProgress: false,
                    signInError: null
                }));
                
                return true;
            }
            
            set(() => ({
                signInInProgress: false,
                signInError: "Ошибка входа через Apple"
            }));
            return false;
        } catch (error) {
            set(() => ({
                signInInProgress: false,
                signInError: error.response?.data?.message || "Ошибка входа через Apple"
            }));
            return false;
        }
    },

    signOut() {
        localStorage.removeItem('token');
        set(() => ({ 
            isAuthenticated: false,
            user: null
        }));
    },

    async showSignInDialog() {
        return new Promise((resolve) => {
            set(() => ({ 
                showSignIn: true,
                showSignUp: false,
                signInError: null,
                _resolveSignIn: resolve 
            }));
        });
    },

    async showSignUpDialog() {
        return new Promise((resolve) => {
            set(() => ({
                showSignUp: true,
                showSignIn: false,
                signUpError: null,
                emailVerificationState: null,
                emailVerificationError: null,
                verificationEmail: null,
                _resolveSignUp: resolve
            }));
        });
    },

    hideSignInDialog() {
        const { _resolveSignIn } = get();
        set(() => ({ 
            showSignIn: false,
            signInError: null,
            _resolveSignIn: null 
        }));
        if (_resolveSignIn) _resolveSignIn(false);
    },

    hideSignUpDialog() {
        const { _resolveSignUp } = get();
        set(() => ({
            showSignUp: false,
            signUpError: null,
            emailVerificationState: null,
            emailVerificationError: null,
            verificationEmail: null,
            _resolveSignUp: null
        }));
        if (_resolveSignUp) _resolveSignUp(false);
    },

    async fetchUser() {
        try {
            const response = await ApiClient.get('/user');
            if (response.status === 200) {
                set(() => ({ user: response.data.data }));
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    },

    clearErrors() {
        set(() => ({ 
            signInError: null,
            signUpError: null,
            emailVerificationError: null
        }));
    },

    resetEmailVerification() {
        set(() => ({
            emailVerificationState: null,
            emailVerificationError: null,
            verificationEmail: null
        }));
    }
}));