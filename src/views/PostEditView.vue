<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost, updatePost } from '../api/posts.js'
import PostForm from '../components/post/PostForm.vue'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
const route = useRoute(),
  router = useRouter(),
  post = ref(),
  loading = ref(true),
  submitting = ref(false),
  error = ref('')
onMounted(async () => {
  try {
    post.value = await getPost(route.params.postId)
  } catch (e) {
    error.value = e.userMessage
  } finally {
    loading.value = false
  }
})
async function submit(body) {
  submitting.value = true
  error.value = ''
  try {
    await updatePost(route.params.postId, body)
    router.push({
      path: `/posts/${route.params.postId}`,
      query: { notice: '게시글이 수정되었습니다.' }
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
    <h1>게시글 수정</h1>
    <p v-if="error" class="card error">{{ error }}</p>
    <LoadingSpinner v-if="loading" /><PostForm
      v-else-if="post"
      :initial="post"
      :submitting="submitting"
      submit-label="수정하기"
      @submit="submit"
    />
  </div>
</template>
