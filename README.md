# Nightframe gallery


A private Nuxt photo gallery backed by Vercel Blob and protected with a simple single-user login.


## Run locally

```bash
npm install

npm run dev
```

Add these values to `.env` before starting the app:

```env
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
GALLERY_USERNAME=admin
GALLERY_PASSWORD=choose-a-password
AUTH_SECRET=use-a-long-random-string
```

The home page, album pages, Blob listing, and image proxy require login. Login creates a signed, HttpOnly cookie that lasts seven days. Vercel Web Analytics is enabled through the `@vercel/analytics` Nuxt module; enable Analytics for the project in the Vercel dashboard to see data after deployment.
