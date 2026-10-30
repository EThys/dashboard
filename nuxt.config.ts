// https://nuxt.com/docs/api/configuration/nuxt-config
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
/** Vite résout sinon le champ `browser` → stomp.umd.js (pas d’export ESM `Client`) */
const stompEsm = join(__dirname, 'node_modules/@stomp/stompjs/esm6/index.js')

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  // Configuration du projet - Refreshed at 11:32
  devtools: { enabled: false },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "@nuxtjs/color-mode"],
  colorMode: {
    classSuffix: "",
    preference: "light",
    fallback: "light",
  },
  css: ['~/assets/css/main.css'],
  // Configure component auto-import
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
    {
      path: "~/components/ui",
      prefix: "Ui",
      pathPrefix: false,
    },
  ],
  // Shadcn-vue setup often requires some alias and postcss setup
  alias: {
    components: "~/components",
    utils: "~/lib/utils",
    ui: "~/components/ui",
    lib: "~/lib",
    hooks: "~/hooks",
  },
  app: {
    head: {
      // ─── SEO GLOBAL ───────────────────────────────────────────────────────────
      titleTemplate: "%s — CasaNayo | Immobilier & Services en RDC",
      htmlAttrs: { lang: "fr" },

      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },

        // Description & mots-clés
        {
          name: "description",
          content:
            "CasaNayo centralise l'ensemble de votre parcours immobilier : achat, vente, location et services à domicile (électricien, plombier...). Trouvez votre propriété idéale, vendez ou louez votre bien, et accédez à des professionnels en un clic — partout en RDC.",
        },
        {
          name: "keywords",
          content:
            "immobilier RDC, maison Kinshasa, appartement Congo, terrain à vendre, location Kinshasa, CasaNayo, bien immobilier Kinshasa, agence immobilière Congo, électricien Kinshasa, plombier Kinshasa, services à domicile RDC, acheter maison Congo, vendre bien immobilier RDC",
        },
        { name: "author", content: "CasaNayo" },
        { name: "robots", content: "index, follow" },
        { name: "theme-color", content: "#1B4332" },

        // ─── Open Graph (Facebook / Google Rich Result) ───────────────────────
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "CasaNayo" },
        { property: "og:locale", content: "fr_CD" },
        { property: "og:url", content: "https://casanayo.com" },
        {
          property: "og:title",
          content: "CasaNayo — Immobilier & Services n°1 en RDC",
        },
        {
          property: "og:description",
          content:
            "CasaNayo redéfinit l'expérience immobilière en Afrique. Achetez, vendez, louez et accédez à des services pros sur une plateforme unique, sécurisée et intuitive. Gérez tout votre immobilier depuis votre téléphone.",
        },
        // Logo CasaNayo utilisé directement comme image OG
        { property: "og:image", content: "https://casanayo.com/logoCasa.png" },
        { property: "og:image:width", content: "512" },
        { property: "og:image:height", content: "512" },
        {
          property: "og:image:alt",
          content: "Logo CasaNayo — Plateforme Immobilière & Services RDC",
        },

        // ─── Twitter Card ─────────────────────────────────────────────────────
        { name: "twitter:card", content: "summary" },
        { name: "twitter:site", content: "@casanayo" },
        { name: "twitter:title", content: "CasaNayo — Immobilier & Services n°1 en RDC" },
        {
          name: "twitter:description",
          content:
            "Louer, Acheter, Vendre & Services — CasaNayo simplifie votre vie en offrant tout au même endroit. Téléchargez l'app maintenant.",
        },
        { name: "twitter:image", content: "https://casanayo.com/logoCasa.png" },
      ],

      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap",
        },
        // Favicon + logo
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/logoCasa.png",
        },
        { rel: "apple-touch-icon", href: "/logoCasa.png" },
        // Canonical
        { rel: "canonical", href: "https://casanayo.com" },
        // Sitemap
        { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
      ],

      // ─── Schema.org JSON-LD (Rich Snippet Google) ─────────────────────────
      script: [
        {
          type: "application/ld+json",
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "CasaNayo",
            description:
              "CasaNayo centralise l'ensemble du parcours immobilier en Afrique : recherche de biens, vente, location et services à domicile (électricien, plombier...). Une plateforme unique, sécurisée et intuitive qui connecte propriétaires, acheteurs et professionnels de service en République Démocratique du Congo.",
            slogan: "Louer, Acheter, Vendre & Services — tout au même endroit.",
            url: "https://casanayo.com",
            logo: "https://casanayo.com/logoCasa.png",
            image: "https://casanayo.com/logoCasa.png",
            telephone: "+243 836 323 805",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Kinshasa",
              addressCountry: "CD",
            },
            sameAs: [
              "https://www.facebook.com/CasaNayo",
              "https://www.instagram.com/casanayo",
            ],
            areaServed: {
              "@type": "Country",
              name: "République Démocratique du Congo",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Biens immobiliers & Services à domicile",
              itemListElement: [
                { "@type": "Offer", itemOffered: { "@type": "Product", name: "Achat immobilier" } },
                { "@type": "Offer", itemOffered: { "@type": "Product", name: "Vente immobilier" } },
                { "@type": "Offer", itemOffered: { "@type": "Product", name: "Location immobilier" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Services à domicile" } },
              ],
            },
          }),
        },
      ],
    },
  },
  typescript: {
    strict: true,
  },

  vite: {
    plugins: [
      {
        name: 'kendo-vue2-alias',
        enforce: 'pre',
        resolveId(source: string, importer?: string) {
          const vue2 = join(__dirname, 'node_modules/vue2/dist/vue.runtime.esm.js')
          if (source === 'virtual:kendo-vue2') return vue2
          if (source !== 'vue' || !importer) return null
          const from = importer.replace(/\\/g, '/')
          const kendo =
            from.includes('/node_modules/@progress/kendo-vue-') ||
            from.includes('/node_modules/vue-class-component/')
          if (!kendo) return null
          return vue2
        },
        transform(code: string, id: string) {
          const norm = id.replace(/\\/g, '/')
          if (norm.includes('/vue2/dist/vue.runtime.esm.js')) {
            return code.replace(/process\.env\.NODE_ENV/g, '"production"')
          }
          if (norm.includes('/vue-class-component/dist/vue-class-component.common.js')) {
            const vue2 = JSON.stringify(join(__dirname, 'node_modules/vue2/dist/vue.runtime.esm.js'))
            const body = code
              .replace(/process\.env\.NODE_ENV/g, '"production"')
              .replace(/\bexports\b/g, '__kendoExports')
              .replace(/\brequire\b/g, '__kendoRequire')
              .replace(/\bmodule\b/g, '__kendoModule')
            return [
              `import __kendoVue from ${vue2};`,
              'const __kendoExports = {};',
              'const __kendoModule = { exports: __kendoExports };',
              'const __kendoRequire = (id) => { if (id === "vue") return __kendoVue; throw new Error(id); };',
              body,
              'export default __kendoExports.default;',
            ].join('\n')
          }
          return null
        },
      },
    ],
    optimizeDeps: {
      include: [
        '@vueuse/core',
        '@vueuse/shared',
        '@stomp/stompjs',
        'vue',
        'vue-router',
      ],
      exclude: [
        '@progress/kendo-vue-grid',
        '@progress/kendo-vue-common',
        '@progress/kendo-vue-intl',
        'vue-class-component',
      ],
    },
    resolve: {
      alias: {
        '@stomp/stompjs': stompEsm,
      },
    },
  },

  // Proxy configuration for development to bypass CORS
  nitro: {
    devProxy: {
      "/api": {
        target: "https://migration.casanayo.com/api",
        changeOrigin: true,
        prependPath: true,
      },
      "/auth": {
        target: "https://migration.casanayo.com/auth",
        changeOrigin: true,
        prependPath: true,
      },
      /** STOMP — si le client passe par le proxy local (peu usité si URL absolue dans runtimeConfig) */
      "/websocket": {
        target: "http://91.99.168.226:8093",
        ws: true,
        changeOrigin: true,
      },
    },
  },

  // Runtime config — aligné Flutter (Constantes.activeServer / migration)
  // → Prod : NUXT_PUBLIC_API_BASE=https://migration.casanayo.com/api
  //          NUXT_PUBLIC_AUTH_BASE=https://migration.casanayo.com
  // → Dev : proxy Nitro vers migration.casanayo.com
  runtimeConfig: {
    public: {
      apiBase: "/api",
      authBase: "",
      /** Surcharge : `NUXT_PUBLIC_STOMP_BROKER_URL` */
      stompBrokerUrl:
        process.env.NUXT_PUBLIC_STOMP_BROKER_URL || "ws://91.99.168.226:8093/websocket",
    },
  },

  // Désactiver le SSR sur les pages publiques pour éviter la désync Pinia SSR/client
  // Pages publiques en SSR → indexables par Google
  // Pages protégées en CSR → ssr: false
  routeRules: {
    '/api/**': { proxy: 'https://migration.casanayo.com/api/**' },
    '/auth/**': { proxy: 'https://migration.casanayo.com/auth/**' },
    // Pages publiques SSR (indexées par Google)
    '/': { ssr: true },
    '/properties': { ssr: true },
    '/properties/**': { ssr: true },
    '/services': { ssr: true },
    '/services/**': { ssr: true },
    '/contact': { ssr: true },
    '/team': { ssr: true },
    // Pages protégées CSR uniquement
    '/dashboard/**': { ssr: false },
    '/compte/**': { ssr: false },
    '/login': { ssr: false },
    '/register/**': { ssr: false },
  },
  build: {
    transpile: [
      "vue-sonner",
      "@stomp/stompjs",
      "@progress/kendo-vue-grid",
      "@progress/kendo-vue-common",
      "@progress/kendo-vue-intl",
      "@progress/kendo-data-query",
      "vue-class-component",
    ],
  },
});
