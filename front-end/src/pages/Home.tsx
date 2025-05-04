import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import FeatureCard from '@/components/FeatureCard';

const Home: React.FC = () => {
  const [userName, setUserName] = useState('');
  
  useEffect(() => {
    // Get user name from localStorage (set during login)
    const storedName = localStorage.getItem('userName');
    setUserName(storedName || 'Utilisateur');
  }, []);

  // Feature card data
  const features = [
    {
      title: "Santé Mentale",
      description: "Découvrez des articles utiles pour mieux comprendre votre bien-être mental.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop",
      buttonText: "Explorer",
      to: "/articles"
    },
    {
      title: "Diagnostic de stress",
      description: "Faites un point sur votre niveau de stress.",
      image: "https://images.unsplash.com/photo-1488709619751-5e6385a9aea5?q=80&w=2070&auto=format&fit=crop",
      buttonText: "Commencer",
      to: "/questionnaire"
    }
  ];

  return (
    <Layout>
      {/* Header */}
      <header className="px-4 mb-8 opacity-0 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cesidark">
              Bienvenue, <span className="text-cesilite">{userName}</span>
            </h1>
            <p className="text-muted-foreground text-sm">Comment allez-vous aujourd'hui ?</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              buttonText={feature.buttonText}
              to={feature.to}
              delay={index * 200}
            />
          ))}
        </div>
      </main>
    </Layout>
  );
};

export default Home;
