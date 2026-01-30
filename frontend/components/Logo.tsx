import Link from "next/link";
import { mont } from "@/lib/fonts";

interface LogoProps {
  size?: string; // Tailwind text size class (e.g., "text-xl", "text-2xl", "text-4xl")
}

const Logo: React.FC<LogoProps> = ({ size = "text-xl" }) => {
  return (
    <Link
      href="/"
      className="group relative inline-block cursor-pointer select-none"
      data-hover
    >
      {/* Red glitch layer - permanently shifted left */}
      <span
        className={`absolute top-0 left-0 opacity-70 transform -translate-x-0.5 text-[#CF5777] font-black ${size} ${mont.className}`}
      >
        INCUS
      </span>

      {/* Blue glitch layer - permanently shifted right */}
      <span
        className={`absolute top-0 left-0 opacity-70 transform translate-x-0.5 text-[#57CFAF] font-black ${size} ${mont.className}`}
      >
        INCUS
      </span>

      {/* Main logo - stays on top */}
      <span
        className={`relative z-10 font-black ${size} ${mont.className}`}
        style={{
          color: "#f3f1ec",
          WebkitTextStrokeWidth: "1px",
          WebkitTextStrokeColor: "#ffffff",
          textShadow: "rgba(255, 255, 255, 0.9) 0px 0px 3px",
        }}
      >
        INCUS
      </span>
    </Link>
  );
};

export default Logo;
