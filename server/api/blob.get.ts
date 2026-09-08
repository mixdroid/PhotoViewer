import { get } from '@vercel/blob'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const pathname = getQuery(event).pathname

  if (typeof pathname !== 'string' || !pathname) {
    throw createError({ statusCode: 400, statusMessage: 'Missing pathname' })
  }

  if (!config.blobToken) {
    throw createError({ statusCode: 500, statusMessage: 'BLOB_READ_WRITE_TOKEN is not configured' })
  }

  const result = await get(pathname, {
    access: 'private',
    token: config.blobToken,
  })

  if (result === null || result.statusCode !== 200) {
    throw createError({ statusCode: 404, statusMessage: 'Blob not found' })
  }

  return new Response(result.stream, {
    headers: {
      'Cache-Control': 'private, no-cache',
      'Content-Type': result.blob.contentType || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
    },
  })
})
