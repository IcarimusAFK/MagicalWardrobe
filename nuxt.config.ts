// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      dressingAccessCode: process.env.NUXT_PUBLIC_DRESSING_ACCESS_CODE || 'magical2026',
    },
  },
  app: {
    head: {
      title: 'Magical Wardrobe',
      meta: [{ name: 'description', content: 'Dressing connecté — inventaire personnel de vêtements' }],
    },
  },
})
