
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  buttonText: string;
  to: string;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  image, 
  buttonText, 
  to,
  delay = 0
}) => {
  const delayStyle = {
    animationDelay: `${delay}ms`,
  };
  
  const [imageError, setImageError] = useState(false);
  
  // Fallback image URL
  const fallbackImage = "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop";

  return (
    <div 
      className="glass rounded-2xl p-5 w-full max-w-sm mx-auto mb-6 opacity-0 animate-fade-in flex flex-col h-full"
      style={delayStyle}
    >
      <div className="mb-4 overflow-hidden rounded-xl">
        <img 
          src={imageError ? fallbackImage : image}
          alt={title}
          className="w-full h-40 object-cover transform hover:scale-105 transition-transform duration-500 ease-in-out"
          onError={() => setImageError(true)}
        />
      </div>
      <h3 className="text-xl font-semibold text-cesidark mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
      <Button 
        asChild
        className="w-full mt-auto bg-cesilite hover:bg-cesidark text-white button-hover"
      >
        <Link to={to}>{buttonText}</Link>
      </Button>
    </div>
  );
};

export default FeatureCard;
