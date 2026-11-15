"use client";

import { useState, useCallback } from "react";
import { BlockItem, BlockType } from "@/types";
import { X, Plus, Pencil, Link2, FolderGit2, Cpu, Rocket, AlertCircle, CheckCircle2 } from "lucide-react";

// ──────────────────────────────────────────────
// 유효성 검사 헬퍼
// ──────────────────────────────────────────────
function isValidUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

type FormErrors = Partial<Record<string, string>>;

// ──────────────────────────────────────────────
// 블록 타입 메타 정보
// ──────────────────────────────────────────────
const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    type: "link",
    label: "일반 링크",
    icon: <Link2 className="w-4 h-4" />,
    desc: "블로그, 포트폴리오, SNS 등 일반 URL",
  },
  {
    type: "github_repo",
    label: "GitHub 저장소",
    icon: <FolderGit2 className="w-4 h-4" />,
    desc: "GitHub 핀 저장소 카드",
  },
  {
    type: "tech_stack",
    label: "기술 스택",
    icon: <Cpu className="w-4 h-4" />,
    desc: "주력 기술 스택 뱃지 클러스터",
  },
  {
    type: "project",
    label: "프로젝트",
    icon: <Rocket className="w-4 h-4" />,
    desc: "라이브 데모 / GitHub Code 쇼케이스",
  },
];

// ──────────────────────────────────────────────
// 초기 폼 상태
// ──────────────────────────────────────────────
const INITIAL_FORM = {
  type: "link" as BlockType,
  title: "",
  subtitle: "",
  url: "",
  icon: "",
  badge: "",
  // github_repo
  repoName: "",
  repoDesc: "",
  repoStars: "",
  repoForks: "",
  repoLang: "",
  repoLangColor: "#3178c6",
  // tech_stack
  techStackRaw: "", // comma-separated
  // project
  demoUrl: "",
  githubUrl: "",
  tagsRaw: "", // comma-separated
};

type FormState = typeof INITIAL_FORM;

// ──────────────────────────────────────────────
// 유효성 검사
// ──────────────────────────────────────────────
function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  // 공통 필수 필드
  if (!form.title.trim()) {
    errors.title = "제목은 필수입니다.";
  } else if (form.title.trim().length < 2) {
    errors.title = "제목은 최소 2자 이상이어야 합니다.";
  } else if (form.title.trim().length > 80) {
    errors.title = "제목은 80자 이하이어야 합니다.";
  }

  if (form.subtitle && form.subtitle.length > 120) {
    errors.subtitle = "설명은 120자 이하이어야 합니다.";
  }

  if (form.badge && form.badge.length > 20) {
    errors.badge = "뱃지 텍스트는 20자 이하이어야 합니다.";
  }

  // 타입별 필드 검증
  if (form.type === "link") {
    if (!form.url.trim()) {
      errors.url = "URL은 필수입니다.";
    } else if (!isValidUrl(form.url.trim())) {
      errors.url = "올바른 URL 형식이 아닙니다. (https://로 시작)";
    }
  }

  if (form.type === "github_repo") {
    if (!form.url.trim()) {
      errors.url = "GitHub 저장소 URL은 필수입니다.";
    } else if (!isValidUrl(form.url.trim())) {
      errors.url = "올바른 URL 형식이 아닙니다. (https://로 시작)";
    }
    if (!form.repoName.trim()) {
      errors.repoName = "저장소 이름은 필수입니다. (예: user/repo)";
    } else if (!/^[\w.-]+\/[\w.-]+$/.test(form.repoName.trim())) {
      errors.repoName = "올바른 형식이 아닙니다. (예: user/repo)";
    }
    if (form.repoStars && isNaN(Number(form.repoStars))) {
      errors.repoStars = "숫자를 입력해주세요.";
    }
    if (form.repoForks && isNaN(Number(form.repoForks))) {
      errors.repoForks = "숫자를 입력해주세요.";
    }
    if (!form.repoLangColor.match(/^#[0-9a-fA-F]{3,6}$/)) {
      errors.repoLangColor = "올바른 HEX 색상 코드를 입력해주세요. (예: #3178c6)";
    }
  }

  if (form.type === "tech_stack") {
    if (!form.techStackRaw.trim()) {
      errors.techStackRaw = "기술 스택을 최소 1개 입력해주세요.";
    } else {
      const items = form.techStackRaw.split(",").map((s) => s.trim()).filter(Boolean);
      if (items.length === 0) {
        errors.techStackRaw = "유효한 기술 스택이 없습니다.";
      } else if (items.length > 20) {
        errors.techStackRaw = "기술 스택은 최대 20개까지 입력 가능합니다.";
      }
    }
  }

  if (form.type === "project") {
    if (!form.demoUrl.trim() && !form.githubUrl.trim()) {
      errors.demoUrl = "Live Demo URL 또는 GitHub URL 중 하나는 필수입니다.";
    }
    if (form.demoUrl.trim() && !isValidUrl(form.demoUrl.trim())) {
      errors.demoUrl = "올바른 URL 형식이 아닙니다. (https://로 시작)";
    }
    if (form.githubUrl.trim() && !isValidUrl(form.githubUrl.trim())) {
      errors.githubUrl = "올바른 URL 형식이 아닙니다. (https://로 시작)";
    }
  }

  return errors;
}

