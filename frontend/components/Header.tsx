"use client";
import { Search, ShoppingCart } from "lucide-react";
import { useState } from "react";
import Navigation from "./Navigation";
import Button from "./ui/Button";
import Logo from "./Logo";
import SearchOverlay from "./SearchOverlay";

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
      <header className="w-full border-b-2 border-foreground bg-background flex items-center">
        <div className="border-r-2 border-foreground px-6 py-4">
          <Logo />
        </div>
        <div className="flex-1 px-6">
          <Navigation />
        </div>
        <div className="px-6 flex items-center space-x-4 -translate-y-0.5">
          <Button variant="default" size="md" onClick={handleSearchClick}>
            <Search size={20} className="mr-2" />
            <span>Search</span>
          </Button>
          <Button variant="default" size="md">
            <ShoppingCart size={22} />
          </Button>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={handleSearchClose} />
    </>
  );
};

export default Header;
