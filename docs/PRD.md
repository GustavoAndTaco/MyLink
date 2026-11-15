# [PRD] 마이링크 (MyLink) - 개발자 특화 링크트리 플랫폼

---

## 1. 개요 (Executive Summary)

### 1.1 제품 소개
**마이링크(MyLink)**는 개발자와 테크 크리에이터를 위해 최적화된 올인원 프로필 링크 서비스입니다.  
일반적인 텍스트 링크 나열을 넘어, GitHub 저장소, 잔디(Contributions), 기술 스택 뱃지, 프로젝트 쇼케이스를 한 화면에 매력적으로 담아낼 수 있는 개발자 중심의 링크트리 플랫폼입니다.

### 1.2 단계별 개발 전략 (Phase-by-Phase Approach)
- **1단계 (현재 집중 단계):** 방문자에게 보여지는 **링크 목록 페이지(프로필 & 링크 목록 뷰)** 단일 화면 집중 완성.
  - 불필요한 관리자 화면이나 복잡한 설정 화면을 배제하고, 개발자 특화 링크 10종을 매력적으로 선보이는 단일 페이지(Single Page Profile & Link Showcase)의 심미성과 완성도 극대화.
  - Tailwind CSS v4 토큰 기반으로 모든 스타일을 통일하고 일관된 테마 경험 제공.
- **2단계 (예정):** 블록 추가/수정/삭제 및 순서 변경이 가능한 **관리자 대시보드(CMS)** 및 실시간 모바일 프리뷰 구현.
- **3단계 (예정):** 페이지 뷰 및 링크 클릭 수 추적을 지원하는 **통계/분석(Analytics)** 기능 도입.
- **4단계 (예정):** Supabase 또는 Auth.js를 통한 실제 사용자 인증 및 클라우드 데이터베이스 연동.

### 1.3 핵심 기술 스택 (Tech Stack)
- **Framework:** Next.js (App Router, v16+)
- **Core Library:** React 19
- **Styling & Design System:** Tailwind CSS v4, shadcn/ui (Base UI / Radix primitives, Lucide React)
- **Type Safety & Utilities:** TypeScript, Class Variance Authority (CVA), `cn` (clsx + tailwind-merge)
- **State & Storage:** Web Storage API (localStorage)
- **Backend / Analytics (준비):** Firebase JS SDK (`src/lib/Firebase.ts`, `.env.local` 환경변수 기반 API 키 관리)

---

## 2. 타깃 고객 및 사용자 페르소나

1. **주니어 및 취업/이직 준비 개발자:** 이력서, 포트폴리오, 깃허브, 블로그를 하나의 감각적인 링크로 전달하고 싶은 구직자
2. **테크 크리에이터 및 오픈소스 기여자:** 기술 블로그(Velog, Tistory), 오픈소스 라이브러리, 유튜브, 강의 링크를 한곳에 모으고 싶은 엔지니어
3. **현업 시니어/프리랜서 엔지니어:** 커리어 히스토리 및 외주/협업 제안 링크를 커피챗과 함께 안내하고 싶은 개발자

---

## 3. 핵심 기능 요구사항 (Functional Requirements)

### 3.1 로컬 스토리지 기반 프로필 데이터 (Profile Storage)
- **FR-1.1 LocalStorage 읽기/쓰기:**
  - 브라우저 로컬 스토리지(`mylink_profile_data`)에서 프로필 데이터와 블록 목록을 불러와 렌더링
  - 최초 방문 시 완성도 높은 개발자 기본 Mock 데이터를 로컬 스토리지에 자동 초기화하여 즉시 표시
- **FR-1.2 프로필 정보 구성:**
  - 닉네임(Username), 표시 이름(Full Name), 직무/역할(Role), 한 줄 소개(Bio)
  - 아바타/아이콘 및 인증된 개발자(Verified Developer) 배지
  - 커밋 수, 레포지토리 수, Uptime 등 개발자 메트릭 정보

### 3.2 개발자 특화 콘텐츠 블록 (Developer Blocks)
- **FR-2.1 일반 링크 카드 (URL Link):**
  - 제목, 설명, 링크 URL, 아이콘/이모지, 뱃지
- **FR-2.2 GitHub 블록 (GitHub Integration):**
  - **Pinned Repo 카드:** 저장소 이름, 설명, Star 수, Fork 수, 언어 색상 도트 표시
