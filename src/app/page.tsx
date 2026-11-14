"use client";

import { useEffect, useState } from "react";
import { ProfileData } from "@/types";
import { getStoredProfile } from "@/lib/storage";
import { defaultProfileData } from "@/lib/mockData";
import ProfileView from "@/components/ProfileView";

export default function Home() {
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 클라이언트 사이드에서 로컬 스토리지의 프로필 데이터 로드
    const data = getStoredProfile();
    setProfileData(data);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-[#1ed760] font-mono text-sm">
        <div className="flex items-center gap-2">
          <span className="animate-spin text-lg">⚙️</span>
          <span>프로필 로딩 중...</span>
        </div>
      </div>
    );
  }

  return <ProfileView data={profileData} />;
}
