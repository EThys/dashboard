import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as { name: string; email: string; role: string } | null,
        isAuthenticated: false,
    }),
    actions: {
        login(email: string, password: string) {
            // Mock login
            if (email && password) {
                this.user = {
                    name: 'Admin User',
                    email: email,
                    role: 'admin',
                }
                this.isAuthenticated = true
                return true
            }
            return false
        },
        logout() {
            this.user = null
            this.isAuthenticated = false
            return navigateTo('/login')
        },
    },
})