- **FR-2.3 기술 스택 뱃지 클러스터 (Tech Stack Badges):**
  - TypeScript, Next.js, React, Tailwind CSS 등 주요 기술 스택 태그 클러스터
- **FR-2.4 프로젝트 쇼케이스 카드 (Project Showcase):**
  - 프로젝트 제목, 서브텍스트, 태그 목록, [Live Demo] 및 [GitHub Code] 링크 버튼
- **FR-2.5 소셜 아이콘 바 (Social Links):**
  - GitHub, Velog/Blog, LinkedIn, Email 등의 바로가기 링크
- **FR-2.6 링크 추가 다이얼로그 (Add Link Dialog):**
  - 링크 목록 하단 "링크 추가하기" 버튼 클릭 시 다이얼로그(모달) 팝업
  - 블록 유형 선택 (일반 링크 / GitHub 저장소 / 기술 스택 / 프로젝트) — 타입 전환 시 하위 필드 동적 렌더링
  - 타입별 입력 검증 (클라이언트 사이드):
    - 공통: 제목(필수·2~80자), 설명(120자 이하), 뱃지(20자 이하)
    - `link`: URL 필수, `https://` 형식 검증
    - `github_repo`: 저장소 URL 필수, 저장소 이름 `user/repo` 형식 검증, Star·Fork 숫자 검증, HEX 색상 검증
    - `tech_stack`: 쉼표 구분 목록 필수, 최소 1개·최대 20개 제한, 실시간 뱃지 미리보기
    - `project`: Live Demo URL 또는 GitHub URL 중 하나 필수, URL 형식 검증
  - 에러 필드 하이라이트 + 제출 후 에러 요약 카운트 표시
  - 추가 완료 시 **Firestore(`users/anonymous/links`)에 `createdAt`과 함께 저장** 및 최신순 목록 즉시 갱신
- **FR-2.7 링크 수정 / 삭제 / 커서 드래그 순서 변경:**
  - 각 링크 카드 우측 상단 미니 툴바를 통한 수정(모달 재활용) 및 즉시 삭제 (`users/anonymous/links/{id}` 동기화)
  - 좌측 드래그 핸들(`GripVertical`) 및 커서 드래그 앤 드롭(`SortableLinkWrapper`)을 통한 링크 위치 이동 및 Firestore 일괄(`writeBatch`) 순서 저장

### 3.3 디자인 시스템 & 테마 (Design System & Themes)
- **Tailwind CSS v4 기반 스타일 시스템 통일:**
  - CSS 파일 내 `@theme inline` 블록을 활용하여 Spotify 시그니처 테마 컬러 팔레트를 정식 테마 토큰으로 등록:
    - `--color-spotify-black: #121212` (배경)
    - `--color-spotify-surface: #181818` (기본 카드 서피스)
    - `--color-spotify-elevated: #242424` (카드 호버/인터랙션)
    - `--color-spotify-green: #1ed760` (시그니처 포인트 그린)
    - `--color-spotify-green-hover: #1fdf64` (버튼 호버)
    - `--color-spotify-subtext: #b3b3b3` (보조 텍스트)
    - `--color-spotify-border: #282828` (경계선)
    - `--color-spotify-border-hover: #3e3e3e` (경계선 호버)
  - 파편화된 arbitrary value(`[#121212]`, `[#1ed760]` 등) 사용을 엄격히 배제하고, `bg-spotify-black`, `bg-spotify-surface`, `text-spotify-green` 등의 시멘틱 유틸리티 클래스로 통일.
- **아이콘 시스템 통일:**
  - `lucide-react` 및 커스텀 SVG(GitHub, LinkedIn) 기반의 일관된 고품질 벡터 아이콘 체계 구축.
