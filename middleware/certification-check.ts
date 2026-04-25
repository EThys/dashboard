import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()
    
    // Only check if user is logged in
    if (authStore.isAuthenticated && authStore.user) {
        // If not certified, redirect to certification-requise page
        if (!authStore.user.certified) {
            // Prevent redirecting if already going to the certification-requise page or login
            if (to.path !== '/compte/certification-requise' && to.path !== '/login') {
                return navigateTo('/compte/certification-requise')
            }
        }
    }
})
