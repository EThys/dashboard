export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  const hasSession = auth.checkSession()

  // Espace compte (abonnement, paiements) : tout membre connecté, pas réservé aux admins
  if (to.path.startsWith('/compte')) {
    if (!hasSession) {
      return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  }

  // 1. Protect all dashboard routes
  if (to.path.startsWith('/dashboard')) {
    if (!hasSession) {
      return navigateTo('/login')
    }

    if (auth.isAdmin) {
      // accès complet
    } else if (auth.isGerant && to.path.startsWith('/dashboard/hotel')) {
      // gestionnaires d'hôtel : uniquement l'espace /dashboard/hotel
    } else if (auth.isGerant) {
      return navigateTo('/dashboard/hotel')
    } else {
      console.warn('Accès refusé au Dashboard.')
      return navigateTo('/')
    }
  }

  // 2. Redirect from login if already authenticated
  if (to.path === '/login' && hasSession) {
    if (auth.isAdmin) return navigateTo('/dashboard')
    if (auth.isGerant) return navigateTo('/dashboard/hotel')
    return navigateTo('/')
  }
})
