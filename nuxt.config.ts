// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
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
    "components": "d:/myproject/casaNayoDashboard/components",
    "utils": "d:/myproject/casaNayoDashboard/lib/utils",
    "ui": "d:/myproject/casaNayoDashboard/components/ui",
    "lib": "d:/myproject/casaNayoDashboard/lib",
    "hooks": "d:/myproject/casaNayoDashboard/hooks"
    // Using absolute paths or relative to root
  },
  typescript: {
    strict: true
  }
})
