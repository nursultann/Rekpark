import { create } from "zustand";
import { userDetails, loginGoogle, login } from "../api";

export const useUserStore = create((set) => ({
    isAuthenticated: Boolean(localStorage.getItem('token')),
    user: null,
    async checkAuth() {
        const token = localStorage.getItem('token')
        if (token) {
            set(() => ({ isAuthenticated: true }))
            this.fetchUser().then()
        }
    },
    async signIn(phone, password) {
        let response = await login(phone, password);
        if (response.success) {
            const result = response.result
            localStorage.setItem('token', result.token)
            await this.fetchPermissions()

            set((state) => ({
                isAuthenticated: true,
                user: result.user,
            }))

            return true
        }

        return false
    },
    async firebaseSignIn(phone, idToken) {
        let response = await loginGoogle(phone, idToken);
        if (response) {
            const result = response.result
            localStorage.setItem('token', result.token)
            await this.fetchPermissions()

            set((state) => ({
                isAuthenticated: true,
                user: result.user,
            }))

            return true
        }

        return false
    },
    signOut(callback) {
        set((state) => ({ isAuthenticated: false, permissions: [] }))
    },
    async fetchUser() {
        const response = await userDetails()
        if (response) set(() => ({ user: response }))
    },
}))
