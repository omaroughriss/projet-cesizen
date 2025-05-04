
import React from 'react';

interface LogoProps {
  svgLogo?: string;
}

const Logo: React.FC<LogoProps> = ({ svgLogo }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="text-2xl md:text-3xl font-bold tracking-tighter relative flex items-center">
          {svgLogo ? (
            <img src={svgLogo} alt="CESI Logo" className="h-0 md:h-40 mb-0 mt-0" />
          ) : null}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cesidark to-cesilite rounded-full transform scale-x-100 origin-left"></div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Santé mentale et bien-être</p>
      </div>
    </div>
  );
};

export default Logo;
