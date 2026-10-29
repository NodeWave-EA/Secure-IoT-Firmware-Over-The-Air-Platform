// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/turnstile',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxt/scripts',
    '@nuxt/fonts',
    '@vueuse/nuxt/module',
  ],

  devtools: {
    enabled: true,
  },

  app: {
    head: {
      titleTemplate: '%s - Secure IoT FOTA Platform',
      title: 'NODEFOTA - Zero-Trust Over-The-Air Firmware Management',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Enterprise-grade wireless firmware updates, cryptographic differential patching, and dual-bank rollback safety for millions of IoT devices.' },
        { name: 'theme-color', content: '#0f172a' },
        { name: 'apple-mobile-web-app-title', content: 'NODEFOTA' },
        { name: 'msapplication-TileColor', content: '#0f172a' },
        { name: 'msapplication-TileImage', content: '/icons/favicon-144x144.png' },
        { name: 'msapplication-config', content: '/icons/browserconfig.xml' },
      ],
      link: [
        // Legacy & SVG Favicons
        { rel: 'icon', type: 'image/x-icon', href: '/icons/favicon.ico' },
        { rel: 'shortcut icon', href: '/icons/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/icons/favicon.svg' },

        // Standard PNG Favicons
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/icons/favicon-16x16.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/icons/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '96x96',
          href: '/icons/favicon-96x96.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '192x192',
          href: '/icons/favicon-192x192.png',
        },

        // Apple Touch Icon
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/icons/apple-touch-icon.png' },

        // Web Manifest
        { rel: 'manifest', href: '/icons/manifest.json' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    classSuffix: '',
  },

  runtimeConfig: {
    public: {
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
    },
  },

  routeRules: {
    '/': { prerender: true },
  },

  experimental: {
    payloadExtraction: true,
    viewTransition: true,
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    compressPublicAssets: true,
  },

  eslint: {
    config: {
      standalone: false,
      stylistic: {
        semi: true,
        quotes: 'double',
        indent: 'tab',
        commaDangle: 'always-multiline',
        braceStyle: '1tbs',
      },
    },
  },
  turnstile: {
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
  },
})
