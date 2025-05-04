import React, { useState } from 'react';
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

// Article data with fixed image URLs
const allArticles = [
  {
    id: 1,
    title: "Comprendre le stress chronique",
    content: "Le stress chronique se distingue du stress aigu par sa durée et son impact. Contrairement au stress aigu qui est une réponse normale à un danger immédiat, le stress chronique persiste sur une longue période. Lorsque vous êtes constamment exposé à des situations stressantes, votre corps maintient un niveau élevé d'hormones de stress, ce qui peut entraîner divers problèmes de santé.",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?q=80&w=2080&auto=format&fit=crop",
    category: "Stress"
  },
  {
    id: 2,
    title: "Améliorer la qualité de votre sommeil",
    content: "La qualité du sommeil influence directement notre santé mentale, notre productivité et notre bien-être général. Pourtant, de nombreuses personnes souffrent d'insomnie ou de troubles du sommeil sans en connaître les causes ou les solutions. Plusieurs facteurs peuvent perturber votre cycle de sommeil : l'exposition aux écrans avant de dormir, la consommation de caféine ou d'alcool, un environnement de sommeil inadapté, et le stress.",
    image: "https://images.unsplash.com/photo-1541410965313-d53b3c16ef17?q=80&w=2048&auto=format&fit=crop",
    category: "Sommeil"
  },
  {
    id: 3,
    title: "La gestion des émotions négatives",
    content: "Les émotions négatives font partie intégrante de l'expérience humaine. Elles ne sont pas intrinsèquement mauvaises et peuvent même nous fournir des informations précieuses sur nos besoins et nos limites. Le problème survient lorsque ces émotions deviennent écrasantes ou lorsque nous les gérons de manière malsaine. La première étape dans la gestion des émotions négatives est de les reconnaître et de les nommer.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    category: "Emotions"
  },
  {
    id: 4,
    title: "Les bienfaits de la méditation quotidienne",
    content: "La méditation est une pratique millénaire qui a gagné en popularité ces dernières années, et pour cause. Les recherches scientifiques confirment ce que les pratiquants savent depuis longtemps : la méditation régulière offre de nombreux bienfaits pour la santé mentale et physique. En pratiquant la méditation de pleine conscience ne serait-ce que 10 minutes par jour, vous pouvez réduire significativement votre niveau de stress.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2022&auto=format&fit=crop",
    category: "Stress"
  },
  {
    id: 5,
    title: "L'importance de l'équilibre travail-vie personnelle",
    content: "Dans notre société axée sur la performance, trouver un équilibre sain entre le travail et la vie personnelle est devenu un véritable défi. Pourtant, cet équilibre est essentiel pour maintenir une bonne santé mentale et prévenir l'épuisement professionnel. Le déséquilibre travail-vie personnelle se manifeste souvent par une sensation constante de manquer de temps, des difficultés à déconnecter du travail, et une négligence des relations personnelles.",
    image: "https://images.unsplash.com/photo-1530023367847-a683933f4172?q=80&w=1887&auto=format&fit=crop",
    category: "Stress"
  },
  {
    id: 6,
    title: "Techniques de respiration pour l'anxiété",
    content: "La respiration est une fonction automatique que nous tenons souvent pour acquise. Pourtant, en prenant conscience de notre respiration et en l'adaptant intentionnellement, nous pouvons influencer profondément notre état mental et émotionnel. Lorsque nous sommes anxieux, notre respiration devient généralement rapide et superficielle, ce qui peut exacerber les symptômes d'anxiété comme les palpitations.",
    image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop",
    category: "Emotions"
  }
];

const Articles: React.FC = () => {
  const [articles, setArticles] = useState(allArticles);
  const [filter, setFilter] = useState("Tous");
  const [selectedArticle, setSelectedArticle] = useState<typeof allArticles[0] | null>(null);
  const navigate = useNavigate();

  const filterCategories = ["Tous", "Stress", "Sommeil", "Emotions"];

  const handleFilterChange = (category: string) => {
    setFilter(category);
    if (category === "Tous") {
      setArticles(allArticles);
    } else {
      setArticles(allArticles.filter(article => article.category === category));
    }
  };

  const openArticle = (article: typeof allArticles[0]) => {
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
          {filterCategories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              size="sm"
              className={`
                rounded-full whitespace-nowrap
                ${filter === category 
                  ? 'bg-cesilite hover:bg-cesidark' 
                  : 'border-cesilite/30 text-cesidark hover:bg-cesilite/10'
                }
              `}
              onClick={() => handleFilterChange(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </header>

      {/* Article List */}
      <main className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div key={article.id} className="w-full">
                <ArticleCard
                  title={article.title}
                  content={article.content}
                  image={article.image}
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
                  Catégorie: {selectedArticle.category}
                </DialogDescription>
              </DialogHeader>
              
              <div className="my-4 rounded-lg overflow-hidden">
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title} 
                  className="w-full h-[200px] md:h-[300px] object-cover"
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
