<script setup>
import { ref } from 'vue'
const open = ref(false)
</script>
<template>
  <header class="header">
    <div class="container nav">
      <RouterLink class="logo" to="/">Local<span>Hub</span></RouterLink
      ><button class="menu" aria-label="메뉴 열기" @click="open = !open">☰</button>
      <nav :class="{ open }">
        <RouterLink to="/" @click="open = false">홈</RouterLink
        ><RouterLink to="/locations" @click="open = false">서울 지역정보</RouterLink
        ><RouterLink to="/posts" @click="open = false">커뮤니티</RouterLink
        ><RouterLink to="/statistics" @click="open = false">통계</RouterLink>
      </nav>
    </div>
  </header>
</template>
<style scoped>
.header {
  height: 68px;
  background: #fff;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
}
.nav {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-size: 1.45rem;
  font-weight: 900;
}
.logo span {
  color: var(--primary);
}
nav {
  display: flex;
  gap: 28px;
  font-weight: 700;
}
nav a.router-link-active {
  color: var(--primary);
}
.menu {
  display: none;
  border: 0;
  background: none;
  font-size: 1.5rem;
}
@media (max-width: 700px) {
  .menu {
    display: block;
  }
  nav {
    display: none;
    position: absolute;
    top: 68px;
    left: 0;
    right: 0;
    background: #fff;
    padding: 20px 16px;
    box-shadow: var(--shadow);
    flex-direction: column;
  }
  nav.open {
    display: flex;
  }
}
</style>
