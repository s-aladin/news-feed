// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt'
  ],
  imports: {
    dirs: ['stores']
  },
  css: ['~/assets/css/reset.css', '~/assets/css/main.css'],
  app: {
    head: {
      title: 'News App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  typescript: {
    typeCheck: true,
    strict: true
  },
  runtimeConfig: {
    public: {
      rssFeeds: {
        mos: 'https://www.mos.ru/rss',
        interfax: 'https://www.interfax.ru/rss.asp'
      }
    }
  },

  compatibilityDate: '2025-07-15',

  devtools: { enabled: true }
})
