<script setup>
import { reactive, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLocations, getLocationCategories } from '../api/locations.js'
import LocationCard from '../components/location/LocationCard.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import ErrorState from '../components/common/ErrorState.vue'
import EmptyState from '../components/common/EmptyState.vue'
import Pagination from '../components/common/Pagination.vue'
const PAGE_SIZE = 20
const route = useRoute(),
  router = useRouter(),
  items = ref([]),
  pagination = ref({}),
  categories = ref([]),
  loading = ref(false),
  error = ref('')
const form = reactive({
  category: route.query.category || '',
  keyword: route.query.keyword || '',
  sort: route.query.sort || 'title'
})
let ctrl
async function load() {
  ctrl?.abort()
  ctrl = new AbortController()
  loading.value = true
  error.value = ''
  try {
    const d = await getLocations(
      {
        ...route.query,
        page: Number(route.query.page) || 1,
        size: PAGE_SIZE
      },
      ctrl.signal
    )
    items.value = d.items
    pagination.value = d.pagination
  } catch (e) {
    if (e.code !== 'ERR_CANCELED') error.value = e.userMessage
  } finally {
    loading.value = false
  }
}
function search() {
  router.push({
    query: {
      page: 1,
      size: PAGE_SIZE,
      ...Object.fromEntries(Object.entries(form).filter(([, v]) => v !== ''))
    }
  })
}
function reset() {
  Object.assign(form, {
    category: '',
    keyword: '',
    sort: 'title'
  })
  router.push({ query: { page: 1, sort: 'title', size: PAGE_SIZE } })
}
function page(n) {
  router.push({ query: { ...route.query, page: n, size: PAGE_SIZE } })
}
watch(() => route.fullPath, load)
onMounted(() => {
  load()
  getLocationCategories()
    .then((v) => (categories.value = v))
    .catch(() => {})
})
onUnmounted(() => ctrl?.abort())
</script>
<template>
  <div class="page container">
    <div class="page-head">
      <div>
        <h1>서울 지역정보</h1>
        <p class="muted">서울의 관광지, 문화시설, 숙박과 쇼핑 정보를 찾아보세요.</p>
      </div>
    </div>
    <form class="filters card" @submit.prevent="search">
      <div class="field">
        <label for="lc">카테고리</label
        ><select id="lc" v-model="form.category">
          <option value="">전체</option>
          <option v-for="c in categories" :key="c.name">{{ c.name }}</option>
        </select>
      </div>
      <div class="field wide">
        <label for="lk">검색어</label
        ><input
          id="lk"
          v-model.trim="form.keyword"
          maxlength="100"
          placeholder="장소명 또는 주소"
        />
      </div>
      <div class="field">
        <label for="ls">정렬</label
        ><select id="ls" v-model="form.sort">
          <option value="title">이름순</option>
          <option value="title_desc">이름 역순</option>
          <option value="latest">최근 수정순</option>
        </select>
      </div>
      <div class="actions">
        <button class="btn primary" :disabled="loading">검색</button
        ><button type="button" class="btn" @click="reset">초기화</button>
      </div>
    </form>
    <LoadingSpinner v-if="loading" /><ErrorState
      v-else-if="error"
      :message="error"
      @retry="load"
    /><EmptyState
      v-else-if="!items.length"
      title="검색 결과가 없습니다."
      description="다른 조건으로 검색해 보세요."
    /><template v-else
      ><p class="muted">총 {{ pagination.totalElements?.toLocaleString() }}곳</p>
      <div class="grid grid-3">
        <LocationCard v-for="x in items" :key="x.id" :location="x" />
      </div>
      <Pagination :page="pagination.page" :total-pages="pagination.totalPages" @change="page"
    /></template>
  </div>
</template>
