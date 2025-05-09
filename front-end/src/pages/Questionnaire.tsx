import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StressItem from '@/components/StressItem';
import Layout from '@/components/Layout';
import { useToast } from "@/hooks/use-toast";
import { questionService } from '@/services/question.service';
import { Question } from '@/types';

const Questionnaire: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const fetchedQuestions = await questionService.getAllQuestions();
      setQuestions(fetchedQuestions);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les questions",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleChange = (id: string, checked: boolean) => {
    setCheckedQuestions(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const calculateResults = () => {
    const score = questions.reduce((total, question) => {
      return total + (checkedQuestions[question.id.toString()] ? question.score : 0);
    }, 0);
    
    setTotalScore(score);
    setShowResults(true);
    
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const getStressLevel = (score: number) => {
    if (score < 150) return { level: 'Faible', color: 'text-green-500', message: 'Votre niveau de stress est relativement bas. Continuez à prendre soin de vous !' };
    if (score < 300) return { level: 'Modéré', color: 'text-amber-500', message: 'Votre niveau de stress est modéré. Pensez à intégrer des pratiques de relaxation dans votre quotidien.' };
    return { level: 'Élevé', color: 'text-red-500', message: 'Votre niveau de stress est élevé. Il serait bénéfique de consulter un professionnel de la santé.' };
  };

  const stressEvaluation = getStressLevel(totalScore);

  const resetQuestionnaire = () => {
    setCheckedQuestions({});
    setShowResults(false);
    toast({
      title: "Questionnaire réinitialisé",
      description: "Vous pouvez maintenant refaire le diagnostic",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p>Chargement des questions...</p>
        </div>
      </Layout>
    );
  }

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
          <h1 className="text-2xl font-bold text-cesidark">Évalue ton niveau de stress</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4">
        {showResults ? (
          <div className="glass rounded-xl p-6 mb-6 animate-scale-in">
            <h2 className="text-xl font-semibold text-cesidark mb-4">Résultats de votre diagnostic</h2>
            
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Votre score total :</p>
              <p className="text-3xl font-bold text-cesidark">{totalScore} points</p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-1">Niveau de stress :</p>
              <p className={`text-2xl font-bold ${stressEvaluation.color}`}>
                {stressEvaluation.level}
              </p>
              <p className="mt-4 text-foreground">{stressEvaluation.message}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                className="bg-cesilite hover:bg-cesidark button-hover"
                onClick={resetQuestionnaire}
              >
                Refaire le diagnostic
              </Button>
              <Button 
                variant="outline" 
                className="border-cesilite text-cesilite hover:bg-cesilite hover:text-white button-hover"
                onClick={() => navigate('/articles')}
              >
                Voir les articles sur le stress
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="glass rounded-xl p-4 mb-6 opacity-0 animate-fade-in">
              <p className="text-foreground">
                Cochez les événements que vous avez vécus durant les 12 derniers mois. 
                Chaque événement contribue différemment à votre niveau de stress global.
              </p>
            </div>
            
            <div className="mb-6">
              {questions.map((question, index) => (
                <StressItem
                  key={question.id}
                  id={question.id.toString()}
                  label={question.question}
                  points={question.score}
                  checked={!!checkedQuestions[question.id.toString()]}
                  onChange={(checked) => handleChange(question.id.toString(), checked)}
                  index={index}
                />
              ))}
            </div>
            
            <Button 
              className="w-full bg-cesidark hover:bg-cesilite button-hover"
              onClick={calculateResults}
            >
              Calculer mon niveau de stress
            </Button>
          </>
        )}
      </main>
    </Layout>
  );
};

export default Questionnaire;
