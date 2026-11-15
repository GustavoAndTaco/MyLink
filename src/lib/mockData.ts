import { ProfileData } from "@/types";

/**
 * 초기 기본 프로필 상태 (더미 링크 없이 빈 상태로 시작)
 */
export const defaultProfileData: ProfileData = {
  user: {
    username: "GustavoAndTaco",
    fullName: "Gustavo",
    role: "Full-Stack Developer",
    bio: "개발과 일상을 기록하는 나만의 링크 허브입니다. 이름, 사진, 소개글을 클릭해 자유롭게 수정해보세요.",
    avatar: "👨‍💻",
    verified: true,
    monthlyCommits: 0,
    reposCount: 0,
    uptime: "99.9%",
  },
  theme: "spotify-dark",
  socialLinks: {
    github: "https://github.com/GustavoAndTaco/MyLink",
    blog: "",
    email: "",
    linkedin: "",
  },
  blocks: [],
};
