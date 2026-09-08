<script setup lang="ts">
definePageMeta({ middleware: "auth" });

type Photo = { url: string; pathname: string };
type Album = { slug: string; title: string; photos: Photo[] };

const { data, pending, error } = await useFetch<{
  albums: Album[];
  configured: boolean;
}>("/api/blobs");

const albums = computed(() =>
  data.value?.albums?.length ? data.value.albums : []
);
const totalPhotos = computed(() =>
  albums.value.reduce((total, album) => total + album.photos.length, 0)
);
</script>

<template>
  <main class="shell">
    <header class="topbar">
      <NuxtLink to="/" class="brand"
        ><span class="brand-mark">✦</span> NIGHTFRAME</NuxtLink
      >
      <div class="topbar-meta">
        <span class="status-dot" />
        <span>{{
          data?.configured ? "Connected" : "Demo collection"
        }}</span>
        <button class="logout-button" @click="$fetch('/api/logout', { method: 'POST' }).then(() => navigateTo('/login'))">SIGN OUT</button>
      </div>
    </header>

    <!-- <section class="hero">
      <p class="eyebrow">PERSONAL ARCHIVE <span>✳</span> {{ String(totalPhotos).padStart(2, '0') }} FRAMES</p>
      <h1>A quiet place for<br /><em>your favorite frames.</em></h1>
      <p class="hero-copy">A visual diary of the places, faces, and tiny moments<br class="desktop-only" /> that make a life feel like yours.</p>
    </section> -->

    <section class="collection-head">
      <div>
        <p class="section-kicker">THE COLLECTION</p>
        <h2>Albums</h2>
      </div>
      <span class="album-count"
        >{{ String(albums.length).padStart(2, "0") }} ALBUMS</span
      >
    </section>

    <div v-if="pending" class="loading">
      Finding your frames<span>...</span>
    </div>
    <div v-else class="album-grid">
      <NuxtLink
        v-for="album in albums"
        :key="album.slug"
        :to="`/album/${album.slug}`"
        class="album-card"
      >
        <div class="album-cover">
          <img
            :src="album.photos[0]?.url"
            :alt="`${album.title} album cover`"
            loading="lazy"
          /><span class="view-arrow">↗</span>
        </div>
        <div class="card-info">
          <div>
            <h3>{{ album.title }}</h3>
            <p>
              {{ album.photos.length }}
              {{ album.photos.length === 1 ? "photo" : "photos" }}
            </p>
          </div>
          <span class="card-index">{{
            String(albums.indexOf(album) + 1).padStart(2, "0")
          }}</span>
        </div>
      </NuxtLink>
    </div>
    <p v-if="error" class="notice">
      Blob is not configured yet — showing a sample collection.
    </p>
    <footer>
      <!-- <span>© {{ new Date().getFullYear() }} NIGHTFRAME</span
      ><span>MADE FOR THE MOMENTS IN BETWEEN</span> -->
    </footer>
  </main>
</template>
