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
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'production'
        ? 'https://server.casanayo.com/api'
        : '/api',
      authBase: process.env.NODE_ENV === 'production'
        ? 'https://server.casanayo.com' // Endpoints like /auth/login will be appended
        : '' // In dev, we use /auth request directly via proxy
    }
  },
  build: {
    transpile: ['vue-sonner']
  }
})
