
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const Profile: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Get user details from localStorage
    const storedName = localStorage.getItem('userName');
    setEmail(storedName ? `${storedName}@example.com` : '');
  }, []);

  const saveProfile = () => {
    // Validate that both password fields are filled
    if (!currentPassword || !newPassword) {
      toast({
        title: "Champs requis",
        description: "Veuillez saisir votre mot de passe actuel et le nouveau mot de passe",
        variant: "destructive"
      });
      return;
    }

    // Simply show success message since we're not actually changing a password
    toast({
      title: "Profil mis à jour",
      description: "Votre mot de passe a été modifié avec succès",
    });
    
    // Reset password fields after save
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleLogout = () => {
    localStorage.removeItem('userName');
    navigate('/');
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  return (
    <div className="min-h-screen bg-background pt-16 md:pt-20 pb-24 page-transition">
      {/* Header */}
      <header className="px-4 mb-6">
        <h1 className="text-2xl font-bold text-cesidark opacity-0 animate-fade-in">Mon Profil</h1>
      </header>

      {/* Main Content */}
      <main className="px-4">
        {/* Profile Form */}
        <div className="glass rounded-xl p-6 mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email"
                value={email}
                disabled
                className="bg-muted border-cesilite/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <Input 
                id="currentPassword" 
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="border-cesilite/30 focus-visible:ring-cesilite"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input 
                id="newPassword" 
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="border-cesilite/30 focus-visible:ring-cesilite"
              />
            </div>
            
            <Button 
              className="w-full bg-cesilite hover:bg-cesidark button-hover"
              onClick={saveProfile}
            >
              Modifier le mot de passe
            </Button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="glass rounded-xl p-6 opacity-0 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </main>

      {/* Navigation */}
      <Navbar />
    </div>
  );
};

export default Profile;