- **컴포넌트 아키텍처 (Component Architecture):**
  - 단일 페이지 내 관심사를 분리한 모듈식 컴포넌트 아키텍처 채택:
    - `ProfileHeader`: 아바타, 실시간 펄스 효과의 Verified 배지, 개발자 메트릭(Commits, Repos, Uptime), Contact 버튼, 소셜 링크 바 (**음악 재생/일시정지 버튼 및 Now Playing 바 제외**)
    - `LinkCard`: 일반 링크 블록 (Notion, 블로그, 강연, 커피챗, 뉴스레터 등) + 호버 애니메이션
    - `GitHubRepoCard`: GitHub Pinned Repo 카드 (Star, Fork, 언어 도트, 모노스페이스 폰트)
    - `TechStackCard`: 주력 기술 스택 태그 클러스터 (인터랙티브 뱃지)
    - `ProjectCard`: 프로덕션 프로젝트 쇼케이스 (태그 목록, Live Demo 및 GitHub Code 듀얼 액션)
    - `AddLinkDialog`: 타입별 필드 분기 및 클라이언트 유효성 검사를 포함한 링크 추가/수정 겸용 다이얼로그
    - `SortableLinkWrapper`: 커서 드래그 앤 드롭 순서 변경 및 수정/삭제 액션 툴바 래퍼
    - ~~`NowPlayingBar`~~: **제거됨** — 링크트리 페이지의 목적과 맞지 않는 Spotify 음악 재생 UI 요소 배제
- **테마 확장성:** 기본 Spotify Dark 외 GitHub Dark, Monokai, Minimal Light 등 다중 테마 확장 구조 유지.

---

## 4. 데이터 모델 (LocalStorage Schema)

```typescript
// LocalStorage Key: "mylink_profile_data"
export interface ProfileData {
  user: {
    username: string;
    fullName: string;
    role: string;
    bio: string;
    avatar: string;
    verified: boolean;
    monthlyCommits: number;
    reposCount: number;
    uptime: string;
  };
  theme: "spotify-dark" | "github-dark" | "monokai" | "minimal-light";
  socialLinks: {
    github?: string;
    blog?: string;
    email?: string;
    linkedin?: string;
  };
  blocks: BlockItem[];
}

export interface BlockItem {
  id: string;
  type: "link" | "github_repo" | "tech_stack" | "project";
  title: string;
  subtitle?: string;
  url?: string;
  icon?: string;
  badge?: string;
  pinnedRepo?: {
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    languageColor: string;
  };
  techStack?: string[];
  project?: {
    demoUrl?: string;
    githubUrl?: string;
    tags: string[];
  };
  isActive: boolean;
}
```

### 4.2 기본 링크 목록 더미 데이터셋 명세 (Default Mock Link Dataset)
초기 방문 시 또는 로컬 스토리지 초기화 시 자동으로 렌더링되는 10종의 개발자 특화 링크 더미 데이터셋입니다.

| ID | 구분 | 블록 유형(type) | 주요 제목 및 내용 | 뱃지 / 메타데이터 | 목적 및 용도 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **block-1** | 커리어 | `link` | **Interactive Resume & Portfolio**<br>2026 최신 경력기술서 및 프로젝트 상세 아카이브 (Notion) | `Featured` / 📄 | 노션 포트폴리오 및 공식 이력서 링크 |
| **block-2** | 깃허브 | `github_repo` | **developer/mylink-platform**<br>Spotify 디자인 시스템 감성의 개발자 맞춤형 오픈소스 링크트리 | `Open Source`<br>⭐ 1,420 · 🍴 184 | 대표 핀 저장소 및 스타 수 쇼케이스 |
| **block-3** | 기술스택 | `tech_stack` | **Core Tech Stack & Specialties**<br>TypeScript, Next.js 16, React 19, Tailwind v4, shadcn/ui 등 10개 스택 | `Core Skills` / ⚡ | 주력 기술 스택 뱃지 클러스터 |
| **block-4** | 프로젝트 | `project` | **PulseFlow - 실시간 AI 모니터링 SaaS**<br>대규모 분산 서버 메트릭 수집 및 이상 징후 실시간 감지 AI 플랫폼 | `Production`<br>#Next.js 16 #Tailwind v4 | 라이브 데모 & 깃허브 코드 동시 제공 |
| **block-5** | 아티클 | `link` | **기술 블로그: Next.js 16과 React 19 아키텍처 회고**<br>Server Actions, Partial Prerendering 및 성능 최적화 가이드 | `Trending` / ✍️ | 벨로그/미디엄 기술 아티클 링크 |
| **block-6** | 프로젝트 | `project` | **CodeLens AI - GitHub PR 자동 리뷰 봇**<br>AST 정적 분석 및 LLM 기반의 시큐리티 취약점 진단 GitHub 액션 | `v1.4.0`<br>#TypeScript #LangChain | 오픈소스 AI 프로젝트 쇼케이스 |
| **block-7** | 깃허브 | `github_repo` | **developer/tailwind-spotify-preset**<br>다크 모드와 고대비 미니멀 디자인을 위한 Spotify 테마 프리셋 | `NPM Package`<br>⭐ 642 · 🍴 58 | 배포된 오픈소스 테마 라이브러리 |
| **block-8** | 강연/미디어 | `link` | **DevConf 2026 발표: 디자인 시스템 확장 전략**<br>일관된 UI 토큰 설계와 접근성 높은 컴포넌트 라이브러리 구축 사례 | `Speaker` / 🎙️ | 컨퍼런스 세션 및 유튜브 발표 영상 |
| **block-9** | 네트워킹 | `link` | **1:1 커피챗 & 커리어 멘토링 신청**<br>주니어 개발자 이직/커리어 패스, 코드 리뷰 및 가벼운 커피챗 | `CoffeeChat` / ☕ | 외부 네트워킹/멘토링 유입 링크 |
| **block-10** | 뉴스레터 | `link` | **Weekly Tech Digest 뉴스레터**<br>매주 월요일 발행되는 풀스택 엔지니어링 & 시스템 디자인 큐레이션 | `Substack` / 📬 | 개발자 개인 브랜딩 뉴스레터 구독 |

