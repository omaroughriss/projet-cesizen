import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article,
  onClick,
  index
}) => {
  const [imageError, setImageError] = useState(false);
  const delay = index * 100;
  
  const fallbackImage = "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop";
  
  return (
    <div 
      className="glass rounded-xl overflow-hidden h-full opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col h-full">
        <div className="w-full h-40 relative">
          <img 
            src={imageError ? fallbackImage : article.image} 
            alt={article.title} 
            className="w-full h-full object-cover transition-opacity duration-200"
            onError={() => setImageError(true)}
            loading="lazy"
          />
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
              <span className="text-sm text-gray-500">Image non disponible</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-lg text-cesidark mb-2">{article.title}</h3>
          <p className="text-muted-foreground text-sm mb-3 line-clamp-3 flex-grow">{article.content}</p>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-xs text-muted-foreground">
              {article.category.categoryName}
            </span>
            <Button 
              onClick={onClick}
              variant="outline" 
              className="text-cesilite border-cesilite hover:bg-cesilite hover:text-white button-hover"
            >
              Lire plus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
