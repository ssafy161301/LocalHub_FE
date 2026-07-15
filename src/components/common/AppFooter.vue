<template>
  <footer>
    <div class="container foot">
      <div>
        <strong>LocalHub</strong>
        <p>한국관광공사 TourAPI 데이터를 활용한 서울 지역 안내 서비스</p>
      </div>
      <RouterLink to="/data-source">데이터 출처 및 이용 안내 →</RouterLink>
    </div>
  </footer>
</template>
<style scoped>
footer {
  background: #172554;
  color: #dbeafe;
  padding: 36px 0;
}
.foot {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}
.foot p {
  margin: 5px 0 0;
}
@media (max-width: 600px) {
  .foot {
    flex-direction: column;
  }
}
</style>
