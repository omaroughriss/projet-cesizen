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

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation basique
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs",
                variant: "destructive",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Erreur",
                description: "Les mots de passe ne correspondent pas",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            await authService.register({
                firstName,
                lastName,
                email,
                password,
                username: email.split('@')[0],
                roleId: 1,
                activated: true,
            });

            toast({
                title: "Inscription réussie",
                description: "Vous pouvez maintenant vous connecter",
            });

            navigate('/login');
        } catch (error) {
            toast({
                title: "Erreur d'inscription",
                description: error instanceof Error ? error.message : "Une erreur est survenue lors de l'inscription",
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
                        <h1 className="text-2xl font-bold text-cesidark">Inscription</h1>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium">
                                        Prénom
                                    </label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        placeholder="Jean"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="border-cesilite/30 focus-visible:ring-cesilite"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium">
                                        Nom
                                    </label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        placeholder="Dupont"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="border-cesilite/30 focus-visible:ring-cesilite"
                                    />
                                </div>
                            </div>

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
                                <label htmlFor="password" className="text-sm font-medium">
                                    Mot de passe
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="border-cesilite/30 focus-visible:ring-cesilite"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium">
                                    Confirmer le mot de passe
                                </label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="border-cesilite/30 focus-visible:ring-cesilite"
                                    autoComplete="new-password"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-cesilite hover:bg-cesidark cesi-transition button-hover"
                                disabled={loading}
                            >
                                {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex justify-center">
                        <button
                            type="button"
                            className="text-sm text-muted-foreground hover:text-cesilite cesi-transition"
                            onClick={() => navigate('/login')}
                        >
                            Déjà un compte ? <span className="text-cesilite font-medium">Se connecter</span>
                        </button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Register; 