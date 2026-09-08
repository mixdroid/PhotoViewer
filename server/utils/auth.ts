import { createHmac, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

export const SESSION_COOKIE = 'nightframe_session'

function digest(value: string, secret: string) {
  return createHmac('sha256', secret).update(value).digest('hex')
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}

export function createSession(username: string, secret: string) {
  return `${username}.${digest(username, secret)}`
}

export function isAuthenticated(event: H3Event) {
  const config = useRuntimeConfig()
  const session = getCookie(event, SESSION_COOKIE)
  if (!session || !config.authSecret || !config.authUsername) return false

  const separator = session.lastIndexOf('.')
  if (separator < 1) return false

  const username = session.slice(0, separator)
  const signature = session.slice(separator + 1)
  return username === config.authUsername && safeEqual(signature, digest(username, config.authSecret))
}

export function requireAuth(event: H3Event) {
  if (!isAuthenticated(event)) {
    throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  }
}
