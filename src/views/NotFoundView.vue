<template>
  <div class="page container">
    <div class="state">
      <strong class="code">404</strong>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p class="muted">주소가 올바른지 확인해 주세요.</p>
      <RouterLink class="btn primary" to="/">홈으로 돌아가기</RouterLink>
    </div>
  </div>
</template>
<style scoped>
.code {
  font-size: 5rem;
  color: var(--primary);
}
</style>
