"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const ACCESS_STORAGE_KEY = "incus-site-access";
const COMING_SOON_PATH = "/coming-soon";

export default function AccessGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [hasCheckedAccess, setHasCheckedAccess] = useState(false);

  const isComingSoon = pathname === COMING_SOON_PATH;

  useEffect(() => {
    if (isComingSoon) return;
    if (typeof window === "undefined") return;

    const hasAccess = window.localStorage.getItem(ACCESS_STORAGE_KEY) === "1";
    if (!hasAccess) {
      router.replace(COMING_SOON_PATH);
      return;
    }
    setHasCheckedAccess(true);
  }, [isComingSoon, router]);

  // Coming soon page: always show content (no gate)
  if (isComingSoon) {
    return <>{children}</>;
  }

  // Protected route: show nothing but loading until we've verified access
  // (avoids flash of hidden content; redirect happens in useEffect)
  if (!hasCheckedAccess) {
    return (
      <div
        className="fixed inset-0 z-50 bg-background"
        aria-hidden="true"
        aria-label="Loading"
      />
    );
  }

  return <>{children}</>;
}
