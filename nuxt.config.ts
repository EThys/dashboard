// https://nuxt.com/docs/api/configuration/nuxt-config
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
  css: ["~/assets/css/main.css", "vue-sonner/style.css"],
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

  // Proxy configuration for development to bypass CORS
  nitro: {
    devProxy: {
      "/api": {
        target: "https://server.casanayo.com/api",
        changeOrigin: true,
        prependPath: true,
      },
      "/auth": {
        target: "https://server.casanayo.com/auth",
        changeOrigin: true,
        prependPath: true,
      },
    },
  },

  // Runtime config for API base URL
  // → En prod Vercel : définir NUXT_PUBLIC_API_BASE=https://server.casanayo.com/api
  //                    et NUXT_PUBLIC_AUTH_BASE=https://server.casanayo.com
  // → En dev : le proxy Nitro redirige /api et /auth automatiquement
  runtimeConfig: {
    public: {
      apiBase: "/api", // overridé par NUXT_PUBLIC_API_BASE sur Vercel
      authBase: "", // overridé par NUXT_PUBLIC_AUTH_BASE sur Vercel
    },
  },

  // Désactiver le SSR sur les pages publiques pour éviter la désync Pinia SSR/client
  // Pages publiques en SSR → indexables par Google
  // Pages protégées en CSR → ssr: false
  routeRules: {
    '/api/**': { proxy: 'https://server.casanayo.com/api/**' },
    '/auth/**': { proxy: 'https://server.casanayo.com/auth/**' },
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
    '/login': { ssr: false },
    '/register/**': { ssr: false },
  },
  build: {
    transpile: ["vue-sonner"],
  },
});
