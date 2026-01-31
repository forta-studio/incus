"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface LocomotiveScrollInstance {
  destroy: () => void;
}

export default function LocomotiveScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const locomotiveRef = useRef<LocomotiveScrollInstance | null>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    let scroll: LocomotiveScrollInstance | null = null;

    import("locomotive-scroll").then((module) => {
      const LocomotiveScroll = module.default;
      scroll = new LocomotiveScroll({
        el: scrollRef.current as HTMLElement,
        smooth: true,
      });
      locomotiveRef.current = scroll;
    });

    return () => {
      scroll?.destroy();
      locomotiveRef.current = null;
    };
  }, [pathname]);

  return (
    <div ref={scrollRef} data-scroll-container>
      {children}
    </div>
  );
}
