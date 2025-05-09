import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import ArticleCard from '@/components/ArticleCard';
import Layout from '@/components/Layout';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { articleService } from '@/services/article.service';
import { categoryService } from '@/services/category.service';
import { Article, Category } from '@/types';
import { API_CONFIG } from '@/services/api';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<string>("Tous");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesData, categoriesData] = await Promise.all([
          articleService.getAllArticles(),
          categoryService.getAllCategories()
        ]);
        setArticles(articlesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFilterChange = async (categoryId: number | 'all') => {
    setLoading(true);
    try {
      if (categoryId === 'all') {
        const allArticles = await articleService.getAllArticles();
        setArticles(allArticles);
        setFilter("Tous");
      } else {
        const filteredArticles = await articleService.getArticlesByCategoryId(categoryId);
        setArticles(filteredArticles);
        setFilter(categories.find(cat => cat.id === categoryId)?.categoryName || "");
      }
    } catch (error) {
      console.error('Erreur lors du filtrage des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const openArticle = (article: Article) => {
    setSelectedArticle(article);
  };

  return (
    <Layout>
      {/* Header */}
      <header className="px-4 mb-6">
        <div className="flex items-center mb-4 opacity-0 animate-fade-in">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 mr-2"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="w-5 h-5 text-cesidark" />
          </Button>
          <h1 className="text-2xl font-bold text-cesidark">Infos sur la santé mentale</h1>
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 opacity-0 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Button
            key="all"
            variant={filter === "Tous" ? "default" : "outline"}
            size="sm"
            className={`
              rounded-full whitespace-nowrap
              ${filter === "Tous" 
                ? 'bg-cesilite hover:bg-cesidark' 
                : 'border-cesilite/30 text-cesidark hover:bg-cesilite/10'
              }
            `}
            onClick={() => handleFilterChange('all')}
          >
            Tous
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filter === category.categoryName ? "default" : "outline"}
              size="sm"
              className={`
                rounded-full whitespace-nowrap
                ${filter === category.categoryName 
                  ? 'bg-cesilite hover:bg-cesidark' 
                  : 'border-cesilite/30 text-cesidark hover:bg-cesilite/10'
                }
              `}
              onClick={() => handleFilterChange(category.id)}
            >
              {category.categoryName}
            </Button>
          ))}
        </div>
      </header>

      {/* Article List */}
      <main className="px-4">
        {loading ? (
          <div className="text-center py-10 text-muted-foreground">
            Chargement des articles...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.length > 0 ? (
              articles.map((article, index) => (
                <div key={article.id} className="w-full">
                  <ArticleCard
                    article={article}
                    onClick={() => openArticle(article)}
                    index={index}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-muted-foreground col-span-full">
                Aucun article trouvé pour cette catégorie.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Article Dialog */}
      <Dialog open={!!selectedArticle} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl md:text-2xl text-cesidark">
                  {selectedArticle.title}
                </DialogTitle>
                <DialogDescription className="text-right text-xs text-muted-foreground">
                  Catégorie: {selectedArticle.category.categoryName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-4 rounded-lg overflow-hidden">
                <img 
                  src={selectedArticle.image}
                  alt={selectedArticle.title} 
                  className="w-full h-[200px] md:h-[300px] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=2070&auto=format&fit=crop";
                  }}
                />
              </div>
              
              <div className="space-y-4">
                {selectedArticle.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="text-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              
              <DialogFooter>
                <Button
                  className="w-full mt-4 bg-cesilite hover:bg-cesidark button-hover"
                  onClick={() => setSelectedArticle(null)}
                >
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Articles;
