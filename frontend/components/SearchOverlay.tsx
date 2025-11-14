"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Button from "./ui/Button";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      // Focus the input when overlay opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-999 flex items-start justify-center pt-20"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Close button */}
      <div className="absolute top-6 right-6">
        <Button onClick={onClose} aria-label="Close search">
          <X size={24} />
        </Button>
      </div>

      {/* Search input container */}
      <div className="w-full max-w-2xl mx-6">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Releases, Artists, Services, Merch..."
          className="w-full px-6 py-4 text-xl bg-background border-2 border-border rounded-lg focus:outline-none"
        />
      </div>
    </div>
  );
};

export default SearchOverlay;
