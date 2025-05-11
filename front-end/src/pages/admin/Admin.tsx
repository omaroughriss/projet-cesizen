import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Tag, ArrowLeft, BarChart2 } from 'lucide-react';
import Logo from '@/components/Logo';

const Admin: React.FC = () => {
  const navigate = useNavigate();

  const adminModules = [
    {
      title: "Gestion des utilisateurs",
      description: "Gérer les comptes utilisateurs, activer ou désactiver un compte",
      icon: <Users className="h-8 w-8 text-cesidark" />,
      path: "/admin/users"
    },
    {
      title: "Gestion des articles",
      description: "Ajouter, modifier ou supprimer des articles",
      icon: <FileText className="h-8 w-8 text-cesidark" />,
      path: "/admin/articles"
    },
    {
      title: "Gestion des catégories",
      description: "Créer, modifier ou supprimer des catégories d'articles",
      icon: <Tag className="h-8 w-8 text-cesidark" />,
      path: "/admin/categories"
    },
    {
      title: "Gestion du questionnaire de stress",
      description: "Ajouter, modifier ou supprimer des questions et leurs scores",
      icon: <BarChart2 className="h-8 w-8 text-cesidark" />,
      path: "/admin/stress-questionnaire"
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1"
            onClick={() => navigate('/home')}
          >
            <ArrowLeft className="w-5 h-5 text-cesidark mr-2" />
            <span>Retour à l'application</span>
          </Button>
          <h1 className="text-2xl font-bold text-cesidark">Administration CESIZen</h1>
        </header>

        <div className="mb-8">
          <p className="text-muted-foreground">
            Gérez les utilisateurs, les articles et les catégories de votre application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminModules.map((module, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-muted/30 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-cesidark">{module.title}</CardTitle>
                  {module.icon}
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Button 
                  className="w-full bg-cesilite hover:bg-cesidark button-hover"
                  onClick={() => navigate(module.path)}
                >
                  Accéder
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
