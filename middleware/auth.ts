export default defineNuxtRouteMiddleware(async (to) => {
  const requestFetch = useRequestFetch()
  const session = await requestFetch<{ authenticated: boolean }>('/api/auth/session').catch(() => ({ authenticated: false }))

  if (!session.authenticated) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }
})
