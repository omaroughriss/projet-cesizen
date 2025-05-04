import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, BarChart2, User, Menu, BookText } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Logo from '@/components/Logo';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Accueil', path: '/', icon: Home },
    { name: 'Diagnostic', path: '/questionnaire', icon: BarChart2 },
    { name: 'Articles', path: '/articles', icon: BookText },
    { name: 'Profil', path: '/profile', icon: User }
  ];

  // Mobile Bottom Navigation - now with sticky positioning
  if (isMobile) {
    return (
      <div className="sticky bottom-0 left-0 right-0 z-50">
        <div className="glass mx-4 mb-4 rounded-xl px-1 py-2 flex justify-around items-center shadow-lg border border-cesilite/20">
          {navItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center justify-center px-5 py-2 rounded-lg cesi-transition ${
                isActive(item.path) 
                  ? 'text-cesilite font-medium bg-cesilite/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    );
  }

  // Desktop Top Navigation
  return (
    <>
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 glass py-2 px-4 border-b border-cesilite/20 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Left - Burger Menu */}
          <div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-cesilite/10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="border-cesilite/20 w-64 pt-10 bg-slate-50">
                <nav className="flex flex-col gap-2 mt-4">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg cesi-transition ${
                        isActive(item.path)
                          ? 'text-cesilite font-medium bg-cesilite/10'
                          : 'text-muted-foreground hover:text-foreground hover:bg-cesilite/5'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Center - Title */}
          <h1 className="text-lg font-medium text-cesidark">CESIZEN</h1>
          
          {/* Right - Empty space for symmetry */}
          <div className="w-10 h-10"></div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
