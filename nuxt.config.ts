// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4
  },
  css: ['@unocss/reset/tailwind.css', './assets/styles/grapes.css'],
  modules: ['@unocss/nuxt', '@nuxt/icon', '@vaxee/nuxt']
})
