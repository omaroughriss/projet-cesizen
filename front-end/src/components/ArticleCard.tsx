
import React from 'react';
import { Button } from "@/components/ui/button";

interface ArticleCardProps {
  title: string;
  content: string;
  image: string;
  onClick: () => void;
  index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  title, 
  content, 
  image, 
  onClick,
  index
}) => {
  // Calculate staggered animation delay based on index
  const delay = index * 100;
  
  return (
    <div 
      className="glass rounded-xl overflow-hidden h-full opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col h-full">
        <div className="w-full h-40">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop";
            }}
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-lg text-cesidark mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-3 flex-grow">{content}</p>
          <Button 
            onClick={onClick}
            variant="outline" 
            className="text-cesilite border-cesilite hover:bg-cesilite hover:text-white button-hover mt-auto"
          >
            Lire plus
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
