# LocalHub Frontend

서울 지역정보, 익명 커뮤니티, 카테고리 통계와 AI 안내 챗봇을 제공하는 Vue 3 프론트엔드입니다. FastAPI 백엔드의 실제 계약은 [API_DOCS.md](./API_DOCS.md)를 따릅니다.

## 주요 기능

- 서울 지역정보 검색·카테고리/이미지 필터·정렬·페이지네이션 및 상세 조회
- 게시글 검색·작성·조회·비밀번호 검증·전체 수정·삭제
- 목록 검색 조건과 URL 쿼리 동기화
- Chart.js 기반 지역정보 막대그래프 및 게시글 도넛 차트
- 최근 대화 20개를 유지하는 플로팅 AI 챗봇과 문맥·의도 기반 장소/게시글 참고 링크(서버는 최근 8개로 생략된 조건 복원)
- 한국관광공사 데이터 출처·라이선스 표시
- 로딩·빈 결과·API 오류·제출 중 상태와 반응형 레이아웃

게시글 비밀번호는 브라우저 저장소에 저장하지 않습니다. 챗봇 기록만 `localhub-chat-history` 키로 `localStorage`에 최대 20개 저장합니다.

## 기술 스택

- Vue 3 Composition API와 `<script setup>`
- Vite, Vue Router, Axios
- Chart.js, vue-chartjs
- 반응형 CSS

## 실행

Node.js가 설치된 환경에서 다음 명령을 실행합니다.

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

PowerShell 실행 정책으로 `npm.ps1` 실행이 차단된 경우 `npm.cmd install`, `npm.cmd run dev`를 사용할 수 있습니다. 기본 개발 주소는 `http://localhost:5173`입니다.

## 환경변수

`.env.example`을 `.env`로 복사한 후 백엔드 주소를 지정합니다.

```env
VITE_API_BASE_URL=http://localhost:8000
```

값을 생략하면 `http://localhost:8000`을 사용합니다. 배포 시에는 FastAPI의 `ALLOWED_ORIGINS`에도 프론트엔드 Origin을 등록해야 합니다.

## 빌드

```powershell
npm run build
npm run preview
```

빌드 결과는 `dist/`에 생성됩니다. 배포 서버는 Vue Router의 history 모드를 위해 알려지지 않은 경로를 `index.html`로 fallback하도록 설정해야 합니다.

## 라우트

| 경로                     | 화면                 |
| ------------------------ | -------------------- |
| `/`                      | 홈                   |
| `/locations`             | 지역정보 목록·검색   |
| `/locations/:locationId` | 지역정보 상세        |
| `/posts`                 | 게시글 목록·검색     |
| `/posts/new`             | 게시글 작성          |
| `/posts/:postId`         | 게시글 상세          |
| `/posts/:postId/edit`    | 게시글 수정          |
| `/statistics`            | 카테고리 통계        |
| `/data-source`           | 데이터 출처·라이선스 |

## 백엔드 연동 확인

FastAPI를 `http://localhost:8000`에서 먼저 실행한 다음 프론트엔드를 실행하세요. 챗봇은 백엔드에 유효한 `OPENAI_API_KEY`가 있어야 정상 응답하며, 키가 없으면 백엔드의 `CHAT_PROVIDER_ERROR` 안내를 표시합니다.
