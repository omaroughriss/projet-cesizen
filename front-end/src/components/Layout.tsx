import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 pb-24 page-transition">
        {children}
      </div>
      <Navbar />
    </div>
  );
};

export default Layout; 