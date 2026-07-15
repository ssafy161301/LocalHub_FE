<script setup>
import { ref, onMounted } from 'vue'
import { getDataSource } from '../api/dataSource.js'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import ErrorState from '../components/common/ErrorState.vue'
const data = ref(),
  loading = ref(true),
  error = ref('')
async function load() {
  try {
    data.value = await getDataSource()
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
    <h1>데이터 출처</h1>
    <p class="muted">LocalHub가 사용하는 공공데이터와 이용 조건입니다.</p>
    <LoadingSpinner v-if="loading" /><ErrorState v-else-if="error" :message="error" @retry="load" />
    <article v-else class="card source-card">
      <span class="badge">{{ data.region }}</span>
      <h2>{{ data.datasetName }}</h2>
      <dl>
        <dt>제공기관</dt>
        <dd>{{ data.provider }}</dd>
        <dt>전체 데이터</dt>
        <dd>{{ data.totalCount.toLocaleString() }}건</dd>
        <dt>라이선스</dt>
        <dd>{{ data.license.name }}</dd>
        <dt>출처 표시</dt>
        <dd>{{ data.license.attributionRequired ? '필수' : '불필요' }}</dd>
        <dt>상업적 이용</dt>
        <dd>{{ data.license.commercialUseAllowed ? '가능' : '불가' }}</dd>
        <dt>변경</dt>
        <dd>{{ data.license.modificationAllowed ? '가능' : '불가' }}</dd>
      </dl>
      <p class="notice">{{ data.attributionText }}</p>
      <a class="btn primary" :href="data.sourceUrl" target="_blank" rel="noopener noreferrer"
        >원본 데이터 보기 ↗</a
      >
    </article>
  </div>
</template>
<style scoped>
.source-card {
  max-width: 800px;
  margin-top: 30px;
}
dl {
  display: grid;
  grid-template-columns: 140px 1fr;
  min-width: 0;
}
dt,
dd {
  padding: 13px;
  margin: 0;
  border-bottom: 1px solid var(--border);
}
dt {
  font-weight: 700;
}
.notice {
  background: #eff6ff;
  padding: 18px;
  border-radius: 10px;
  margin: 25px 0;
}
@media (max-width: 560px) {
  dl {
    grid-template-columns: 1fr;
  }
  dt {
    padding-bottom: 2px;
    border-bottom: 0;
  }
  dd {
    padding-top: 2px;
  }
}
</style>
