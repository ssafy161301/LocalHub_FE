<script setup>
import { ref, nextTick } from 'vue'
import { sendChat } from '../../api/chat.js'
const KEY = 'localhub-chat-history'
const SIZE_KEY = 'localhub-chat-size'
const open = ref(false),
  input = ref(''),
  loading = ref(false),
  error = ref(''),
  panelSize = ref(localStorage.getItem(SIZE_KEY) || 'medium')
let saved = []
try {
  saved = JSON.parse(localStorage.getItem(KEY) || '[]')
} catch {}
const messages = ref(Array.isArray(saved) ? saved.slice(-20) : [])
const box = ref()
const failedRequest = ref(null)
function persist() {
  messages.value = messages.value.slice(-20)
  localStorage.setItem(KEY, JSON.stringify(messages.value))
}
async function submit() {
  const text = input.value.trim()
  if (!text || loading.value) return
  const history = messages.value.map(({ role, content }) => ({ role, content })).slice(-20)
  messages.value.push({ role: 'user', content: text })
  input.value = ''
  await requestAnswer(text, history)
}
async function requestAnswer(message, history) {
  loading.value = true
  error.value = ''
  await nextTick()
  box.value?.scrollTo(0, box.value.scrollHeight)
  try {
    const data = await sendChat({ message, history })
    messages.value.push({
      role: 'assistant',
      content: data.answer,
      references: data.references
    })
    failedRequest.value = null
  } catch (e) {
    error.value = e.userMessage
    failedRequest.value = { message, history }
  } finally {
    loading.value = false
    persist()
    await nextTick()
    box.value?.scrollTo(0, box.value.scrollHeight)
  }
}
async function retry() {
  if (!failedRequest.value || loading.value) return
  const { message, history } = failedRequest.value
  await requestAnswer(message, history)
}
function key(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submit()
  }
}
function reset() {
  messages.value = []
  failedRequest.value = null
  error.value = ''
  localStorage.removeItem(KEY)
}
function setPanelSize(size) {
  panelSize.value = size
  localStorage.setItem(SIZE_KEY, size)
}
</script>
<template>
  <button
    class="float"
    :class="{ opened: open }"
    :aria-label="open ? '서울 안내 챗봇 닫기' : '서울 안내 챗봇 열기'"
    @click="open = !open"
  >
    <span aria-hidden="true">{{ open ? '✕' : '💬' }}</span>
  </button>
  <Transition name="chat-panel">
    <section v-if="open" class="panel" :class="`panel-${panelSize}`" aria-label="서울 안내 챗봇">
      <header>
        <div class="chat-identity">
          <span class="bot-avatar" aria-hidden="true">LH</span>
          <div>
            <strong>서울 AI 안내</strong><small><i></i> 온라인</small>
          </div>
        </div>
        <div class="header-actions">
          <div class="size-options" role="group" aria-label="챗봇 창 크기">
            <button
              v-for="size in ['small', 'medium', 'large']"
              :key="size"
              :class="{ active: panelSize === size }"
              :aria-label="`챗봇 창 ${size === 'small' ? '작게' : size === 'large' ? '크게' : '기본 크기'}`"
              :title="size === 'small' ? '작게' : size === 'large' ? '크게' : '기본 크기'"
              @click="setPanelSize(size)"
            >
              {{ size === 'small' ? '▢' : size === 'large' ? '▣' : '□' }}
            </button>
          </div>
          <button
            class="tool-button reset-button"
            aria-label="대화 초기화"
            title="대화 초기화"
            @click="reset"
          >
            ↻
          </button>
          <button
            class="tool-button close-button"
            aria-label="챗봇 닫기"
            title="닫기"
            @click="open = false"
          >
            ✕
          </button>
        </div>
      </header>
      <div ref="box" class="messages">
        <p v-if="!messages.length" class="welcome">
          서울의 장소와 커뮤니티 글을 바탕으로 안내해 드려요.
        </p>
        <article v-for="(m, i) in messages" :key="i" :class="m.role">
          <p>{{ m.content }}</p>
          <div v-if="m.references" class="refs">
            <RouterLink
              v-for="x in m.references.locations"
              :key="'l' + x.id"
              :to="`/locations/${x.id}`"
              >📍 {{ x.title }}</RouterLink
            ><RouterLink v-for="x in m.references.posts" :key="'p' + x.id" :to="`/posts/${x.id}`"
              >📝 {{ x.title }}</RouterLink
            >
          </div>
        </article>
        <div v-if="loading" class="typing" aria-label="답변을 준비하고 있습니다">
          <i></i><i></i><i></i>
        </div>
        <div v-if="error" class="chat-error">
          <span>{{ error }}</span
          ><button :disabled="loading" @click="retry">다시 시도</button>
        </div>
      </div>
      <div class="composer-wrap">
        <div class="composer">
          <textarea
            v-model="input"
            rows="1"
            maxlength="1000"
            aria-label="메시지"
            placeholder="서울에 대해 물어보세요"
            @keydown="key"
          ></textarea>
          <button
            class="send-button"
            :disabled="loading || !input.trim()"
            aria-label="메시지 전송"
            @click="submit"
          >
            ↑
          </button>
        </div>
        <small>Enter 전송 · Shift+Enter 줄바꿈</small>
      </div>
    </section>
  </Transition>
</template>
<style scoped>
.float {
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 58px;
  height: 58px;
  border: 0;
  border-radius: 50%;
  background: var(--primary);
  font-size: 1.5rem;
  box-shadow: var(--shadow);
  z-index: 80;
  display: grid;
  place-items: center;
  color: white;
  animation: float-breathe 3s ease-in-out infinite;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}
