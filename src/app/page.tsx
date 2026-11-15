"use client";

import { useEffect, useState } from "react";
import { ProfileData } from "@/types";
import { getStoredProfile, saveStoredProfile } from "@/lib/storage";
import { defaultProfileData } from "@/lib/mockData";
import ProfileView from "@/components/ProfileView";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = getStoredProfile();
    setProfileData(data);
    setIsLoading(false);
  }, []);

  const handleDataChange = (updated: ProfileData) => {
    setProfileData(updated);
    saveStoredProfile(updated);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-spotify-black flex items-center justify-center text-spotify-green font-mono text-sm">
        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-spotify-green" />
          <span>링크 목록을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  return <ProfileView data={profileData} onDataChange={handleDataChange} />;
}
