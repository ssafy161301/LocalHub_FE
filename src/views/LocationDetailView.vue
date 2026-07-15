<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getLocation } from '../api/locations.js'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import ErrorState from '../components/common/ErrorState.vue'
const route = useRoute(),
  item = ref(),
  loading = ref(true),
  error = ref('')
const fallback =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500"><rect fill="#dbeafe" width="800" height="500"/><text x="400" y="250" text-anchor="middle" font-size="40" fill="#1d4ed8">LocalHub</text></svg>'
  )
async function load() {
  loading.value = true
  error.value = ''
  try {
    item.value = await getLocation(route.params.locationId)
  } catch (e) {
    error.value = e.userMessage
  } finally {
    loading.value = false
  }
}
onMounted(load)
</script>
<template>
  <div class="page container">
    <LoadingSpinner v-if="loading" /><ErrorState v-else-if="error" :message="error" @retry="load" />
    <article v-else class="detail">
      <img
        class="hero-img"
        :src="item.imageUrl || item.thumbnailUrl || fallback"
        :alt="item.title"
      />
      <div class="card">
        <span class="badge">{{ item.categoryName }}</span>
        <h1>{{ item.title }}</h1>
        <p>
          {{ [item.address, item.addressDetail].filter(Boolean).join(' ') || '주소 정보 없음' }}
        </p>
        <dl>
          <template v-if="item.zipcode"
            ><dt>우편번호</dt>
            <dd>{{ item.zipcode }}</dd></template
          ><template v-if="item.telephone"
            ><dt>전화</dt>
            <dd>{{ item.telephone }}</dd></template
          ><template v-if="item.latitude != null && item.longitude != null"
            ><dt>좌표</dt>
            <dd>
              {{ item.latitude }}, {{ item.longitude }} ·
              <a
                target="_blank"
                rel="noopener"
                :href="`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`"
                >지도에서 보기 ↗</a
              >
            </dd></template
          >
        </dl>
        <div class="actions">
          <RouterLink class="btn primary" :to="`/posts/new?locationId=${item.id}`"
            >이 장소 관련 글 쓰기</RouterLink
          ><RouterLink class="btn" to="/locations">목록</RouterLink>
        </div>
      </div>
    </article>
  </div>
</template>
<style scoped>
.detail {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 24px;
}
.hero-img {
  width: 100%;
  height: 100%;
  max-height: 560px;
  object-fit: cover;
  border-radius: var(--radius);
}
h1 {
  margin: 14px 0;
}
dl {
  display: grid;
  grid-template-columns: 90px 1fr;
  margin: 25px 0;
}
dt,
dd {
  padding: 8px 0;
  margin: 0;
  border-bottom: 1px solid var(--border);
}
dt {
  font-weight: 700;
}
a {
  color: var(--primary);
}
@media (max-width: 760px) {
  .detail {
    grid-template-columns: 1fr;
  }
  .hero-img {
    max-height: 350px;
  }
}
</style>
