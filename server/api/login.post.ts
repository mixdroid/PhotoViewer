import { createSession, SESSION_COOKIE } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{ username?: string; password?: string }>(event)

  if (!config.authUsername || !config.authPassword || !config.authSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Login is not configured' })
  }

  if (body?.username !== config.authUsername || body?.password !== config.authPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid username or password' })
  }

  setCookie(event, SESSION_COOKIE, createSession(config.authUsername, config.authSecret), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  return { authenticated: true }
})
