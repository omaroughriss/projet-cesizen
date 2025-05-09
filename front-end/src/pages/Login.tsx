import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card,
  CardContent,
  CardHeader,
  CardFooter
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Logo from '@/components/Logo';
import { authService } from '@/services/auth.service';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!email || !password) {
        throw new Error('Veuillez remplir tous les champs');
      }

      const response = await authService.login(email, password);

      if (!response.user.activated) {
        throw new Error('Votre compte est désactivé. Veuillez contacter un administrateur.');
      }
      
      // Store the token and user info
      localStorage.setItem('token', response.accessToken);
      localStorage.setItem('userName', response.user.firstName);
      localStorage.setItem('userRole', response.user.roleName);
      
      // Redirection basée sur le rôle
      const redirectPath = response.user.roleName === 'administrateur' ? '/admin' : '/';
      navigate(redirectPath);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur CESIZen",
      });
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white to-cesilite/10 page-transition">
      <div className="w-full max-w-md">
        <div className="mb-8 opacity-0 animate-fade-in">
          <Logo svgLogo="/logo.svg" />
        </div>

        <Card className="glass border-cesilite/20 opacity-0 animate-scale-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="text-center">
            <h1 className="text-2xl font-bold text-cesidark">Connexion</h1>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-cesilite/30 focus-visible:ring-cesilite"
                  autoComplete="email"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </label>
                  <button 
                    type="button" 
                    className="text-xs text-cesilite hover:text-cesidark cesi-transition"
                    onClick={() => toast({
                      title: "Fonction à venir",
                      description: "Cette fonctionnalité sera disponible prochainement",
                    })}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-cesilite/30 focus-visible:ring-cesilite"
                  autoComplete="current-password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-cesilite hover:bg-cesidark cesi-transition button-hover"
                disabled={loading}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <button 
              type="button" 
              className="text-sm text-muted-foreground hover:text-cesilite cesi-transition"
              onClick={() => navigate('/register')}
            >
              Pas encore de compte ? <span className="text-cesilite font-medium">Créer un compte</span>
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
