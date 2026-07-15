<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { createPost } from '../api/posts.js'
import PostForm from '../components/post/PostForm.vue'
const route = useRoute(),
  router = useRouter(),
  submitting = ref(false),
  error = ref('')
async function submit(body) {
  submitting.value = true
  error.value = ''
  try {
    const d = await createPost(body)
    router.push({
      path: `/posts/${d.id}`,
      query: { notice: '게시글이 등록되었습니다.' }
    })
  } catch (e) {
    error.value = e.userMessage
  } finally {
    submitting.value = false
  }
}
</script>
<template>
  <div class="page container">
    <div class="page-head">
      <div>
        <h1>새 게시글</h1>
        <p class="muted">서울에 대한 경험과 정보를 공유해 주세요.</p>
      </div>
    </div>
    <p v-if="error" class="card error">{{ error }}</p>
    <PostForm
      :initial-location-id="route.query.locationId"
      :submitting="submitting"
      @submit="submit"
    />
  </div>
</template>
