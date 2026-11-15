export type ThemeType = "spotify-dark" | "github-dark" | "monokai" | "minimal-light";

export interface UserProfile {
  username: string;
  fullName: string;
  role: string;
  bio: string;
  avatar: string;
  verified: boolean;
  monthlyCommits: number;
  reposCount: number;
  uptime: string;
}

export interface UserAccountInfo {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  updatedAt?: number;
}

export interface SocialLinks {
  github?: string;
  blog?: string;
  email?: string;
  linkedin?: string;
}

export type BlockType = "link" | "github_repo" | "tech_stack" | "project";

export interface BlockItem {
  id: string;
  type: BlockType;
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
  order?: number;
  createdAt?: number;
  updatedAt?: number;
  isActive: boolean;
}

export interface ProfileData {
  user: UserProfile;
  theme: ThemeType;
  socialLinks: SocialLinks;
  blocks: BlockItem[];
}
