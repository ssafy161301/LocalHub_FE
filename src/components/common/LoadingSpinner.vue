<template>
  <div class="state" role="status">
    <div class="spinner"></div>
    <p>불러오는 중입니다.</p>
  </div>
</template>
<style scoped>
.spinner {
  width: 36px;
  height: 36px;
  margin: 0 auto 12px;
  border: 4px solid #dbeafe;
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
