import { Suspense } from "react";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import PublicProfileClient from "@/components/PublicProfileClient";

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ displayName: string }>;
}) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <PublicProfileClient params={params} />
    </Suspense>
  );
}