// ──────────────────────────────────────────────
// BlockItem -> FormState 변환 (수정 모드용)
// ──────────────────────────────────────────────
function blockToForm(block: BlockItem): FormState {
  return {
    type: block.type,
    title: block.title || "",
    subtitle: block.subtitle || "",
    url: block.url || "",
    icon: block.icon || "",
    badge: block.badge || "",
    repoName: block.pinnedRepo?.name || "",
    repoDesc: block.pinnedRepo?.description || "",
    repoStars: block.pinnedRepo?.stars !== undefined ? String(block.pinnedRepo.stars) : "",
    repoForks: block.pinnedRepo?.forks !== undefined ? String(block.pinnedRepo.forks) : "",
    repoLang: block.pinnedRepo?.language || "",
    repoLangColor: block.pinnedRepo?.languageColor || "#3178c6",
    techStackRaw: block.techStack ? block.techStack.join(", ") : "",
    demoUrl: block.project?.demoUrl || "",
    githubUrl: block.project?.githubUrl || "",
    tagsRaw: block.project?.tags ? block.project.tags.join(", ") : "",
  };
}

// ──────────────────────────────────────────────
// BlockItem 빌더
// ──────────────────────────────────────────────
function hasUrlChanged(form: FormState, existing?: BlockItem | null): boolean {
  if (!existing) return false;

  if (form.type === "link" || form.type === "github_repo") {
    return (existing.url ?? "").trim() !== form.url.trim();
  }

  if (form.type === "project") {
    const prevDemo = (existing.project?.demoUrl ?? "").trim();
    const prevGithub = (existing.project?.githubUrl ?? "").trim();
    return prevDemo !== form.demoUrl.trim() || prevGithub !== form.githubUrl.trim();
  }

  return false;
}

function buildBlock(form: FormState, existing?: BlockItem | null): BlockItem {
  const id = existing?.id || `block-${Date.now()}`;
  const shouldResetClicks = hasUrlChanged(form, existing);
  const clickCount = shouldResetClicks ? 0 : (existing?.clickCount ?? 0);

  const base = {
    id,
    type: form.type,
    title: form.title.trim(),
    subtitle: form.subtitle.trim() || undefined,
    icon: form.icon.trim() || undefined,
    badge: form.badge.trim() || undefined,
    createdAt: existing?.createdAt ?? Date.now(),
    order: existing?.order,
    clickCount,
    isActive: existing?.isActive ?? true,
  };

  if (form.type === "link") {
    return { ...base, url: form.url.trim() };
  }

  if (form.type === "github_repo") {
    return {
      ...base,
      url: form.url.trim(),
      pinnedRepo: {
        name: form.repoName.trim(),
        description: form.repoDesc.trim(),
        stars: Number(form.repoStars) || 0,
        forks: Number(form.repoForks) || 0,
        language: form.repoLang.trim() || "TypeScript",
        languageColor: form.repoLangColor.trim(),
      },
    };
  }

  if (form.type === "tech_stack") {
    return {
      ...base,
      techStack: form.techStackRaw.split(",").map((s) => s.trim()).filter(Boolean),
    };
  }

  // project
  return {
    ...base,
    project: {
      demoUrl: form.demoUrl.trim() || undefined,
      githubUrl: form.githubUrl.trim() || undefined,
      tags: form.tagsRaw.split(",").map((s) => s.trim()).filter(Boolean),
    },
  };
}

