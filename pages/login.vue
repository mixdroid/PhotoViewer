<script setup lang="ts">
const route = useRoute()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

useHead({ title: 'Sign in — Nightframe' })

async function login() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    await $fetch('/api/login', { method: 'POST', body: { username: username.value, password: password.value } })
    await navigateTo(typeof route.query.redirect === 'string' ? route.query.redirect : '/')
  } catch (error: any) {
    errorMessage.value = error?.data?.statusMessage || 'Unable to sign in. Check your details.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="login-shell">
    <div class="login-card">
      <NuxtLink to="/" class="brand"><span class="brand-mark">✦</span> NIGHTFRAME</NuxtLink>
      <div class="login-heading"><p class="eyebrow">PRIVATE ARCHIVE <span>✳</span></p><h1>Welcome<br /><em>back.</em></h1><p>Sign in to enter your collection.</p></div>
      <form class="login-form" @submit.prevent="login">
        <label>Username<input v-model="username" name="username" autocomplete="username" required /></label>
        <label>Password<input v-model="password" name="password" type="password" autocomplete="current-password" required /></label>
        <p v-if="errorMessage" class="login-error">{{ errorMessage }}</p>
        <button class="login-button" type="submit" :disabled="isSubmitting">{{ isSubmitting ? 'SIGNING IN…' : 'ENTER ARCHIVE ↗' }}</button>
      </form>
    </div>
    <p class="login-footer">YOUR MOMENTS, KEPT CLOSE.</p>
  </main>
</template>
