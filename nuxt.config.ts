// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  // Configuration du projet - Refreshed at 11:32
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    // '@tanstack/vue-query' removed as it is not a Nuxt module
    // 'shadcn-nuxt', (manual setup)
    // Actually user asked for shadcn, usually it's manual setup. Let's stick to manual or simple module integration.
    // Given the prompt, I'll stick to standard manual integration which is most robust for shadcn-vue.
    // But I will register modules I installed.
  ],
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light',
  },
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
    "hooks": "~/hooks"
  },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap' }
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
      }
    }
  },

  // Runtime config for API base URL
  runtimeConfig: {
    public: {
      apiBase: process.env.NODE_ENV === 'production'
        ? 'https://server.casanayo.com/api'
        : '/api'
    }
  }
})
