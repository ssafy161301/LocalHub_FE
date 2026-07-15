<script setup>
defineProps({
  message: { type: String, default: '데이터를 불러오지 못했습니다.' }
})
defineEmits(['retry'])
</script>
<template>
  <div class="state">
    <h3>잠시 문제가 생겼어요</h3>
    <p class="error">{{ message }}</p>
    <button class="btn" @click="$emit('retry')">다시 시도</button>
  </div>
</template>
