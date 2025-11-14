"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { mont } from "@/lib/fonts";

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = "" }) => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/artists", label: "Artists" },
    { href: "/releases", label: "Releases" },
    {
      href: "/store?filter=sample-packs",
      label: "Sample Packs",
      matchPath: "/store",
    },
    { href: "/store", label: "Store" },
    { href: "/contact", label: "Contact" },
  ];

  const isCurrentPage = (link: (typeof navLinks)[0]) => {
    const pathToMatch = link.matchPath || link.href.split("?")[0];

    // Check for exact match first
    if (pathname === pathToMatch) return true;

    // Check if current path starts with the nav section (for child pages)
    // e.g., /store/product-123 should make "Store" bold
    if (pathname.startsWith(pathToMatch + "/")) return true;

    return false;
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const originalText = container.querySelector(
      ".original-text"
    ) as HTMLElement;
    const duplicateText = container.querySelector(
      ".duplicate-text"
    ) as HTMLElement;

    // Kill any existing animations
    gsap.killTweensOf([originalText, duplicateText]);

    // Reset and set initial states
    gsap.set(originalText, { y: "0%" });
    gsap.set(duplicateText, {
      y: "100%",
      visibility: "visible",
    });

    // Start hover animations
    gsap.to(originalText, {
      y: "-100%",
      duration: 0.4,
      ease: "expo.out",
    });

    gsap.to(duplicateText, {
      y: "0%",
      duration: 0.4,
      ease: "expo.out",
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const originalText = container.querySelector(
      ".original-text"
    ) as HTMLElement;
    const duplicateText = container.querySelector(
      ".duplicate-text"
    ) as HTMLElement;

    // Kill any existing animations
    gsap.killTweensOf([originalText, duplicateText]);

    // Start leave animations
    gsap.to(originalText, {
      y: "0%",
      duration: 0.4,
      ease: "expo.out",
    });

    gsap.to(duplicateText, {
      y: "100%",
      duration: 0.4,
      ease: "expo.out",
      onComplete: () => {
        gsap.set(duplicateText, { visibility: "hidden" });
      },
    });
  };

  return (
    <nav className={`flex gap-6 items-center ${className}`}>
      {navLinks.map((link) => (
        <div key={link.href} className="flex items-center">
          <Link href={link.href}>
            <div
              className="relative overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`original-text text-foreground uppercase leading-none text-md ${
                  mont.className
                } ${isCurrentPage(link) ? "font-black" : "font-semibold"}`}
                style={{
                  letterSpacing: isCurrentPage(link) ? "0px" : "0.8px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                }}
              >
                {link.label}
              </div>
              <div
                className={`duplicate-text absolute top-0 left-0 invisible text-foreground uppercase font-black leading-none text-md ${mont.className}`}
                style={{
                  transform: "translateY(100%)",
                  letterSpacing: "0px",
                  paddingTop: "2px",
                  paddingBottom: "2px",
                }}
              >
                {link.label}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default Navigation;
