import React from 'react';
import HeroCarousel from './Carousel';

const Hero: React.FC = () => {
  return (
    <section 
      className="hero"
      // style={{
      //   backgroundColor: '#242a2c',
      //   paddingBottom: '46%'
      // }}
    >
      {/* Hero content placeholder */}
      <HeroCarousel />
    </section>
  );
};

export default Hero;