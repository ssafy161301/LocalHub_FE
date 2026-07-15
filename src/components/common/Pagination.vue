<script setup>
import { computed } from 'vue'
const p = defineProps({ page: Number, totalPages: Number })
defineEmits(['change'])
const pages = computed(() => {
  const a = Math.max(1, p.page - 2),
    b = Math.min(p.totalPages, a + 4)
  return Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i)
})
</script>
<template>
  <nav v-if="totalPages > 1" class="pagination" aria-label="페이지">
    <button :disabled="page <= 1" @click="$emit('change', page - 1)">‹</button
    ><button
      v-for="n in pages"
      :key="n"
      :class="{ active: n === page }"
      @click="$emit('change', n)"
    >
      {{ n }}</button
    ><button :disabled="page >= totalPages" @click="$emit('change', page + 1)">›</button>
  </nav>
</template>
