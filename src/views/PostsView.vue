<script setup>
import { reactive, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPosts } from '../api/posts.js'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import ErrorState from '../components/common/ErrorState.vue'
import EmptyState from '../components/common/EmptyState.vue'
import Pagination from '../components/common/Pagination.vue'
const route = useRoute(),
  router = useRouter(),
  items = ref([]),
  pagination = ref({}),
  loading = ref(false),
  error = ref('')
const cats = [
  '관광지',
  '문화시설',
  '축제',
  '여행코스',
  '레포츠',
  '숙박',
  '쇼핑',
  '맛집',
  '여행후기',
  '정보공유',
  '질문'
]
const form = reactive({
  category: route.query.category || '',
  searchType: route.query.searchType || 'all',
  keyword: route.query.keyword || '',
  sort: route.query.sort || 'latest'
})
let ctrl
const date = (v) =>
  v
    ? new Intl.DateTimeFormat('ko-KR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(v))
    : ''
async function load() {
  ctrl?.abort()
  ctrl = new AbortController()
  loading.value = true
  error.value = ''
  try {
    const d = await getPosts(
      { ...route.query, page: Number(route.query.page) || 1, size: 10 },
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
      ...Object.fromEntries(Object.entries(form).filter(([, v]) => v))
    }
  })
}
function reset() {
  Object.assign(form, {
    category: '',
    searchType: 'all',
    keyword: '',
    sort: 'latest'
  })
  router.push({ query: { page: 1 } })
}
watch(() => route.fullPath, load)
onMounted(load)
onUnmounted(() => ctrl?.abort())
</script>
<template>
  <div class="page container">
    <div class="page-head">
      <div>
        <h1>LocalHub 커뮤니티</h1>
        <p class="muted">서울 경험과 유용한 정보를 자유롭게 나눠보세요.</p>
      </div>
      <RouterLink class="btn primary" to="/posts/new">글쓰기</RouterLink>
    </div>
    <form class="filters community-filters card" @submit.prevent="search">
      <div class="field">
        <label for="pc">카테고리</label
        ><select id="pc" v-model="form.category">
          <option value="">전체</option>
          <option v-for="c in cats" :key="c">{{ c }}</option>
        </select>
      </div>
      <div class="field">
        <label for="pt">검색 대상</label
        ><select id="pt" v-model="form.searchType">
          <option value="all">제목+내용</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>
      </div>
      <div class="field wide">
        <label for="pk">검색어</label><input id="pk" v-model.trim="form.keyword" maxlength="100" />
      </div>
      <div class="field">
        <label for="ps">정렬</label
        ><select id="ps" v-model="form.sort">
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
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
    /><EmptyState v-else-if="!items.length" title="아직 게시글이 없습니다."
      ><RouterLink class="btn primary" to="/posts/new">첫 글 쓰기</RouterLink></EmptyState
    >
    <div v-else class="card">
      <RouterLink v-for="x in items" :key="x.id" class="post-row" :to="`/posts/${x.id}`"
        ><div>
          <span class="badge">{{ x.category }}</span>
        </div>
        <div>
          <strong>{{ x.title }}</strong>
          <p class="muted">{{ x.contentPreview }}</p>
          <small v-if="x.location">📍 {{ x.location.title }}</small>
        </div>
        <time>{{ date(x.createdAt) }}</time></RouterLink
      ><Pagination
        :page="pagination.page"
        :total-pages="pagination.totalPages"
        @change="(n) => router.push({ query: { ...route.query, page: n } })"
      />
    </div>
  </div>
</template>

<style scoped>
.community-filters {
  grid-template-columns:
    minmax(130px, 1fr)
    minmax(130px, 1fr)
    minmax(240px, 2fr)
    minmax(130px, 1fr);
}

.community-filters .wide {
  grid-column: auto;
}

@media (max-width: 960px) {
  .community-filters {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .community-filters .wide {
    grid-column: 1 / -1;
  }
}

@media (max-width: 640px) {
  .community-filters {
    grid-template-columns: minmax(0, 1fr);
  }

  .community-filters .wide {
    grid-column: auto;
  }
}
</style>
