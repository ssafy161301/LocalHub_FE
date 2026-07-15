<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { getLocations, getLocation } from '../../api/locations.js'
const p = defineProps({
  initial: Object,
  submitting: Boolean,
  submitLabel: { type: String, default: '등록하기' },
  initialLocationId: [String, Number]
})
const emit = defineEmits(['submit'])
const cats = [
  '관광지',
  '문화시설',
  '축제',
  '여행코스',
  '레포츠',
  '숙박',
  '쇼핑',
  '맛집',
  '여행후기',
  '정보공유',
  '질문'
]
const form = reactive({
  category: '여행후기',
  title: '',
  content: '',
  password: '',
  locationId: null
})
const errors = reactive({}),
  query = ref(''),
  results = ref([]),
  searching = ref(false),
  selected = ref(null)
watch(
  () => p.initial,
  (v) => {
    if (v)
      Object.assign(form, {
        category: v.category,
        title: v.title,
        content: v.content,
        locationId: v.location?.id || null
      })
  },
  { immediate: true }
)
onMounted(async () => {
  if (p.initialLocationId && !form.locationId) {
    try {
      selected.value = await getLocation(p.initialLocationId)
      form.locationId = selected.value.id
    } catch {}
  } else if (p.initial?.location) selected.value = p.initial.location
})
async function search() {
  if (!query.value.trim()) return
  searching.value = true
  try {
    results.value = (
      await getLocations({
        page: 1,
        size: 6,
        keyword: query.value.trim(),
        sort: 'title'
      })
    ).items
  } catch {
    results.value = []
  } finally {
    searching.value = false
  }
}
function choose(x) {
  selected.value = x
  form.locationId = x.id
  results.value = []
}
function clear() {
  selected.value = null
  form.locationId = null
}
function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.category || form.category.length > 30) errors.category = '1~30자로 입력해 주세요.'
  if (form.title.trim().length < 2 || form.title.length > 200)
    errors.title = '2~200자로 입력해 주세요.'
  if (form.content.trim().length < 2 || form.content.length > 5000)
    errors.content = '2~5000자로 입력해 주세요.'
  if (form.password.length < 4 || form.password.length > 20)
    errors.password = '4~20자로 입력해 주세요.'
  return !Object.keys(errors).length
}
function submit() {
  if (validate())
    emit('submit', {
      ...form,
      title: form.title.trim(),
      content: form.content.trim()
    })
}
</script>
<template>
  <form class="card form-card grid" @submit.prevent="submit">
    <div class="field">
      <label for="cat">카테고리</label
      ><select id="cat" v-model="form.category">
        <option v-for="c in cats" :key="c">{{ c }}</option></select
      ><span class="error-text">{{ errors.category }}</span>
    </div>
    <div class="field">
      <label for="title">제목</label><input id="title" v-model="form.title" maxlength="200" /><span
        class="error-text"
        >{{ errors.title }}</span
      >
    </div>
    <div class="field">
      <label for="content">내용</label
      ><textarea id="content" v-model="form.content" rows="12" maxlength="5000"></textarea
      ><small class="muted">{{ form.content.length }} / 5000</small
      ><span class="error-text">{{ errors.content }}</span>
    </div>
    <div class="field">
      <label for="password">게시글 비밀번호</label
      ><input
        id="password"
        v-model="form.password"
        type="password"
        minlength="4"
        maxlength="20"
        autocomplete="new-password"
      /><small class="muted">수정·삭제할 때 필요하며 브라우저에 저장하지 않습니다.</small
      ><span class="error-text">{{ errors.password }}</span>
    </div>
    <fieldset>
      <legend>관련 장소 (선택)</legend>
      <div v-if="selected" class="selected">
        <span>📍 {{ selected.title }}</span
        ><button type="button" class="btn" @click="clear">연결 해제</button>
      </div>
      <div v-else class="actions">
        <input
          v-model="query"
          aria-label="장소 검색어"
          placeholder="장소명 검색"
          @keyup.enter.prevent="search"
        /><button type="button" class="btn" :disabled="searching" @click="search">
          {{ searching ? '검색 중' : '검색' }}
        </button>
      </div>
      <button v-for="x in results" :key="x.id" type="button" class="result" @click="choose(x)">
        <strong>{{ x.title }}</strong
        ><small>{{ x.categoryName }} · {{ x.address || '주소 정보 없음' }}</small>
      </button>
    </fieldset>
    <div class="actions">
      <button class="btn primary" :disabled="submitting">
        {{ submitting ? '처리 중…' : submitLabel }}</button
      ><RouterLink class="btn" to="/posts">취소</RouterLink>
    </div>
  </form>
</template>
<style scoped>
fieldset {
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
}
legend {
  font-weight: 700;
}
.actions input {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 9px;
}
.result {
  display: grid;
  text-align: left;
  width: 100%;
  padding: 10px;
  border: 0;
  border-bottom: 1px solid var(--border);
  background: white;
}
.selected {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
