<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPost, verifyPostPassword, deletePost } from '../api/posts.js'
import LoadingSpinner from '../components/common/LoadingSpinner.vue'
import ErrorState from '../components/common/ErrorState.vue'
const route = useRoute(),
  router = useRouter(),
  post = ref(),
  loading = ref(true),
  error = ref(''),
  modal = ref(''),
  password = ref(''),
  modalError = ref(''),
  working = ref(false)
const date = (v) =>
  v
    ? new Intl.DateTimeFormat('ko-KR', {
        dateStyle: 'long',
        timeStyle: 'short'
      }).format(new Date(v))
    : ''
async function load() {
  loading.value = true
  try {
    post.value = await getPost(route.params.postId)
  } catch (e) {
    error.value = e.userMessage
  } finally {
    loading.value = false
  }
}
function open(type) {
  modal.value = type
  password.value = ''
  modalError.value = ''
}
function close() {
  if (!working.value) modal.value = ''
}
async function confirm() {
  if (password.value.length < 4) {
    modalError.value = '비밀번호를 4자 이상 입력해 주세요.'
    return
  }
  working.value = true
  modalError.value = ''
  try {
    if (modal.value === 'edit') {
      await verifyPostPassword(post.value.id, password.value)
      router.push(`/posts/${post.value.id}/edit`)
    } else {
      await deletePost(post.value.id, password.value)
      router.push({
        path: '/posts',
        query: { notice: '게시글이 삭제되었습니다.' }
      })
    }
  } catch (e) {
    modalError.value = e.userMessage
  } finally {
    working.value = false
  }
}
function esc(e) {
  if (e.key === 'Escape') close()
}
onMounted(load)
</script>
<template>
  <div class="page container">
    <LoadingSpinner v-if="loading" /><ErrorState v-else-if="error" :message="error" @retry="load" />
    <article v-else class="card post">
      <span class="badge">{{ post.category }}</span>
      <h1>{{ post.title }}</h1>
      <p class="muted">
        작성 {{ date(post.createdAt)
        }}<template v-if="post.updatedAt !== post.createdAt">
          · 수정 {{ date(post.updatedAt) }}</template
        >
      </p>
      <div class="content">{{ post.content }}</div>
      <RouterLink v-if="post.location" class="place" :to="`/locations/${post.location.id}`"
        ><strong>📍 {{ post.location.title }}</strong
        ><span
          >{{ post.location.categoryName }} · {{ post.location.address || '주소 정보 없음' }}</span
        ></RouterLink
      >
      <div class="actions">
        <RouterLink class="btn" to="/posts">목록</RouterLink
        ><button class="btn" @click="open('edit')">수정</button
        ><button class="btn danger" @click="open('delete')">삭제</button>
      </div>
    </article>
    <div v-if="modal" class="overlay" @click.self="close" @keydown="esc">
      <div class="card dialog" role="dialog" aria-modal="true">
        <h2>{{ modal === 'edit' ? '수정' : '삭제' }} 비밀번호 확인</h2>
        <div class="field">
          <label for="pw">게시글 비밀번호</label
          ><input
            id="pw"
            v-model="password"
            autofocus
            type="password"
            maxlength="20"
            @keyup.enter="confirm"
          /><span class="error-text">{{ modalError }}</span>
        </div>
        <div class="actions">
          <button class="btn primary" :disabled="working" @click="confirm">확인</button
          ><button class="btn" :disabled="working" @click="close">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.post {
  max-width: 880px;
  margin: auto;
}
.post h1 {
  margin: 14px 0 5px;
}
.content {
  white-space: pre-wrap;
  min-height: 220px;
  padding: 30px 0;
  border-top: 1px solid var(--border);
  margin-top: 25px;
}
.place {
  display: grid;
  background: #eff6ff;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 25px;
}
.overlay {
  position: fixed;
  inset: 0;
  background: #17255499;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
}
.dialog {
  width: min(420px, 100%);
}
.dialog .actions {
  margin-top: 20px;
}
</style>