// ──────────────────────────────────────────────
// 공통 Input 컴포넌트
// ──────────────────────────────────────────────
function Field({
  label,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-zinc-300">
        {label}
        {required && <span className="text-spotify-green ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-[11px] text-zinc-500">{hint}</p>}
      {error && (
        <p className="text-[11px] text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  hasError,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hasError?: boolean;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-zinc-900 border rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-spotify-green/60 focus:ring-1 focus:ring-spotify-green/30 ${
        hasError ? "border-red-500/70" : "border-zinc-700/80 hover:border-zinc-600"
      }`}
    />
  );
}

// ──────────────────────────────────────────────
// 메인 다이얼로그 컴포넌트
// ──────────────────────────────────────────────
interface AddLinkDialogProps {
  isOpen: boolean;
  editingBlock?: BlockItem | null;
  onClose: () => void;
  onAdd: (block: BlockItem) => void;
  onUpdate?: (block: BlockItem) => void;
}

export default function AddLinkDialog({
  isOpen,
  editingBlock,
  onClose,
  onAdd,
  onUpdate,
}: AddLinkDialogProps) {
  const isEditMode = !!editingBlock;
  const [form, setForm] = useState<FormState>(() =>
    editingBlock ? blockToForm(editingBlock) : INITIAL_FORM
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const set = useCallback((key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // 실시간 에러 클리어 (해당 필드)
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }, [errors]);

  const handleTypeChange = (type: BlockType) => {
    setForm((prev) => ({
      ...INITIAL_FORM,
      type,
      title: prev.title,
      subtitle: prev.subtitle,
      icon: prev.icon,
      badge: prev.badge,
    }));
    setErrors({});
    setSubmitted(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const newErrors = validate(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const built = buildBlock(form, editingBlock);
    if (isEditMode && onUpdate) {
      onUpdate(built);
    } else {
      onAdd(built);
    }
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
    onClose();
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    // 오버레이
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={isEditMode ? "링크 수정" : "링크 추가"}
    >
      {/* 배경 Dim */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* 다이얼로그 패널 */}
      <div className="relative z-10 w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-spotify-green/15 border border-spotify-green/30 flex items-center justify-center">
              {isEditMode ? (
                <Pencil className="w-3.5 h-3.5 text-spotify-green" />
              ) : (
                <Plus className="w-4 h-4 text-spotify-green" />
              )}
            </div>
            <h2 className="text-base font-bold text-white">
              {isEditMode ? "링크 수정" : "링크 추가"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
            aria-label="닫기"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        {/* 스크롤 가능 본문 */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* 블록 타입 선택 */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-300">
              블록 유형<span className="text-spotify-green ml-0.5">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_TYPES.map((bt) => (
                <button
                  key={bt.type}
                  type="button"
                  onClick={() => handleTypeChange(bt.type)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    form.type === bt.type
                      ? "border-spotify-green/60 bg-spotify-green/8 text-white"
                      : "border-zinc-700/80 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  <span
                    className={`shrink-0 ${form.type === bt.type ? "text-spotify-green" : "text-zinc-500"}`}
                  >
                    {bt.icon}
                  </span>
                  <div>
                    <div className="text-xs font-semibold leading-tight">{bt.label}</div>
                    <div className="text-[10px] text-zinc-500 leading-tight mt-0.5">{bt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 구분선 */}
          <hr className="border-zinc-800" />

          {/* ── 공통 필드 ── */}
          <Field label="제목" required error={errors.title}>
            <Input
              value={form.title}
              onChange={(v) => set("title", v)}
              placeholder="예: 기술 블로그 — Next.js 아키텍처 회고"
              hasError={!!errors.title}
            />
          </Field>

          <Field
            label="설명 (부제목)"
            error={errors.subtitle}
            hint="링크 카드 하단에 표시되는 짧은 설명"
          >
            <Input
              value={form.subtitle}
              onChange={(v) => set("subtitle", v)}
              placeholder="예: Server Actions와 성능 최적화 가이드 (Velog)"
              hasError={!!errors.subtitle}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="아이콘 (이모지)" hint="선택 사항">
              <Input
                value={form.icon}
                onChange={(v) => set("icon", v)}
                placeholder="✍️"
                hasError={false}
              />
            </Field>
            <Field label="뱃지 텍스트" error={errors.badge} hint="예: Trending, New">
              <Input
                value={form.badge}
                onChange={(v) => set("badge", v)}
                placeholder="Trending"
                hasError={!!errors.badge}
              />
            </Field>
          </div>

          {/* ── 타입별 추가 필드 ── */}

          {/* link */}
          {form.type === "link" && (
            <Field label="URL" required error={errors.url}>
              <Input
                value={form.url}
                onChange={(v) => set("url", v)}
                placeholder="https://velog.io/@developer/article"
                hasError={!!errors.url}
              />
            </Field>
          )}

          {/* github_repo */}
          {form.type === "github_repo" && (
            <>
              <Field label="저장소 URL" required error={errors.url}>
                <Input
                  value={form.url}
                  onChange={(v) => set("url", v)}
                  placeholder="https://github.com/user/repo"
                  hasError={!!errors.url}
                />
              </Field>
              <Field
                label="저장소 이름"
                required
                error={errors.repoName}
                hint="user/repo 형식으로 입력"
              >
                <Input
                  value={form.repoName}
                  onChange={(v) => set("repoName", v)}
                  placeholder="developer/mylink-platform"
                  hasError={!!errors.repoName}
                />
              </Field>
              <Field label="저장소 설명">
                <Input
                  value={form.repoDesc}
                  onChange={(v) => set("repoDesc", v)}
                  placeholder="Spotify 감성의 개발자 링크트리 플랫폼"
                  hasError={false}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="⭐ Star 수" error={errors.repoStars}>
                  <Input
                    value={form.repoStars}
                    onChange={(v) => set("repoStars", v)}
                    placeholder="1420"
                    hasError={!!errors.repoStars}
                  />
                </Field>
                <Field label="🍴 Fork 수" error={errors.repoForks}>
                  <Input
                    value={form.repoForks}
                    onChange={(v) => set("repoForks", v)}
                    placeholder="184"
                    hasError={!!errors.repoForks}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="주요 언어">
                  <Input
                    value={form.repoLang}
                    onChange={(v) => set("repoLang", v)}
                    placeholder="TypeScript"
                    hasError={false}
                  />
                </Field>
                <Field label="언어 색상 (HEX)" error={errors.repoLangColor}>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={form.repoLangColor}
                      onChange={(v) => set("repoLangColor", v)}
                      placeholder="#3178c6"
                      hasError={!!errors.repoLangColor}
                    />
                    {form.repoLangColor.match(/^#[0-9a-fA-F]{3,6}$/) && (
                      <span
                        className="w-6 h-6 rounded-full border border-zinc-700 shrink-0"
                        style={{ backgroundColor: form.repoLangColor }}
                      />
                    )}
                  </div>
                </Field>
              </div>
            </>
          )}

          {/* tech_stack */}
          {form.type === "tech_stack" && (
            <Field
              label="기술 스택 목록"
              required
              error={errors.techStackRaw}
              hint="쉼표(,)로 구분하여 입력 · 최대 20개"
            >
              <textarea
                value={form.techStackRaw}
                onChange={(e) => set("techStackRaw", e.target.value)}
                placeholder="TypeScript, Next.js 16, React 19, Tailwind CSS v4, shadcn/ui"
                rows={3}
                className={`w-full bg-zinc-900 border rounded-lg px-3 py-2 text-sm text-white placeholder:text-zinc-600 outline-none resize-none transition-colors focus:border-spotify-green/60 focus:ring-1 focus:ring-spotify-green/30 ${
                  errors.techStackRaw ? "border-red-500/70" : "border-zinc-700/80 hover:border-zinc-600"
                }`}
              />
              {/* 미리보기 */}
              {form.techStackRaw && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.techStackRaw
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700"
                      >
                        {item}
                      </span>
                    ))}
                </div>
              )}
            </Field>
          )}

          {/* project */}
          {form.type === "project" && (
            <>
              <Field
                label="Live Demo URL"
                error={errors.demoUrl}
                hint="Live Demo 또는 GitHub URL 중 하나는 필수"
              >
                <Input
                  value={form.demoUrl}
                  onChange={(v) => set("demoUrl", v)}
                  placeholder="https://my-project.vercel.app/demo"
                  hasError={!!errors.demoUrl}
                />
              </Field>
              <Field label="GitHub URL" error={errors.githubUrl}>
                <Input
                  value={form.githubUrl}
                  onChange={(v) => set("githubUrl", v)}
                  placeholder="https://github.com/user/my-project"
                  hasError={!!errors.githubUrl}
                />
              </Field>
              <Field
                label="태그"
                hint="쉼표(,)로 구분하여 입력"
              >
                <Input
                  value={form.tagsRaw}
                  onChange={(v) => set("tagsRaw", v)}
                  placeholder="Next.js 16, Tailwind v4, FastAPI"
                  hasError={false}
                />
              </Field>
            </>
          )}

          {/* 제출 후 에러 요약 */}
          {submitted && Object.keys(errors).length > 0 && (
            <div className="flex items-start gap-2 bg-red-950/40 border border-red-800/50 rounded-xl p-3 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{Object.keys(errors).length}개 항목을 확인해주세요.</span>
            </div>
          )}
        </div>

        {/* 푸터 액션 */}
        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-full text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 rounded-full text-xs font-bold bg-spotify-green hover:bg-spotify-green-hover text-black flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {isEditMode ? "수정 저장" : "링크 추가"}
          </button>
        </div>
      </div>
    </div>
  );
}
