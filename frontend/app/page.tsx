"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import LatestReleases from "@/components/LatestReleases";
import StoreSection from "@/components/StoreSection";
import Divide from "@/components/ui/Divide";

const ACCESS_STORAGE_KEY = "incus-site-access";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasAccess = window.localStorage.getItem(ACCESS_STORAGE_KEY) === "1";
    if (!hasAccess) {
      router.replace("/coming-soon");
    }
  }, [router]);

  return (
    <>
      <Hero />
      <Divide />
      <LatestReleases />
      <Divide />
      <StoreSection />
    </>
  );
}

