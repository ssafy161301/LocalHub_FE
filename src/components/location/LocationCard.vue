<script setup>
defineProps({ location: Object })
const fallback =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect fill="#dbeafe" width="800" height="500"/><path fill="#93c5fd" d="M0 400l190-170 130 110 150-160 330 280v40H0z"/><text x="400" y="110" text-anchor="middle" font-size="35" fill="#1d4ed8">LocalHub</text></svg>'
  )
</script>
<template>
  <RouterLink class="card item" :to="`/locations/${location.id}`"
    ><img
      class="location-img"
      :src="location.thumbnailUrl || fallback"
      :alt="location.title"
      @error="$event.target.src = fallback"
    />
    <div>
      <span class="badge">{{ location.categoryName }}</span>
      <h3>{{ location.title }}</h3>
      <p class="muted">{{ location.address || '주소 정보 없음' }}</p>
    </div></RouterLink
  >
</template>
<style scoped>
.item {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
}
.item:hover {
  transform: translateY(-4px);
  border-color: #93c5fd;
  box-shadow: 0 14px 34px rgba(37, 99, 235, 0.16);
}
.item:focus-visible {
  outline: 3px solid #bfdbfe;
  outline-offset: 3px;
}
.item .location-img {
  flex: 0 0 auto;
  border-radius: var(--radius) var(--radius) 0 0;
}
.item > div {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  padding: 20px;
}
h3 {
  width: 100%;
  margin: 14px 0 5px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
.muted {
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
@media (max-width: 640px) {
  .item > div {
    padding: 16px;
  }
}
</style>
