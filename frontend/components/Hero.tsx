"use client";
import { ChevronDown } from "lucide-react";
import HeroCarousel from "./Carousel";
import HeroTag from "./HeroTag";
import Button from "./ui/Button";

const Hero: React.FC = () => {
  const scrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="hero relative"
      // style={{
      //   backgroundColor: '#242a2c',
      //   paddingBottom: '46%'
      // }}
    >
      {/* Hero content placeholder */}
      <HeroCarousel />
      <div className="absolute top-6 right-6 rotate-[20deg]">
        <HeroTag type="New Release" />
      </div>

      {/* Scroll Down Button */}
      <div className="absolute bottom-8 left-8 z-20">
        <Button onClick={scrollDown} size="sm" variant="default">
          <ChevronDown size={20} />
        </Button>
      </div>
    </section>
  );
};

export default Hero;
