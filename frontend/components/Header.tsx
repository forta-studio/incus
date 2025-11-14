import { Search, ShoppingCart } from "lucide-react";
import Logo from "./Logo";
import Navigation from "./Navigation";
import Button from "./ui/Button";

const Header: React.FC = () => {
  return (
    <header className="w-full border-b-2 border-foreground bg-background flex items-center">
      <div className="border-r-2 border-foreground px-6 py-4">
        <Logo />
      </div>
      <div className="flex-1 px-6">
        <Navigation />
      </div>
      <div className="px-6 flex items-center space-x-4">
        <Button variant="default" size="md">
            <Search size={20} className="mr-2" />
            <span>Search</span>
        </Button>
        <Button variant="default" size="md">
          <ShoppingCart size={22} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
