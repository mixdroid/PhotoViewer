<script setup lang="ts">
definePageMeta({ middleware: "auth" });

type Photo = { url: string; pathname: string };
type Album = { slug: string; title: string; photos: Photo[] };
const route = useRoute();
const { data } = await useFetch<{ albums: Album[] }>("/api/blobs");

const album = computed(
  () =>
    data.value?.albums?.find((item) => item.slug === route.params.slug) ||
    []
);
const activePhoto = ref<Photo | null>(null);
useHead(() => ({
  title: album.value
    ? `${album.value.title} — Nightframe`
    : "Album — Nightframe",
}));
function closeOnEscape(event: KeyboardEvent) {
  if (event.key === "Escape") activePhoto.value = null;
}
onMounted(() => window.addEventListener("keydown", closeOnEscape));
onUnmounted(() => window.removeEventListener("keydown", closeOnEscape));
</script>

<template>
  <main v-if="album" class="shell album-page">
    <header class="topbar">
      <NuxtLink to="/" class="brand"
        ><span class="brand-mark">✦</span> NIGHTFRAME</NuxtLink
      ><NuxtLink to="/" class="back-link">← ALL ALBUMS</NuxtLink>
      <button class="logout-button" @click="$fetch('/api/logout', { method: 'POST' }).then(() => navigateTo('/login'))">SIGN OUT</button>
    </header>
    <section class="album-hero">
      <div>
        <p class="eyebrow">
          ALBUM <span>✳</span>
          {{ String(album.photos.length).padStart(2, "0") }} Photos
        </p>
        <h1>{{ album.title }}</h1>
      </div>
    </section>
    <div class="photo-grid">
      <button
        v-for="(photo, index) in album.photos"
        :key="photo.url"
        class="photo-card"
        @click="activePhoto = photo"
      >
        <img
          :src="photo.url"
          :alt="`${album.title} photo ${index + 1}`"
          loading="lazy"
        /><span>{{ String(index + 1).padStart(2, "0") }}</span>
      </button>
    </div>
    <footer>
      <span>© {{ new Date().getFullYear() }} NIGHTFRAME</span
      ><span>ESC TO CLOSE</span>
    </footer>
    <Teleport to="body"
      ><Transition name="fade"
        ><div
          v-if="activePhoto"
          class="lightbox"
          role="dialog"
          aria-modal="true"
          @click.self="activePhoto = null"
        >
          <button
            class="close-button"
            aria-label="Close image"
            @click="activePhoto = null"
          >
            ×</button
          ><img
            :src="activePhoto.url"
            alt="Expanded gallery image"
          /></div></Transition
    ></Teleport>
  </main>
  <main v-else class="shell empty">
    <NuxtLink to="/" class="brand">← BACK HOME</NuxtLink>
    <h1>Album not found.</h1>
  </main>
</template>
