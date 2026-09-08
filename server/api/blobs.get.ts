import { list } from '@vercel/blob'
import { requireAuth } from '../utils/auth'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const config = useRuntimeConfig()

  if (!config.blobToken) {
    return { albums: [], configured: false }
  }

  try {
    const result = await list({ token: config.blobToken, limit: 1000 })
    const grouped = new Map<string, typeof result.blobs>()

    for (const blob of result.blobs) {
      if (!blob.pathname.match(/\.(jpe?g|png|webp|gif|avif)$/i)) continue
      const parts = blob.pathname.split('/').filter(Boolean)
      const album = parts.length > 1 ? parts[0] : 'All photos'
      if (!grouped.has(album)) grouped.set(album, [])
      grouped.get(album)!.push(blob)
    }

    const albums = [...grouped.entries()].map(([slug, photos]) => ({
      slug,
      title: slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
      // Private Blob URLs cannot be loaded directly by the browser. Serve them
      // through our authenticated server-side image route instead.
      photos: photos.map((photo) => ({
        url: `/api/blob?pathname=${encodeURIComponent(photo.pathname)}`,
        pathname: photo.pathname,
      })),
    }))

    return { albums, configured: true }
  } catch (error) {
    console.error('Unable to list Vercel Blob files', error)
    throw createError({ statusCode: 502, statusMessage: 'Unable to reach Vercel Blob' })
  }
})
