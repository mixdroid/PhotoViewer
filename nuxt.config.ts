export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: ['@vercel/analytics'],
  runtimeConfig: {
    blobToken: process.env.BLOB_READ_WRITE_TOKEN,
    authUsername: process.env.GALLERY_USERNAME,
    authPassword: process.env.GALLERY_PASSWORD,
    authSecret: process.env.AUTH_SECRET,
  },
  app: {
    head: {
      title: 'Nightframe — Photo gallery',
      meta: [{ name: 'description', content: 'A quiet place for your favorite frames.' }],
    },
  },
})
