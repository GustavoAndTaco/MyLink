# [PRD] 마이링크 (MyLink) - 개발자 특화 링크트리 플랫폼

---

## 1. 개요 (Executive Summary)

### 1.1 제품 소개
**마이링크(MyLink)**는 개발자와 테크 크리에이터를 위해 최적화된 올인원 프로필 링크 서비스입니다.  
일반적인 텍스트 링크 나열을 넘어, GitHub 저장소, 잔디(Contributions), 기술 스택 뱃지, 프로젝트 쇼케이스를 한 화면에 매력적으로 담아낼 수 있는 개발자 중심의 링크트리 플랫폼입니다.

### 1.2 단계별 개발 전략 (Phase-by-Phase Approach)
- **1단계 (현재 진행):** 로컬 스토리지(`localStorage`) 기반의 완성도 높은 **프로필 페이지** 집중 구현. (Spotify Dark 테마 및 개발자 특화 블록 렌더링)
- **2단계 (예정):** 블록 추가/수정/삭제 및 순서 변경이 가능한 **관리자 대시보드(CMS)** 및 실시간 모바일 프리뷰 구현.
- **3단계 (예정):** 페이지 뷰 및 링크 클릭 수 추적을 지원하는 **통계/분석(Analytics)** 기능 도입.
- **4단계 (예정):** Supabase 또는 Auth.js를 통한 실제 사용자 인증 및 클라우드 데이터베이스 연동.

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

### 3.3 디자인 시스템 & 테마 (Themes)
- **Spotify Dark (기본 시그니처 테마):**
  - Near Black 배경(`#121212`), Surface(`#181818`), Spotify Green(`#1ed760`) 포인트 컬러
  - Pill(완전 둥근 모서리) 버튼, 50% 원형 아바타 및 컨트롤 버튼
  - 하단 고정 Now-Playing 바 ("Now Coding...", 미니 컨트롤러)
- **테마 확장성:** GitHub Dark, Monokai, Minimal Light 등 추후 확장 가능한 테마 아키텍처

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

---

## 5. 단계별 로드맵 (Roadmap)

### Phase 1: 로컬 스토리지 기반 프로필 페이지 (현재 단계)
- [x] LocalStorage 헬퍼 및 Mock 데이터 구성
- [x] Spotify 감성의 아름다운 개발자 프로필 페이지 구현
- [x] 4대 핵심 블록(일반 링크, GitHub Pinned Repo, 기술 스택, 프로젝트 쇼케이스) 렌더링
- [x] PRD 문서화 (`docs/PRD.md`)

### Phase 2: 관리자 대시보드 (추후 진행)
- [ ] 블록 추가/수정/삭제 및 순서 변경 UI
- [ ] 실시간 모바일 프레임 라이브 프리뷰
- [ ] 프로필 정보 및 테마 변경 에디터

### Phase 3: 방문자 통계 & 백엔드 연동 (추후 진행)
- [ ] 링크 클릭수 및 방문자 수(PV) 집계
- [ ] Supabase / DB 연동 및 사용자 인증
