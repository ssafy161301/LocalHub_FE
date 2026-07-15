<script setup>
import { ref, onMounted } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { getLocationStatistics, getPostStatistics } from '../api/statistics.js'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import ErrorState from '../components/common/ErrorState.vue'
ChartJS.register(Title, Tooltip, Legend, BarElement, ArcElement, CategoryScale, LinearScale)
const loc = ref(),
  post = ref(),
  loading = ref(true),
  error = ref('')
const colors = [
  '#2563eb',
  '#3b82f6',
  '#60a5fa',
  '#1d4ed8',
  '#1e40af',
  '#38bdf8',
  '#6366f1',
  '#818cf8',
  '#0ea5e9',
  '#93c5fd'
]
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom' } }
}
function chart(d) {
  return {
    labels: d.labels,
    datasets: d.datasets.map((x, i) => ({
      ...x,
      backgroundColor:
        d.chartType === 'bar' ? '#2563eb' : d.labels.map((_, j) => colors[(i + j) % colors.length]),
      borderRadius: 6
    }))
  }
}
async function load() {
  loading.value = true
  error.value = ''
  try {
    ;[loc.value, post.value] = await Promise.all([getLocationStatistics(), getPostStatistics()])
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
    <div class="page-head">
      <div>
        <h1>LocalHub 통계</h1>
        <p class="muted">서울 지역정보와 커뮤니티 현황을 살펴보세요.</p>
      </div>
    </div>
    <LoadingSpinner v-if="loading" /><ErrorState v-else-if="error" :message="error" @retry="load" />
    <div v-else class="grid charts">
      <section class="card">
        <div class="metric">
          <span>{{ loc.title }}</span
          ><strong>{{ loc.total.toLocaleString() }}</strong
          ><small>전체 데이터</small>
        </div>
        <div class="chart"><Bar :data="chart(loc)" :options="options" /></div>
      </section>
      <section class="card">
        <div class="metric">
          <span>{{ post.title }}</span
          ><strong>{{ post.total.toLocaleString() }}</strong
          ><small>전체 게시글</small>
        </div>
        <div v-if="post.total" class="chart">
          <Doughnut :data="chart(post)" :options="options" />
        </div>
        <div v-else class="state">아직 집계할 게시글이 없습니다.</div>
      </section>
    </div>
  </div>
</template>
<style scoped>
.charts {
  grid-template-columns: 1fr 1fr;
}
.metric {
  display: grid;
}
.metric strong {
  font-size: 2.4rem;
  color: var(--primary);
}
.chart {
  height: 380px;
  margin-top: 20px;
  min-width: 0;
  position: relative;
}
@media (max-width: 850px) {
  .charts {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 520px) {
  .chart {
    height: 300px;
  }
}
</style>