.float::before {
  content: '';
  position: absolute;
  inset: -5px;
  border: 2px solid rgba(37, 99, 235, 0.2);
  border-radius: inherit;
  animation: float-ring 2.4s ease-out infinite;
}
.float:hover {
  transform: translateY(-4px) scale(1.04);
  box-shadow: 0 14px 32px rgba(37, 99, 235, 0.35);
}
.float.opened {
  animation: none;
  background: #1e3a8a;
}
.float.opened::before {
  display: none;
}
@keyframes float-breathe {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
@keyframes float-ring {
  0% {
    opacity: 0.65;
    transform: scale(0.9);
  }
  75%,
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}
.panel {
  position: fixed;
  right: 24px;
  bottom: 94px;
  width: min(390px, calc(100vw - 48px));
  height: min(560px, calc(100vh - 120px));
  max-width: calc(100vw - 48px);
  max-height: calc(100vh - 120px);
  background: white;
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: 0 20px 60px #1e3a8a33;
  z-index: 80;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition:
    width 0.24s ease,
    height 0.24s ease,
    border-radius 0.24s ease;
  font-family: Pretendard, 'Noto Sans KR', system-ui, sans-serif;
  font-size: 0.94rem;
  line-height: 1.55;
  transform-origin: right bottom;
}
.chat-panel-enter-active,
.chat-panel-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.chat-panel-enter-from,
.chat-panel-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}
.panel-small {
  width: min(340px, calc(100vw - 48px));
  height: min(440px, calc(100vh - 120px));
}
.panel-large {
  width: min(620px, calc(100vw - 48px));
  height: min(720px, calc(100vh - 120px));
}
.panel header {
  background: #1e3a8a;
  color: white;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.chat-identity {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}
.chat-identity > div {
  display: grid;
  line-height: 1.25;
}
.chat-identity strong {
  font-size: 0.98rem;
}
.chat-identity small {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #bfdbfe;
  font-size: 0.72rem;
}
.chat-identity small i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ade80;
}
.bot-avatar {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.16);
  font-size: 0.72rem;
  font-weight: 900;
}
.panel header button {
  border: 0;
  background: none;
  color: white;
  border-radius: 6px;
  padding: 5px 7px;
}
.panel header button:hover,
.panel header button:focus-visible,
.panel header button.active {
  background: rgba(255, 255, 255, 0.18);
}
.header-actions,
.size-options {
  display: flex;
  align-items: center;
  gap: 3px;
}
.tool-button {
  width: 32px;
  height: 32px;
  font-size: 1rem;
}
.close-button {
  margin-left: 3px;
}
.size-options {
  padding-right: 7px;
  margin-right: 5px;
  border-right: 1px solid rgba(255, 255, 255, 0.28);
}
.messages {
  flex: 1;
  overflow: auto;
  padding: 15px;
  background: #f5f8ff;
}
.messages article,
.messages > p {
  max-width: 85%;
  padding: 9px 12px;
  border-radius: 5px 16px 16px 16px;
  background: white;
  margin: 8px 0;
}
.messages .user {
  margin-left: auto;
  background: #dbeafe;
  border-radius: 16px 5px 16px 16px;
}
.messages article p {
  margin: 0;
  white-space: pre-wrap;
}
.messages .assistant {
  box-shadow: 0 3px 12px rgba(30, 64, 175, 0.06);
}
.typing {
  display: flex;
  gap: 5px;
  width: fit-content;
  padding: 13px 16px;
  background: white;
  border-radius: 5px 16px 16px 16px;
}
.typing i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #93a4ba;
  animation: typing 1.1s ease-in-out infinite;
}
.typing i:nth-child(2) {
  animation-delay: 0.15s;
}
.typing i:nth-child(3) {
  animation-delay: 0.3s;
}
@keyframes typing {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }
  30% {
    transform: translateY(-4px);
    opacity: 1;
  }
}
.chat-error {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 12px;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.82rem;
}
.chat-error button {
  border: 0;
  background: none;
  color: inherit;
  font-weight: 800;
  white-space: nowrap;
}
.refs {
  display: grid;
  gap: 5px;
  font-size: 0.85rem;
  border-top: 1px solid var(--border);
  padding-top: 8px;
}
.welcome {
  max-width: 100% !important;
}
.composer-wrap {
  padding: 12px 14px 10px;
  border-top: 1px solid var(--border);
  background: white;
}
.composer {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 7px 7px 7px 13px;
  border: 1px solid #cbd5e1;
  border-radius: 18px;
  background: #f8fafc;
  transition:
    border-color 0.18s ease,
    box-shadow 0.18s ease;
}
.composer:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px #dbeafe;
  background: white;
}
.composer textarea {
  flex: 1;
  resize: none;
  max-height: 110px;
  border: 0;
  outline: 0;
  padding: 7px 0;
  background: transparent;
  line-height: 1.45;
}
.send-button {
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  border: 0;
  border-radius: 12px;
  background: var(--primary);
  color: white;
  font-size: 1.25rem;
  font-weight: 800;
  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
}
.send-button:not(:disabled):hover {
  transform: translateY(-2px);
}
.send-button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.composer-wrap > small {
  display: block;
  margin-top: 5px;
  text-align: center;
  color: var(--muted);
  font-size: 0.68rem;
}
@media (prefers-reduced-motion: reduce) {
  .float,
  .float::before,
  .typing i {
    animation: none;
  }
  .chat-panel-enter-active,
  .chat-panel-leave-active,
  .panel {
    transition: none;
  }
}
@media (max-width: 600px) {
  .panel {
    inset: 0;
    width: 100%;
    height: 100%;
    max-height: none;
    border-radius: 0;
    min-width: 0;
    min-height: 0;
    transition: none;
  }
  .size-options {
    display: none;
  }
  .float {
    right: 16px;
    bottom: 16px;
  }
}
</style>
