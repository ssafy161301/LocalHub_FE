<script setup>
defineProps({
  title: { type: String, default: '표시할 내용이 없습니다.' },
  description: String
})
</script>
<template>
  <div class="state">
    <h3>{{ title }}</h3>
    <p v-if="description" class="muted">{{ description }}</p>
    <slot />
  </div>
</template>
