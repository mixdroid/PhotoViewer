export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    blobToken: process.env.BLOB_READ_WRITE_TOKEN,
  },
  app: {
    head: {
      title: 'Nightframe — Photo gallery',
      meta: [{ name: 'description', content: 'A quiet place for your favorite frames.' }],
    },
  },
})
