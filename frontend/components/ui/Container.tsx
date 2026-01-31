import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className = '' }: ContainerProps) {
  return (
    <div 
      className={`
        w-full
        md:w-[85%] 
        max-w-[2000px] 
        mx-auto 
        min-h-screen 
        bg-background 
        md:border-l-2 
        md:border-r-2 
        border-foreground
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  );
}