<script setup>
import AppHeader from './components/common/AppHeader.vue'
import AppFooter from './components/common/AppFooter.vue'
import ChatFloatingButton from './components/chat/ChatFloatingButton.vue'
</script>
<template>
  <AppHeader />
  <main><RouterView :key="$route.fullPath" /></main>
  <AppFooter /><ChatFloatingButton />
</template>
