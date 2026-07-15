<script setup>
import { ref, onMounted } from 'vue'
import { getLocationCategories } from '../api/locations.js'
import { getPosts } from '../api/posts.js'
import { getDataSource } from '../api/dataSource.js'
const categories = ref([]),
  posts = ref([]),
  source = ref(),
  errors = ref({})
const date = (v) => new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium' }).format(new Date(v))
onMounted(() => {
  getLocationCategories()
    .then((v) => (categories.value = v))
    .catch((e) => (errors.value.c = e.userMessage))
  getPosts({ page: 1, size: 5, sort: 'latest' })
    .then((v) => (posts.value = v.items))
    .catch((e) => (errors.value.p = e.userMessage))
  getDataSource()
    .then((v) => (source.value = v))
    .catch((e) => (errors.value.s = e.userMessage))
})
</script>
<template>
  <section class="hero">
    <div class="container hero-inner">
      <div>
        <span class="eyebrow">SEOUL LOCAL DISCOVERY</span>
        <h1>서울의 오늘을<br /><em>가깝게 발견하세요</em></h1>
        <p>관광정보부터 현지 커뮤니티 이야기까지, LocalHub에서 한 번에 만나보세요.</p>
        <div class="actions">
          <RouterLink class="btn primary" to="/locations">지역정보 둘러보기</RouterLink
          ><RouterLink class="btn" to="/posts">커뮤니티 참여하기</RouterLink>
        </div>
      </div>
      <div class="seoul">
        SEOUL<br /><small>37.5665° N<br />126.9780° E</small>
      </div>
    </div>
  </section>
  <section class="page container">
    <div class="section-head">
      <div>
        <span class="eyebrow">EXPLORE</span>
        <h2>카테고리로 둘러보기</h2>
      </div>
      <RouterLink to="/locations">전체 보기 →</RouterLink>
    </div>
    <p v-if="errors.c" class="error">{{ errors.c }}</p>
    <div class="category-grid">
      <RouterLink
        v-for="(c, i) in categories"
        :key="c.name"
        :to="{ path: '/locations', query: { category: c.name } }"
        ><b>0{{ i + 1 }}</b
        ><strong>{{ c.name }}</strong
        ><span>{{ c.count.toLocaleString() }}곳</span></RouterLink
      >
    </div>
    <div class="stats-call card">
      <div>
        <strong>{{ categories.reduce((s, c) => s + c.count, 0).toLocaleString() }}</strong
        ><span>서울 지역정보</span>
      </div>
      <p>신뢰할 수 있는 공공데이터를 한눈에 확인하세요.</p>
      <RouterLink class="btn primary" to="/statistics">통계 보기</RouterLink>
    </div>
    <div class="section-head posts-head">
      <div>
        <span class="eyebrow">COMMUNITY</span>
        <h2>최근 이야기</h2>
      </div>
      <RouterLink to="/posts">전체 글 보기 →</RouterLink>
    </div>
    <p v-if="errors.p" class="error">{{ errors.p }}</p>
    <div v-else class="card recent">
      <RouterLink v-for="x in posts" :key="x.id" :to="`/posts/${x.id}`"
        ><span class="badge">{{ x.category }}</span
        ><strong>{{ x.title }}</strong
        ><time>{{ date(x.createdAt) }}</time></RouterLink
      >
      <p v-if="!posts.length" class="muted">아직 등록된 게시글이 없습니다.</p>
    </div>
    <div v-if="source" class="source">
      <span>DATA SOURCE</span>
      <p>{{ source.attributionText }}</p>
      <RouterLink to="/data-source">자세히 보기 →</RouterLink>
    </div>
  </section>
</template>
<style scoped>
.hero {
  background: linear-gradient(120deg, #eff6ff 55%, #dbeafe);
  overflow: hidden;
}
.hero-inner {
  min-height: 510px;
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  align-items: center;
}
.hero h1 {
  font-size: clamp(2.6rem, 6vw, 5rem);
  line-height: 1.05;
  letter-spacing: -0.06em;
  margin: 15px 0 24px;
}
.hero em {
  color: var(--primary);
  font-style: normal;
}
.hero p {
  max-width: 550px;
  font-size: 1.1rem;
}
.eyebrow {
  color: var(--primary);
  font-weight: 800;
  letter-spacing: 0.15em;
  font-size: 0.78rem;
}
.seoul {
  font-weight: 900;
  font-size: clamp(4rem, 10vw, 8rem);
  line-height: 0.8;
  color: #bfdbfe;
  transform: rotate(-5deg);
}
.seoul small {
  font-size: 1rem;
  line-height: 1.5;
  color: #3b82f6;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 22px;
}
.section-head h2 {
  font-size: 2rem;
  margin: 5px 0 0;
}
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.category-grid a {
  background: white;
  border: 1px solid var(--border);
  padding: 20px;
  border-radius: 12px;
  display: grid;
  min-width: 0;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}
.category-grid a:hover {
  transform: translateY(-3px);
  border-color: #93c5fd;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.12);
}
.category-grid b {
  color: #93c5fd;
}
.category-grid strong {
  font-size: 1.1rem;
  margin-top: 22px;
}
.category-grid span {
  color: var(--muted);
}
.stats-call {
  margin: 50px 0;
  display: flex;
  align-items: center;
  gap: 25px;
  background: #1e3a8a;
  color: #fff;
}
.stats-call div {
  display: grid;
}
.stats-call strong {
  font-size: 2.5rem;
}
.stats-call p {
  flex: 1;
  margin: 0;
}
.posts-head {
  margin-top: 55px;
}
.recent > a {
  display: grid;
  grid-template-columns: minmax(80px, auto) minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 16px 12px;
  border-bottom: 1px solid var(--border);
  min-width: 0;
  border-radius: 8px;
  transition: background-color 0.18s ease;
}
.recent > a:hover {
  background: #f8faff;
}
.recent > a > * {
  min-width: 0;
}
.recent > a .badge {
  justify-self: start;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.recent > a strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.recent > a time {
  color: var(--muted);
  font-size: 0.9rem;
  white-space: nowrap;
}
.recent > a:last-of-type {
  border-bottom: 0;
}
.source {
  margin-top: 55px;
  border-top: 1px solid var(--border);
  padding-top: 30px;
  display: flex;
  align-items: center;
  gap: 25px;
}
.source p {
  flex: 1;
  margin: 0;
}
@media (max-width: 900px) {
  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .hero-inner {
    grid-template-columns: 1fr;
    min-height: 560px;
    padding: 60px 0;
  }
  .seoul {
    display: none;
  }
  .category-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .category-grid a {
    padding: 15px;
  }
  .stats-call,
  .source {
    align-items: flex-start;
    flex-direction: column;
  }
  .recent > a {
    grid-template-columns: 1fr;
    gap: 7px;
    padding: 16px 8px;
  }
  .recent > a strong {
    white-space: normal;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }
}
</style>
