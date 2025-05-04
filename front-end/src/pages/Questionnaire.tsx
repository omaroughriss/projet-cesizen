import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StressItem from '@/components/StressItem';
import Layout from '@/components/Layout';
import { useToast } from "@/hooks/use-toast";

// Stress event data
const stressEvents = [
  { id: 'event1', label: 'Perte d\'un proche', points: 100 },
  { id: 'event2', label: 'Divorce', points: 73 },
  { id: 'event3', label: 'Séparation', points: 65 },
  { id: 'event4', label: 'Problème de santé personnel', points: 53 },
  { id: 'event5', label: 'Perte d\'emploi', points: 47 },
  { id: 'event6', label: 'Problème de santé d\'un proche', points: 44 },
  { id: 'event7', label: 'Mariage', points: 50 },
  { id: 'event8', label: 'Perte de revenu', points: 38 },
  { id: 'event9', label: 'Changement de travail', points: 36 },
  { id: 'event10', label: 'Déménagement', points: 30 },
  { id: 'event11', label: 'Difficultés financières', points: 29 },
  { id: 'event12', label: 'Conflit familial', points: 29 },
  { id: 'event13', label: 'Changement d\'horaires de travail', points: 20 },
  { id: 'event14', label: 'Vacances', points: 13 },
];

const Questionnaire: React.FC = () => {
  const [checkedEvents, setCheckedEvents] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (id: string, checked: boolean) => {
    setCheckedEvents(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const calculateResults = () => {
    const score = stressEvents.reduce((total, event) => {
      return total + (checkedEvents[event.id] ? event.points : 0);
    }, 0);
    
    setTotalScore(score);
    setShowResults(true);
    
    // Scroll to results
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
    setCheckedEvents({});
    setShowResults(false);
    toast({
      title: "Questionnaire réinitialisé",
      description: "Vous pouvez maintenant refaire le diagnostic",
    });
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
              {stressEvents.map((event, index) => (
                <StressItem
                  key={event.id}
                  id={event.id}
                  label={event.label}
                  points={event.points}
                  checked={!!checkedEvents[event.id]}
                  onChange={(checked) => handleChange(event.id, checked)}
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
