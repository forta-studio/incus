"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import LatestReleases from "@/components/LatestReleases";
import StoreSection from "@/components/StoreSection";
import Divide from "@/components/ui/Divide";

const ACCESS_STORAGE_KEY = "incus-site-access";

export default function Home() {
  const router = useRouter();
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasAccess = window.localStorage.getItem(ACCESS_STORAGE_KEY) === "1";
    if (!hasAccess) {
      router.replace("/coming-soon");
      return;
    }
    setHasCheckedAccess(true);
  }, [router]);

  return (
    <>
      {!hasCheckedAccess && (
        <div
          className="fixed inset-0 z-50 bg-background"
          aria-hidden="true"
          aria-label="Loading"
        />
      )}
      <Hero />
      <Divide />
      <LatestReleases />
      <Divide />
      <StoreSection />
    </>
  );
}
