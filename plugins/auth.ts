export default defineNuxtPlugin(() => {
    const authStore = useAuthStore()
    const tokenCookie = useCookie('auth_token')

    // Si un token existe dans les cookies, on peut essayer de restaurer la session
    // Pour l'instant, on laisse juste le token être disponible
    if (tokenCookie.value) {
        authStore.token = tokenCookie.value
        authStore.isAuthenticated = true
    }
})
