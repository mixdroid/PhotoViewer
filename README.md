# Nightframe gallery

A dark, responsive Nuxt gallery backed by Vercel Blob.

Private Blob delivery requires `@vercel/blob` 2.3 or newer because that is the version that provides the `get()` API.

## Run locally

```bash
npm install
cp .env.example .env
# add your BLOB_READ_WRITE_TOKEN to .env
npm run dev
```

Blob files are grouped into albums by the first folder in their pathname. For example:

```text
the-coast/sunrise.jpg
the-coast/tide-pools.jpg
slow-mornings/coffee.jpg
```

The token is used only inside the server routes at `/api/blobs` and `/api/blob`; it is never exposed to the browser. The list route groups files, while the image route securely reads each private Blob and streams it to the gallery. Without a token, the app shows a small sample collection so the UI can still be previewed.

If your Blob files are public, you can use the original `photo.url` directly instead, but private files must be served through the proxy route.
