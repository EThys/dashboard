// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  // Configuration du projet - Refreshed at 11:32
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },
  css: [
    '~/assets/css/main.css',
    'vue-sonner/style.css'
  ],
  // Configure component auto-import
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components/ui',
      prefix: 'Ui',
      pathPrefix: false,
    }
  ],
  // Shadcn-vue setup often requires some alias and postcss setup
  alias: {
    "components": "~/components",
    "utils": "~/lib/utils",
    "ui": "~/components/ui",
    "lib": "~/lib",
    "hooks": "~/hooks",
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap' },
        { rel: 'icon', type: 'image/png', href: '/logoCasa.png' }
      ]
    }
  },
  typescript: {
    strict: true
  },

  // Proxy configuration for development to bypass CORS
  nitro: {
    devProxy: {
      '/api': {
        target: 'https://server.casanayo.com/api',
        changeOrigin: true,
        prependPath: true,
      },
      '/auth': {
        target: 'https://server.casanayo.com/auth',
        changeOrigin: true,
        prependPath: true,
      }
    }
  },

  // Runtime config for API base URL
  // → En prod Vercel : définir NUXT_PUBLIC_API_BASE=https://server.casanayo.com/api
  //                    et NUXT_PUBLIC_AUTH_BASE=https://server.casanayo.com
  // → En dev : le proxy Nitro redirige /api et /auth automatiquement
  runtimeConfig: {
    public: {
      apiBase: '/api',       // overridé par NUXT_PUBLIC_API_BASE sur Vercel
      authBase: '',          // overridé par NUXT_PUBLIC_AUTH_BASE sur Vercel
    }
  },

  // Désactiver le SSR sur les pages publiques pour éviter la désync Pinia SSR/client
  routeRules: {
    '/api/**': { proxy: 'https://server.casanayo.com/api/**' },
    '/auth/**': { proxy: 'https://server.casanayo.com/auth/**' },
    '/': { ssr: false },
    '/properties': { ssr: false },
    '/services': { ssr: false },
  },
  build: {
    transpile: ['vue-sonner']
  }
})
