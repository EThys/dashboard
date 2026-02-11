export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const hasSession = auth.checkSession()

  // 1. Protect all dashboard routes
  if (to.path.startsWith('/dashboard')) {
    if (!hasSession) {
      return navigateTo('/login')
    }
    
    // Check for Admin access (IDs 18 or 19)
    if (!auth.isAdmin) {
      console.warn('Accès refusé au Dashboard: Utilisateur non administrateur.')
      return navigateTo('/')
    }
  }

  // 2. Redirect from login if already authenticated
  if (to.path === '/login' && hasSession) {
    // If admin, go to dashboard, otherwise go home
    return navigateTo(auth.isAdmin ? '/dashboard' : '/')
  }
})