### 4.3 카테고리별 샘플 템플릿 프리셋 (Sample Templates Preset)
향후 관리자 대시보드(CMS)에서 사용자가 원하는 링크를 손쉽게 추가하거나 프리셋으로 가져올 수 있도록 제공하는 카테고리별 샘플 목록입니다.
- **커리어 & 포트폴리오**: 노션 포트폴리오, Google Drive PDF 이력서, 1:1 커피챗 예약
- **콘텐츠 & 아티클**: Velog 기술 블로그, Medium 영문 테크 칼럼, 유튜브 개발 채널
- **오픈소스 & 깃허브**: Next.js Agent Starter Kit, NPM 패키지 레지스트리 링크

---

## 5. 단계별 로드맵 (Roadmap)

### Phase 1: 링크 목록 페이지 집중 구현 (완료)
- [x] LocalStorage 헬퍼 및 Mock 데이터 구성
- [x] 10종의 개발자 특화 링크 목록 더미 데이터 및 카테고리별 샘플 템플릿 작성 (`src/lib/mockData.ts`)
- [x] Tailwind CSS v4 테마 토큰(`--color-spotify-*`) 기반 스타일링 통일
- [x] 모듈식 컴포넌트 아키텍처 분리 (`ProfileHeader`, `LinkCard`, `GitHubRepoCard`, `TechStackCard`, `ProjectCard`, `AddLinkDialog`)
- [x] 4대 핵심 블록(일반 링크, GitHub Pinned Repo, 기술 스택, 프로젝트 쇼케이스) UI 고도화
- [x] Lucide React 및 커스텀 SVG 기반 통일된 아이콘 시스템 적용
- [x] 반응형 및 모바일 최적화 레이아웃 완성
- [x] 음악 재생/일시정지 버튼 및 하단 Now Playing 바 제거 (링크트리 목적에 부합하지 않는 UI 배제)
- [x] 링크 추가 다이얼로그(`AddLinkDialog`) 구현 — 타입별 필드 분기, 클라이언트 유효성 검사, localStorage 즉시 저장
- [x] PRD 문서화 반영 (`docs/PRD.md`)

### Phase 2: 관리자 대시보드 (추후 진행)
- [ ] shadcn/ui 컴포넌트(Form, Dialog, Dropdown, Tabs 등)를 활용한 관리자 대시보드 구축
- [ ] 블록 추가/수정/삭제 및 순서 변경 UI
- [ ] 실시간 모바일 프레임 라이브 프리뷰
- [ ] 프로필 정보 및 테마 변경 에디터

### Phase 3: 방문자 통계 & 백엔드 연동 (진행 중)
- [x] Firebase SDK 설치 및 환경변수 기반 초기화 설정 (`src/lib/Firebase.ts`, `.env.local`)
- [x] Firestore(`users/anonymous/links`) 마이그레이션 — 페이지 로드 시 `createdAt` 기준 최신순 조회, 추가 시 저장 및 목록 갱신 (`src/lib/firestoreLinks.ts`)
- [x] 링크 수정 / 삭제 및 커서 드래그 앤 드롭 순서 변경 기능 구현 (`SortableLinkWrapper`)
- [ ] 링크 클릭수 및 방문자 수(PV) 집계
- [ ] 사용자 인증 연동 (`anonymous` → 로그인 사용자 UID 전환)
